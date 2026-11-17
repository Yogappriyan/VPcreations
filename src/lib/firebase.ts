import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  FirebaseStorage 
} from 'firebase/storage';
import { 
  Project, 
  Service, 
  Skill, 
  Experience, 
  Testimonial, 
  Enquiry, 
  WebsiteSettings 
} from '../types';
import { 
  defaultProjects, 
  defaultServices, 
  defaultSkills, 
  defaultExperiences, 
  defaultTestimonials, 
  defaultSettings 
} from '../data/defaultData';
import {
  normalizeUrl,
  sanitizeSlug,
  sanitizeForFirestore,
  emitDataSync
} from './utils';
import {
  idbGet,
  idbSet,
  compressImageFileToDataUrl,
  compressDataUrlIfOversized
} from './storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  try {
    // 1. Check localStorage override from Admin UI
    const customConfig = localStorage.getItem('vp_firebase_config');
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed.apiKey && parsed.projectId) return parsed;
    }
    
    // 2. Check environment variables
    const metaEnv = (import.meta as any).env || {};
    const envConfig: FirebaseConfig = {
      apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
      authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: metaEnv.VITE_FIREBASE_APP_ID || '',
    };

    if (envConfig.apiKey && envConfig.projectId) {
      return envConfig;
    }
  } catch (err) {
    console.warn("Error reading firebase config:", err);
  }
  return null;
}

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let storageInstance: FirebaseStorage | null = null;

export function initFirebase() {
  const config = getStoredFirebaseConfig();
  if (!config) return null;

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }
    firestoreInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    storageInstance = getStorage(appInstance);
    return { app: appInstance, db: firestoreInstance, auth: authInstance, storage: storageInstance };
  } catch (e) {
    console.error("Firebase init failed:", e);
    return null;
  }
}

// Initialize on module load if config exists
initFirebase();

export function isFirebaseConfigured(): boolean {
  return !!getStoredFirebaseConfig() && !!firestoreInstance;
}

export { firestoreInstance as db, authInstance as auth, storageInstance as storage };

// --- Local Storage Cache Helpers (Provides instant response & offline demo fallback) ---
const LOCAL_KEYS = {
  projects: 'vp_portfolio_projects',
  deletedProjects: 'vp_portfolio_deleted_projects',
  services: 'vp_portfolio_services',
  deletedServices: 'vp_portfolio_deleted_services',
  skills: 'vp_portfolio_skills',
  deletedSkills: 'vp_portfolio_deleted_skills',
  experience: 'vp_portfolio_experience',
  deletedExperience: 'vp_portfolio_deleted_experience',
  testimonials: 'vp_portfolio_testimonials',
  deletedTestimonials: 'vp_portfolio_deleted_testimonials',
  enquiries: 'vp_portfolio_enquiries',
  deletedEnquiries: 'vp_portfolio_deleted_enquiries',
  settings: 'vp_portfolio_settings',
  adminAuth: 'vp_admin_authenticated'
};

const LEGACY_SKIP_IDS = new Set([
  'dressup-closets',
  'n8n-business-pipeline',
  'tiaara-clothing'
]);

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

async function readCache<T>(key: string, fallback: T): Promise<T> {
  const idbVal = await idbGet<T>(key);
  if (idbVal !== null && idbVal !== undefined) {
    return idbVal;
  }
  const lsVal = getLocal<T | null>(key, null);
  if (lsVal !== null && lsVal !== undefined) {
    void idbSet(key, lsVal);
    return lsVal;
  }
  return fallback;
}

async function writeCache<T>(key: string, value: T): Promise<void> {
  const savedToIdb = await idbSet(key, value);
  const serialized = JSON.stringify(value);

  try {
    localStorage.setItem(key, serialized);
    return;
  } catch {
    // If localStorage is full (5MB cap, typically caused by base64 images),
    // preserve existing projects in IndexedDB and evict bloated localStorage projects cache so small keys succeed.
    if (savedToIdb) {
      try {
        const existingLsProjects = getLocal<Project[] | null>(LOCAL_KEYS.projects, null);
        if (existingLsProjects && key !== LOCAL_KEYS.projects) {
          const existingIdbProjects = await idbGet<Project[]>(LOCAL_KEYS.projects);
          if (!existingIdbProjects) {
            await idbSet(LOCAL_KEYS.projects, existingLsProjects);
          }
        }
        localStorage.removeItem(LOCAL_KEYS.projects);
        if (key !== LOCAL_KEYS.projects) {
          localStorage.setItem(key, serialized);
        }
      } catch {
        // IndexedDB still has the authoritative data
      }
      return;
    }

    throw new Error('Unable to save changes to browser storage. Please use a smaller image or image URL.');
  }
}

function isNewer(a?: string, b?: string): boolean {
  if (!a) return false;
  if (!b) return true;
  return new Date(a).getTime() >= new Date(b).getTime();
}

// --- Dynamic CRUD API (Syncs with Firestore when available, otherwise uses resilient local persistence) ---

export const DataService = {
  // SETTINGS
  async getSettings(): Promise<WebsiteSettings> {
    const local = await readCache<WebsiteSettings & { updatedAt?: string }>(LOCAL_KEYS.settings, defaultSettings);
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'settings');
        const snap = await getDocs(col);
        const generalDoc = snap.docs.find(d => d.id === 'general') || snap.docs.find(d => d.id !== 'deleted_records');
        if (generalDoc) {
          const remote = { ...defaultSettings, ...generalDoc.data() } as WebsiteSettings & { updatedAt?: string };
          if (local.updatedAt && !isNewer(remote.updatedAt, local.updatedAt)) {
            return { ...defaultSettings, ...local };
          }
          await writeCache(LOCAL_KEYS.settings, remote);
          return remote;
        }
      } catch (err) {
        console.warn("Firestore getSettings fallback to local cache:", err);
      }
    }
    return { ...defaultSettings, ...local };
  },

  async saveSettings(settings: WebsiteSettings): Promise<void> {
    const payload = sanitizeForFirestore({
      ...defaultSettings,
      ...settings,
      updatedAt: new Date().toISOString()
    });
    await writeCache(LOCAL_KEYS.settings, payload);
    emitDataSync('settings');

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'settings', 'general'), payload, { merge: true });
      } catch (err) {
        console.error("Failed to save settings to Firestore:", err);
      }
    }
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    // 1. Load set of deleted project IDs/slugs so deleted items never resurrect
    const deletedList = await readCache<string[]>(LOCAL_KEYS.deletedProjects, []);
    const deletedSet = new Set<string>(deletedList);

    if (firestoreInstance) {
      try {
        const delSnap = await getDoc(doc(firestoreInstance, 'settings', 'deleted_records'));
        if (delSnap.exists()) {
          const data = delSnap.data();
          if (Array.isArray(data.deletedProjectIds)) {
            data.deletedProjectIds.forEach((dId: string) => deletedSet.add(dId));
            await writeCache(LOCAL_KEYS.deletedProjects, Array.from(deletedSet));
          }
        }
      } catch {
        // silent fallback
      }
    }

    const isSkipped = (p: Partial<Project>, fallbackKey?: string) => {
      const key = fallbackKey || p.id || p.slug || '';
      return (
        LEGACY_SKIP_IDS.has(key) ||
        (p.id ? LEGACY_SKIP_IDS.has(p.id) || deletedSet.has(p.id) : false) ||
        (p.slug ? LEGACY_SKIP_IDS.has(p.slug) || deletedSet.has(p.slug) : false) ||
        deletedSet.has(key)
      );
    };

    // 2. Seed initial map from defaultProjects (excluding deleted and legacy mock items)
    const projectMap = new Map<string, Project>();
    for (const dp of defaultProjects) {
      const dpKey = dp.id || dp.slug;
      if (isSkipped(dp, dpKey)) continue;
      projectMap.set(dpKey, { ...dp });
    }

    // 3. Merge Firestore documents if available (Firestore overrides defaultProjects!)
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'projects');
        const snap = await getDocs(col);

        snap.docs.forEach(d => {
          const docData = { ...d.data(), id: d.id } as Project;
          const key = docData.id || docData.slug;
          if (!key || isSkipped(docData, key)) return;

          if (projectMap.has(key)) {
            const base = projectMap.get(key)!;
            const liveUrl = docData.liveUrl && docData.liveUrl.includes('example.com')
              ? base.liveUrl
              : docData.liveUrl;
            projectMap.set(key, {
              ...base,
              ...docData,
              liveUrl: liveUrl !== undefined ? liveUrl : base.liveUrl
            });
          } else {
            projectMap.set(key, docData);
          }
        });

        // Seed only non-deleted defaults on first connect when authenticated
        if (authInstance?.currentUser && snap.empty) {
          for (const dp of defaultProjects) {
            const dpKey = dp.id || dp.slug;
            if (!isSkipped(dp, dpKey)) {
              try {
                await setDoc(doc(firestoreInstance, 'projects', dpKey), sanitizeForFirestore(dp), { merge: true });
              } catch {
                // ignore permission error
              }
            }
          }
        }
      } catch (err) {
        console.warn("Firestore getProjects notice (using local cache):", err);
      }
    }

    // 4. Merge local/IndexedDB cache (preserves all local edits & additions, and beats stale Firestore if newer)
    const cached = await readCache<Project[]>(LOCAL_KEYS.projects, []);
    if (Array.isArray(cached) && cached.length > 0) {
      for (const cp of cached) {
        const key = cp.id || cp.slug;
        if (!key || isSkipped(cp, key)) continue;

        if (projectMap.has(key)) {
          const existing = projectMap.get(key)!;
          if (!firestoreInstance || isNewer(cp.updatedAt, existing.updatedAt)) {
            projectMap.set(key, { ...existing, ...cp });
          }
        } else {
          projectMap.set(key, cp);
        }
      }
    }

    const allProjects = Array.from(projectMap.values());
    allProjects.sort((a, b) => {
      const orderDiff = (a.order ?? 99) - (b.order ?? 99);
      if (orderDiff !== 0) return orderDiff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    await writeCache(LOCAL_KEYS.projects, allProjects);
    return allProjects;
  },

  async saveProject(project: Project): Promise<void> {
    const cleanId = (project.id || '').trim() || `proj-${Date.now()}`;
    const cleanSlug = sanitizeSlug(project.slug || project.title || cleanId) || cleanId;

    // Automatically shrink oversized inline base64 images so both local storage and Firestore stay lean
    const compressedCover = await compressDataUrlIfOversized((project.image || '').trim());
    const compressedGallery = Array.isArray(project.gallery)
      ? await Promise.all(project.gallery.map(img => compressDataUrlIfOversized(img)))
      : undefined;

    const savedProject: Project = {
      ...project,
      id: cleanId,
      slug: cleanSlug,
      title: (project.title || '').trim(),
      image: compressedCover || '/images/topfashion.jpg',
      gallery: compressedGallery,
      liveUrl: normalizeUrl(project.liveUrl),
      githubUrl: normalizeUrl(project.githubUrl),
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If saving/re-adding, remove from deleted tracking
    const deletedList = await readCache<string[]>(LOCAL_KEYS.deletedProjects, []);
    const updatedDeleted = deletedList.filter(d => d !== savedProject.id && d !== savedProject.slug);
    await writeCache(LOCAL_KEYS.deletedProjects, updatedDeleted);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'settings', 'deleted_records'), {
          deletedProjectIds: updatedDeleted,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch {
        // ignore if not authenticated in Firebase
      }
    }

    const projects = await this.getProjects();
    let existingIndex = projects.findIndex(p => p.id === savedProject.id);
    if (existingIndex < 0) {
      existingIndex = projects.findIndex(p => p.slug === savedProject.slug);
    }

    let updated: Project[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = savedProject;
    } else {
      updated = [savedProject, ...projects];
    }

    updated.sort((a, b) => {
      const orderDiff = (a.order ?? 99) - (b.order ?? 99);
      if (orderDiff !== 0) return orderDiff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    await writeCache(LOCAL_KEYS.projects, updated);
    emitDataSync('projects');

    if (firestoreInstance) {
      try {
        await setDoc(
          doc(firestoreInstance, 'projects', savedProject.id),
          sanitizeForFirestore(savedProject),
          { merge: true }
        );
      } catch (err) {
        console.warn("Firestore saveProject failed (saved locally):", err);
      }
    }
  },

  async deleteProject(id: string): Promise<void> {
    const normId = (id || '').trim();
    if (!normId) return;

    const deletedList = await readCache<string[]>(LOCAL_KEYS.deletedProjects, []);
    if (!deletedList.includes(normId)) {
      deletedList.push(normId);
    }

    const cached = await readCache<Project[]>(LOCAL_KEYS.projects, []);
    const target = cached.find(p => p.id === normId || p.slug === normId)
      || defaultProjects.find(p => p.id === normId || p.slug === normId);

    if (target) {
      if (target.id && !deletedList.includes(target.id)) deletedList.push(target.id);
      if (target.slug && !deletedList.includes(target.slug)) deletedList.push(target.slug);
    }
    await writeCache(LOCAL_KEYS.deletedProjects, deletedList);

    const filtered = cached.filter(
      p => p.id !== normId && p.slug !== normId && (target ? p.id !== target.id && p.slug !== target.slug : true)
    );
    await writeCache(LOCAL_KEYS.projects, filtered);
    emitDataSync('projects');

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'projects', normId));
        if (target?.slug && target.slug !== normId) {
          await deleteDoc(doc(firestoreInstance, 'projects', target.slug));
        }
        if (target?.id && target.id !== normId) {
          await deleteDoc(doc(firestoreInstance, 'projects', target.id));
        }
        await setDoc(doc(firestoreInstance, 'settings', 'deleted_records'), {
          deletedProjectIds: deletedList,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore deleteProject notice (deleted locally):", err);
      }
    }
  },

  // SERVICES
  async getServices(): Promise<Service[]> {
    const deletedSet = new Set<string>(await readCache<string[]>(LOCAL_KEYS.deletedServices, []));
    const localList = await readCache<Service[] | null>(LOCAL_KEYS.services, null);

    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'services');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const map = new Map<string, Service>();
          snap.docs.forEach(d => {
            const item = { ...d.data(), id: d.id } as Service;
            if (!deletedSet.has(item.id) && !deletedSet.has(item.slug)) {
              map.set(item.id, item);
            }
          });
          if (localList) {
            for (const ls of localList) {
              if (!deletedSet.has(ls.id) && !deletedSet.has(ls.slug)) {
                const remote = map.get(ls.id) as (Service & { updatedAt?: string }) | undefined;
                const localItem = ls as Service & { updatedAt?: string };
                if (!remote || isNewer(localItem.updatedAt, remote.updatedAt)) {
                  map.set(ls.id, ls);
                }
              }
            }
          }
          const list = Array.from(map.values()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          await writeCache(LOCAL_KEYS.services, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getServices fallback to local cache:", err);
      }
    }

    if (localList !== null) {
      return localList.filter(s => !deletedSet.has(s.id) && !deletedSet.has(s.slug));
    }
    return defaultServices.filter(s => !deletedSet.has(s.id) && !deletedSet.has(s.slug));
  },

  async saveService(service: Service): Promise<void> {
    const cleanId = (service.id || '').trim() || `serv-${Date.now()}`;
    const cleanSlug = sanitizeSlug(service.slug || service.title || cleanId) || cleanId;
    const savedService = {
      ...service,
      id: cleanId,
      slug: cleanSlug,
      updatedAt: new Date().toISOString()
    };

    const deleted = (await readCache<string[]>(LOCAL_KEYS.deletedServices, [])).filter(
      d => d !== savedService.id && d !== savedService.slug
    );
    await writeCache(LOCAL_KEYS.deletedServices, deleted);

    const services = await this.getServices();
    const index = services.findIndex(s => s.id === savedService.id || s.slug === savedService.slug);
    let updated: Service[];
    if (index >= 0) {
      updated = [...services];
      updated[index] = savedService;
    } else {
      updated = [...services, savedService];
    }
    updated.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    await writeCache(LOCAL_KEYS.services, updated);
    emitDataSync('services');

    if (firestoreInstance) {
      try {
        await setDoc(
          doc(firestoreInstance, 'services', savedService.id),
          sanitizeForFirestore(savedService),
          { merge: true }
        );
      } catch (err) {
        console.warn("Firestore saveService notice (saved locally):", err);
      }
    }
  },

  async deleteService(id: string): Promise<void> {
    const deleted = await readCache<string[]>(LOCAL_KEYS.deletedServices, []);
    if (!deleted.includes(id)) deleted.push(id);
    await writeCache(LOCAL_KEYS.deletedServices, deleted);

    const services = await this.getServices();
    const filtered = services.filter(s => s.id !== id && s.slug !== id);
    await writeCache(LOCAL_KEYS.services, filtered);
    emitDataSync('services');

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'services', id));
      } catch (err) {
        console.warn("Firestore deleteService notice (deleted locally):", err);
      }
    }
  },

  // SKILLS
  async getSkills(): Promise<Skill[]> {
    const deletedSet = new Set<string>(await readCache<string[]>(LOCAL_KEYS.deletedSkills, []));
    const localList = await readCache<Skill[] | null>(LOCAL_KEYS.skills, null);

    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'skills');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const map = new Map<string, Skill>();
          snap.docs.forEach(d => {
            const item = { ...d.data(), id: d.id } as Skill;
            if (!deletedSet.has(item.id)) map.set(item.id, item);
          });
          if (localList) {
            for (const ls of localList) {
              if (!deletedSet.has(ls.id)) {
                const remote = map.get(ls.id) as (Skill & { updatedAt?: string }) | undefined;
                const localItem = ls as Skill & { updatedAt?: string };
                if (!remote || isNewer(localItem.updatedAt, remote.updatedAt)) {
                  map.set(ls.id, ls);
                }
              }
            }
          }
          const list = Array.from(map.values()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          await writeCache(LOCAL_KEYS.skills, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getSkills fallback:", err);
      }
    }

    if (localList !== null) {
      return localList.filter(s => !deletedSet.has(s.id));
    }
    return defaultSkills.filter(s => !deletedSet.has(s.id));
  },

  async saveSkill(skill: Skill): Promise<void> {
    const savedSkill = {
      ...skill,
      id: (skill.id || '').trim() || `skill-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    const deleted = (await readCache<string[]>(LOCAL_KEYS.deletedSkills, [])).filter(d => d !== savedSkill.id);
    await writeCache(LOCAL_KEYS.deletedSkills, deleted);

    const skills = await this.getSkills();
    const idx = skills.findIndex(s => s.id === savedSkill.id);
    let updated: Skill[];
    if (idx >= 0) {
      updated = [...skills];
      updated[idx] = savedSkill;
    } else {
      updated = [...skills, savedSkill];
    }
    updated.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    await writeCache(LOCAL_KEYS.skills, updated);
    emitDataSync('skills');

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'skills', savedSkill.id), sanitizeForFirestore(savedSkill), { merge: true });
      } catch (err) {
        console.warn("Firestore saveSkill notice (saved locally):", err);
      }
    }
  },

  async deleteSkill(id: string): Promise<void> {
    const deleted = await readCache<string[]>(LOCAL_KEYS.deletedSkills, []);
    if (!deleted.includes(id)) deleted.push(id);
    await writeCache(LOCAL_KEYS.deletedSkills, deleted);

    const skills = await this.getSkills();
    const filtered = skills.filter(s => s.id !== id);
    await writeCache(LOCAL_KEYS.skills, filtered);
    emitDataSync('skills');

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'skills', id));
      } catch (err) {
        console.warn("Firestore deleteSkill notice (deleted locally):", err);
      }
    }
  },

  // EXPERIENCE
  async getExperience(): Promise<Experience[]> {
    const deletedSet = new Set<string>(await readCache<string[]>(LOCAL_KEYS.deletedExperience, []));
    const localList = await readCache<Experience[] | null>(LOCAL_KEYS.experience, null);

    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'experience');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const map = new Map<string, Experience>();
          snap.docs.forEach(d => {
            const item = { ...d.data(), id: d.id } as Experience;
            if (!deletedSet.has(item.id)) map.set(item.id, item);
          });
          if (localList) {
            for (const le of localList) {
              if (!deletedSet.has(le.id)) {
                const remote = map.get(le.id) as (Experience & { updatedAt?: string }) | undefined;
                const localItem = le as Experience & { updatedAt?: string };
                if (!remote || isNewer(localItem.updatedAt, remote.updatedAt)) {
                  map.set(le.id, le);
                }
              }
            }
          }
          const list = Array.from(map.values()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          await writeCache(LOCAL_KEYS.experience, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getExperience fallback:", err);
      }
    }

    if (localList !== null) {
      return localList.filter(e => !deletedSet.has(e.id));
    }
    return defaultExperiences.filter(e => !deletedSet.has(e.id));
  },

  async saveExperience(exp: Experience): Promise<void> {
    const savedExp = {
      ...exp,
      id: (exp.id || '').trim() || `exp-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    const deleted = (await readCache<string[]>(LOCAL_KEYS.deletedExperience, [])).filter(d => d !== savedExp.id);
    await writeCache(LOCAL_KEYS.deletedExperience, deleted);

    const list = await this.getExperience();
    const idx = list.findIndex(e => e.id === savedExp.id);
    let updated: Experience[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = savedExp;
    } else {
      updated = [...list, savedExp];
    }
    updated.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    await writeCache(LOCAL_KEYS.experience, updated);
    emitDataSync('experience');

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'experience', savedExp.id), sanitizeForFirestore(savedExp), { merge: true });
      } catch (err) {
        console.warn("Firestore saveExperience notice (saved locally):", err);
      }
    }
  },

  async deleteExperience(id: string): Promise<void> {
    const deleted = await readCache<string[]>(LOCAL_KEYS.deletedExperience, []);
    if (!deleted.includes(id)) deleted.push(id);
    await writeCache(LOCAL_KEYS.deletedExperience, deleted);

    const list = await this.getExperience();
    const filtered = list.filter(e => e.id !== id);
    await writeCache(LOCAL_KEYS.experience, filtered);
    emitDataSync('experience');

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'experience', id));
      } catch (err) {
        console.warn("Firestore deleteExperience notice (deleted locally):", err);
      }
    }
  },

  // TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    const deletedSet = new Set<string>(await readCache<string[]>(LOCAL_KEYS.deletedTestimonials, []));
    const localList = await readCache<Testimonial[] | null>(LOCAL_KEYS.testimonials, null);

    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'testimonials');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const map = new Map<string, Testimonial>();
          snap.docs.forEach(d => {
            const item = { ...d.data(), id: d.id } as Testimonial;
            if (!deletedSet.has(item.id)) map.set(item.id, item);
          });
          if (localList) {
            for (const lt of localList) {
              if (!deletedSet.has(lt.id)) {
                const remote = map.get(lt.id) as (Testimonial & { updatedAt?: string }) | undefined;
                const localItem = lt as Testimonial & { updatedAt?: string };
                if (!remote || isNewer(localItem.updatedAt, remote.updatedAt)) {
                  map.set(lt.id, lt);
                }
              }
            }
          }
          const list = Array.from(map.values());
          await writeCache(LOCAL_KEYS.testimonials, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getTestimonials fallback:", err);
      }
    }

    if (localList !== null) {
      return localList.filter(t => !deletedSet.has(t.id));
    }
    return defaultTestimonials.filter(t => !deletedSet.has(t.id));
  },

  async saveTestimonial(test: Testimonial): Promise<void> {
    const savedTest = {
      ...test,
      id: (test.id || '').trim() || `test-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    const deleted = (await readCache<string[]>(LOCAL_KEYS.deletedTestimonials, [])).filter(d => d !== savedTest.id);
    await writeCache(LOCAL_KEYS.deletedTestimonials, deleted);

    const list = await this.getTestimonials();
    const idx = list.findIndex(t => t.id === savedTest.id);
    let updated: Testimonial[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = savedTest;
    } else {
      updated = [savedTest, ...list];
    }
    await writeCache(LOCAL_KEYS.testimonials, updated);
    emitDataSync('testimonials');

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'testimonials', savedTest.id), sanitizeForFirestore(savedTest), { merge: true });
      } catch (err) {
        console.warn("Firestore saveTestimonial notice (saved locally):", err);
      }
    }
  },

  async deleteTestimonial(id: string): Promise<void> {
    const deleted = await readCache<string[]>(LOCAL_KEYS.deletedTestimonials, []);
    if (!deleted.includes(id)) deleted.push(id);
    await writeCache(LOCAL_KEYS.deletedTestimonials, deleted);

    const list = await this.getTestimonials();
    const filtered = list.filter(t => t.id !== id);
    await writeCache(LOCAL_KEYS.testimonials, filtered);
    emitDataSync('testimonials');

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'testimonials', id));
      } catch (err) {
        console.warn("Firestore deleteTestimonial notice (deleted locally):", err);
      }
    }
  },

  // ENQUIRIES / CONTACT
  async getEnquiries(): Promise<Enquiry[]> {
    const deletedSet = new Set<string>(await readCache<string[]>(LOCAL_KEYS.deletedEnquiries, []));
    const localList = await readCache<Enquiry[] | null>(LOCAL_KEYS.enquiries, null);

    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'enquiries');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const map = new Map<string, Enquiry>();
          snap.docs.forEach(d => {
            const item = { ...d.data(), id: d.id } as Enquiry;
            if (!deletedSet.has(item.id)) map.set(item.id, item);
          });
          if (localList) {
            for (const le of localList) {
              if (!deletedSet.has(le.id) && !map.has(le.id)) {
                map.set(le.id, le);
              }
            }
          }
          const list = Array.from(map.values());
          list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          await writeCache(LOCAL_KEYS.enquiries, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getEnquiries fallback:", err);
      }
    }

    if (localList !== null) {
      return localList.filter(e => !deletedSet.has(e.id));
    }

    const defaultSample: Enquiry[] = [
      {
        id: "enq-sample-1",
        name: "Aman Gupta",
        email: "aman@fashionretail.in",
        phone: "+91 9876543210",
        businessName: "Aman Apparels",
        serviceRequired: "E-Commerce Development",
        budgetRange: "₹50,000 - ₹1,00,000",
        message: "We need a modern fashion store similar to TopFashion with Razorpay checkout and WhatsApp notifications.",
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "New",
        read: false
      }
    ];
    return defaultSample.filter(e => !deletedSet.has(e.id));
  },

  async submitEnquiry(data: Omit<Enquiry, 'id' | 'date' | 'status' | 'read'>): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      ...data,
      id: "enq-" + Date.now(),
      date: new Date().toISOString(),
      status: 'New',
      read: false
    };

    const current = await this.getEnquiries();
    await writeCache(LOCAL_KEYS.enquiries, [newEnquiry, ...current]);
    emitDataSync('enquiries');

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'enquiries', newEnquiry.id), sanitizeForFirestore(newEnquiry));
      } catch (err) {
        console.warn("Firestore submitEnquiry notice (saved locally):", err);
      }
    }
    return newEnquiry;
  },

  async updateEnquiryStatus(id: string, status: Enquiry['status'], read = true): Promise<void> {
    const list = await this.getEnquiries();
    const updated = list.map(item => item.id === id ? { ...item, status, read } : item);
    await writeCache(LOCAL_KEYS.enquiries, updated);
    emitDataSync('enquiries');

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'enquiries', id), { status, read }, { merge: true });
      } catch (err) {
        console.warn("Firestore updateEnquiryStatus notice:", err);
      }
    }
  },

  async deleteEnquiry(id: string): Promise<void> {
    const deleted = await readCache<string[]>(LOCAL_KEYS.deletedEnquiries, []);
    if (!deleted.includes(id)) deleted.push(id);
    await writeCache(LOCAL_KEYS.deletedEnquiries, deleted);

    const list = await this.getEnquiries();
    const filtered = list.filter(e => e.id !== id);
    await writeCache(LOCAL_KEYS.enquiries, filtered);
    emitDataSync('enquiries');

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'enquiries', id));
      } catch (err) {
        console.warn("Firestore deleteEnquiry notice (deleted locally):", err);
      }
    }
  },

  // SEED TO FIRESTORE UTILITY
  async seedAllToFirestore(): Promise<{ success: boolean; message: string }> {
    if (!firestoreInstance) {
      return { success: false, message: "Firebase is not configured yet. Please configure Firebase keys first." };
    }
    try {
      const currentSettings = await this.getSettings();
      await setDoc(doc(firestoreInstance, 'settings', 'general'), sanitizeForFirestore(currentSettings), { merge: true });

      const currentServices = await this.getServices();
      for (const service of currentServices) {
        await setDoc(doc(firestoreInstance, 'services', service.id), sanitizeForFirestore(service), { merge: true });
      }

      const currentProjects = await this.getProjects();
      for (const project of currentProjects) {
        await setDoc(doc(firestoreInstance, 'projects', project.id), sanitizeForFirestore(project), { merge: true });
      }

      const currentSkills = await this.getSkills();
      for (const skill of currentSkills) {
        await setDoc(doc(firestoreInstance, 'skills', skill.id), sanitizeForFirestore(skill), { merge: true });
      }

      const currentExp = await this.getExperience();
      for (const exp of currentExp) {
        await setDoc(doc(firestoreInstance, 'experience', exp.id), sanitizeForFirestore(exp), { merge: true });
      }

      const currentTests = await this.getTestimonials();
      for (const test of currentTests) {
        await setDoc(doc(firestoreInstance, 'testimonials', test.id), sanitizeForFirestore(test), { merge: true });
      }

      return { success: true, message: "Successfully synced all portfolio data to Firebase Firestore!" };
    } catch (e: any) {
      console.error("Seed error:", e);
      return { success: false, message: e.message || "Failed to seed data into Firestore." };
    }
  },

  // IMAGE UPLOADER: Handles Firebase Storage or compressed base64 data URL
  async uploadImage(file: File, folder = 'projects'): Promise<string> {
    if (storageInstance) {
      try {
        const fileRef = ref(storageInstance, `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      } catch (err) {
        console.warn("Storage upload failed, falling back to compressed image data URL:", err);
      }
    }

    return compressImageFileToDataUrl(file);
  }
};

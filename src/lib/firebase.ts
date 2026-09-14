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
  addDoc,
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
  skills: 'vp_portfolio_skills',
  experience: 'vp_portfolio_experience',
  testimonials: 'vp_portfolio_testimonials',
  enquiries: 'vp_portfolio_enquiries',
  settings: 'vp_portfolio_settings',
  adminAuth: 'vp_admin_authenticated'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }
}

// --- Dynamic CRUD API (Syncs with Firestore when available, otherwise uses resilient local persistence) ---

export const DataService = {
  // SETTINGS
  async getSettings(): Promise<WebsiteSettings> {
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'settings');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const data = snap.docs[0].data() as WebsiteSettings;
          setLocal(LOCAL_KEYS.settings, data);
          return data;
        }
      } catch (err) {
        console.warn("Firestore getSettings fallback to local cache:", err);
      }
    }
    return getLocal<WebsiteSettings>(LOCAL_KEYS.settings, defaultSettings);
  },

  async saveSettings(settings: WebsiteSettings): Promise<void> {
    setLocal(LOCAL_KEYS.settings, settings);
    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'settings', 'general'), settings, { merge: true });
      } catch (err) {
        console.error("Failed to save settings to Firestore:", err);
      }
    }
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    // 1. Load set of deleted project IDs/slugs so deleted items never resurrect
    const deletedList = getLocal<string[]>(LOCAL_KEYS.deletedProjects, []);
    const deletedSet = new Set<string>(deletedList);

    if (firestoreInstance) {
      try {
        const delSnap = await getDoc(doc(firestoreInstance, 'settings', 'deleted_records'));
        if (delSnap.exists()) {
          const data = delSnap.data();
          if (Array.isArray(data.deletedProjectIds)) {
            data.deletedProjectIds.forEach((dId: string) => deletedSet.add(dId));
            setLocal(LOCAL_KEYS.deletedProjects, Array.from(deletedSet));
          }
        }
      } catch {
        // silent fallback
      }
    }

    // 2. Authoritative base: default projects (excluding deleted and legacy mock items)
    const projectMap = new Map<string, Project>();
    for (const dp of defaultProjects) {
      const dpKey = dp.id || dp.slug;
      if (
        dpKey === 'dressup-closets' || 
        dpKey === 'n8n-business-pipeline' || 
        dpKey === 'tiaara-clothing' ||
        deletedSet.has(dp.id) ||
        deletedSet.has(dp.slug) ||
        deletedSet.has(dpKey)
      ) {
        continue;
      }
      projectMap.set(dpKey, { ...dp });
    }

    // 3. Fetch from Firestore if available
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'projects');
        const snap = await getDocs(col);
        
        snap.docs.forEach(d => {
          const docData = { ...d.data(), id: d.id } as Project;
          const key = docData.id || docData.slug;
          
          // Skip legacy obsolete mock IDs or user-deleted IDs
          if (
            key === 'dressup-closets' || 
            key === 'n8n-business-pipeline' || 
            key === 'tiaara-clothing' ||
            deletedSet.has(docData.id) ||
            deletedSet.has(docData.slug) ||
            deletedSet.has(key)
          ) {
            return;
          }

          if (projectMap.has(key)) {
            const base = projectMap.get(key)!;
            const liveUrl = (docData.liveUrl && !docData.liveUrl.includes('example.com')) 
              ? docData.liveUrl 
              : base.liveUrl;

            projectMap.set(key, {
              ...base,
              ...docData,
              liveUrl,
              image: docData.image || base.image,
              title: base.title,
              category: base.category,
              subtitle: base.subtitle,
              description: base.description,
              shortDescription: base.shortDescription,
              order: base.order ?? docData.order
            });
          } else {
            // User-added custom project from Admin
            projectMap.set(key, docData);
          }
        });

        // If authenticated admin is browsing, only seed projects that have never been deleted
        if (authInstance?.currentUser && snap.empty) {
          for (const dp of defaultProjects) {
            const dpKey = dp.id || dp.slug;
            if (!deletedSet.has(dp.id) && !deletedSet.has(dp.slug) && !deletedSet.has(dpKey)) {
              try {
                await setDoc(doc(firestoreInstance, 'projects', dpKey), dp, { merge: true });
              } catch (syncErr) {
                // ignore permission error
              }
            }
          }
        }
      } catch (err) {
        console.warn("Firestore getProjects notice (using resilient data source):", err);
      }
    }

    // 4. Check local cache for custom edits made in admin
    const cached = getLocal<Project[]>(LOCAL_KEYS.projects, []);
    if (Array.isArray(cached) && cached.length > 0) {
      for (const cp of cached) {
        const key = cp.id || cp.slug;
        if (
          key === 'dressup-closets' || 
          key === 'n8n-business-pipeline' || 
          key === 'tiaara-clothing' ||
          deletedSet.has(cp.id) ||
          deletedSet.has(cp.slug) ||
          deletedSet.has(key)
        ) {
          continue;
        }
        if (!projectMap.has(key)) {
          projectMap.set(key, cp);
        }
      }
    }

    const allProjects = Array.from(projectMap.values());
    allProjects.sort((a, b) => (a.order || 99) - (b.order || 99));

    // Cache updated list in localStorage
    setLocal(LOCAL_KEYS.projects, allProjects);
    return allProjects;
  },

  async saveProject(project: Project): Promise<void> {
    // If saving/re-adding, remove from deleted tracking
    const deletedList = getLocal<string[]>(LOCAL_KEYS.deletedProjects, []);
    const updatedDeleted = deletedList.filter(d => d !== project.id && d !== project.slug);
    setLocal(LOCAL_KEYS.deletedProjects, updatedDeleted);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'settings', 'deleted_records'), {
          deletedProjectIds: updatedDeleted,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch {
        // ignore
      }
    }

    const projects = await this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id || p.slug === project.slug);
    let updated: Project[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...project, createdAt: new Date().toISOString() }, ...projects];
    }
    setLocal(LOCAL_KEYS.projects, updated);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'projects', project.id || project.slug), project, { merge: true });
      } catch (err) {
        console.error("Firestore saveProject error:", err);
      }
    }
  },

  async deleteProject(id: string): Promise<void> {
    const normId = (id || '').trim();
    if (!normId) return;

    // 1. Mark as permanently deleted in deleted tracking
    const deletedList = getLocal<string[]>(LOCAL_KEYS.deletedProjects, []);
    if (!deletedList.includes(normId)) {
      deletedList.push(normId);
    }

    // Also look up in cached projects to find associated slug or id
    const cached = getLocal<Project[]>(LOCAL_KEYS.projects, []);
    const target = cached.find(p => p.id === normId || p.slug === normId) 
      || defaultProjects.find(p => p.id === normId || p.slug === normId);

    if (target) {
      if (target.id && !deletedList.includes(target.id)) deletedList.push(target.id);
      if (target.slug && !deletedList.includes(target.slug)) deletedList.push(target.slug);
    }
    setLocal(LOCAL_KEYS.deletedProjects, deletedList);

    // 2. Remove immediately from local cached projects
    const filtered = cached.filter(p => p.id !== normId && p.slug !== normId && (target ? p.id !== target.id && p.slug !== target.slug : true));
    setLocal(LOCAL_KEYS.projects, filtered);

    // 3. Remove document from Firestore
    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'projects', normId));
        if (target && target.slug && target.slug !== normId) {
          await deleteDoc(doc(firestoreInstance, 'projects', target.slug));
        }
        if (target && target.id && target.id !== normId) {
          await deleteDoc(doc(firestoreInstance, 'projects', target.id));
        }
        // Save deleted tracking in Firestore
        await setDoc(doc(firestoreInstance, 'settings', 'deleted_records'), {
          deletedProjectIds: deletedList,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Firestore deleteProject error:", err);
      }
    }
  },

  // SERVICES
  async getServices(): Promise<Service[]> {
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'services');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Service));
          list.sort((a, b) => (a.order || 99) - (b.order || 99));
          setLocal(LOCAL_KEYS.services, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getServices fallback to local cache:", err);
      }
    }
    return getLocal<Service[]>(LOCAL_KEYS.services, defaultServices);
  },

  async saveService(service: Service): Promise<void> {
    const services = await this.getServices();
    const index = services.findIndex(s => s.id === service.id || s.slug === service.slug);
    let updated: Service[];
    if (index >= 0) {
      updated = [...services];
      updated[index] = service;
    } else {
      updated = [...services, service];
    }
    setLocal(LOCAL_KEYS.services, updated);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'services', service.id || service.slug), service, { merge: true });
      } catch (err) {
        console.error("Firestore saveService error:", err);
      }
    }
  },

  async deleteService(id: string): Promise<void> {
    const services = await this.getServices();
    const filtered = services.filter(s => s.id !== id);
    setLocal(LOCAL_KEYS.services, filtered);

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'services', id));
      } catch (err) {
        console.error("Firestore deleteService error:", err);
      }
    }
  },

  // SKILLS
  async getSkills(): Promise<Skill[]> {
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'skills');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Skill));
          list.sort((a, b) => (a.order || 99) - (b.order || 99));
          setLocal(LOCAL_KEYS.skills, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getSkills fallback:", err);
      }
    }
    return getLocal<Skill[]>(LOCAL_KEYS.skills, defaultSkills);
  },

  async saveSkill(skill: Skill): Promise<void> {
    const skills = await this.getSkills();
    const idx = skills.findIndex(s => s.id === skill.id);
    let updated: Skill[];
    if (idx >= 0) {
      updated = [...skills];
      updated[idx] = skill;
    } else {
      updated = [...skills, skill];
    }
    setLocal(LOCAL_KEYS.skills, updated);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'skills', skill.id), skill, { merge: true });
      } catch (err) {
        console.error("Firestore saveSkill error:", err);
      }
    }
  },

  async deleteSkill(id: string): Promise<void> {
    const skills = await this.getSkills();
    const filtered = skills.filter(s => s.id !== id);
    setLocal(LOCAL_KEYS.skills, filtered);

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'skills', id));
      } catch (err) {
        console.error("Firestore deleteSkill error:", err);
      }
    }
  },

  // EXPERIENCE
  async getExperience(): Promise<Experience[]> {
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'experience');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Experience));
          list.sort((a, b) => (a.order || 99) - (b.order || 99));
          setLocal(LOCAL_KEYS.experience, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getExperience fallback:", err);
      }
    }
    return getLocal<Experience[]>(LOCAL_KEYS.experience, defaultExperiences);
  },

  async saveExperience(exp: Experience): Promise<void> {
    const list = await this.getExperience();
    const idx = list.findIndex(e => e.id === exp.id);
    let updated: Experience[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = exp;
    } else {
      updated = [...list, exp];
    }
    setLocal(LOCAL_KEYS.experience, updated);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'experience', exp.id), exp, { merge: true });
      } catch (err) {
        console.error("Firestore saveExperience error:", err);
      }
    }
  },

  async deleteExperience(id: string): Promise<void> {
    const list = await this.getExperience();
    const filtered = list.filter(e => e.id !== id);
    setLocal(LOCAL_KEYS.experience, filtered);

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'experience', id));
      } catch (err) {
        console.error("Firestore deleteExperience error:", err);
      }
    }
  },

  // TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'testimonials');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Testimonial));
          setLocal(LOCAL_KEYS.testimonials, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getTestimonials fallback:", err);
      }
    }
    return getLocal<Testimonial[]>(LOCAL_KEYS.testimonials, defaultTestimonials);
  },

  async saveTestimonial(test: Testimonial): Promise<void> {
    const list = await this.getTestimonials();
    const idx = list.findIndex(t => t.id === test.id);
    let updated: Testimonial[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = test;
    } else {
      updated = [test, ...list];
    }
    setLocal(LOCAL_KEYS.testimonials, updated);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'testimonials', test.id), test, { merge: true });
      } catch (err) {
        console.error("Firestore saveTestimonial error:", err);
      }
    }
  },

  async deleteTestimonial(id: string): Promise<void> {
    const list = await this.getTestimonials();
    const filtered = list.filter(t => t.id !== id);
    setLocal(LOCAL_KEYS.testimonials, filtered);

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'testimonials', id));
      } catch (err) {
        console.error("Firestore deleteTestimonial error:", err);
      }
    }
  },

  // ENQUIRIES / CONTACT
  async getEnquiries(): Promise<Enquiry[]> {
    if (firestoreInstance) {
      try {
        const col = collection(firestoreInstance, 'enquiries');
        const snap = await getDocs(col);
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Enquiry));
          list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setLocal(LOCAL_KEYS.enquiries, list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getEnquiries fallback:", err);
      }
    }
    return getLocal<Enquiry[]>(LOCAL_KEYS.enquiries, [
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
    ]);
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
    setLocal(LOCAL_KEYS.enquiries, [newEnquiry, ...current]);

    if (firestoreInstance) {
      try {
        await addDoc(collection(firestoreInstance, 'enquiries'), newEnquiry);
      } catch (err) {
        console.error("Firestore submitEnquiry error:", err);
      }
    }
    return newEnquiry;
  },

  async updateEnquiryStatus(id: string, status: Enquiry['status'], read = true): Promise<void> {
    const list = await this.getEnquiries();
    const updated = list.map(item => item.id === id ? { ...item, status, read } : item);
    setLocal(LOCAL_KEYS.enquiries, updated);

    if (firestoreInstance) {
      try {
        await setDoc(doc(firestoreInstance, 'enquiries', id), { status, read }, { merge: true });
      } catch (err) {
        console.error("Firestore updateEnquiryStatus error:", err);
      }
    }
  },

  async deleteEnquiry(id: string): Promise<void> {
    const list = await this.getEnquiries();
    const filtered = list.filter(e => e.id !== id);
    setLocal(LOCAL_KEYS.enquiries, filtered);

    if (firestoreInstance) {
      try {
        await deleteDoc(doc(firestoreInstance, 'enquiries', id));
      } catch (err) {
        console.error("Firestore deleteEnquiry error:", err);
      }
    }
  },

  // SEED TO FIRESTORE UTILITY
  async seedAllToFirestore(): Promise<{ success: boolean; message: string }> {
    if (!firestoreInstance) {
      return { success: false, message: "Firebase is not configured yet. Please configure Firebase keys first." };
    }
    try {
      // 1. Settings
      await setDoc(doc(firestoreInstance, 'settings', 'general'), defaultSettings, { merge: true });
      
      // 2. Services
      for (const service of defaultServices) {
        await setDoc(doc(firestoreInstance, 'services', service.id), service, { merge: true });
      }

      // 3. Projects
      for (const project of defaultProjects) {
        await setDoc(doc(firestoreInstance, 'projects', project.id), project, { merge: true });
      }

      // 4. Skills
      for (const skill of defaultSkills) {
        await setDoc(doc(firestoreInstance, 'skills', skill.id), skill, { merge: true });
      }

      // 5. Experience
      for (const exp of defaultExperiences) {
        await setDoc(doc(firestoreInstance, 'experience', exp.id), exp, { merge: true });
      }

      // 6. Testimonials
      for (const test of defaultTestimonials) {
        await setDoc(doc(firestoreInstance, 'testimonials', test.id), test, { merge: true });
      }

      return { success: true, message: "Successfully synced all portfolio data to Firebase Firestore!" };
    } catch (e: any) {
      console.error("Seed error:", e);
      return { success: false, message: e.message || "Failed to seed data into Firestore." };
    }
  },

  // IMAGE UPLOADER: Handles Firebase Storage or returns base64 data URL
  async uploadImage(file: File, folder = 'projects'): Promise<string> {
    if (storageInstance) {
      try {
        const fileRef = ref(storageInstance, `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      } catch (err) {
        console.warn("Storage upload failed, falling back to local object URL:", err);
      }
    }

    // Fallback: Read as base64 data URL for local persistence
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

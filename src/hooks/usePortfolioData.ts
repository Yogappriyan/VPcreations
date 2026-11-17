import { useState, useEffect, useCallback } from 'react';
import {
  Project,
  Service,
  Skill,
  Experience,
  Testimonial,
  Enquiry,
  WebsiteSettings
} from '../types';
import { DataService } from '../lib/firebase';
import { defaultSettings, defaultProjects } from '../data/defaultData';

function useSyncListener(syncKey: string, refetch: () => Promise<void>) {
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string }>;
      if (!customEvent.detail?.key || customEvent.detail.key === syncKey) {
        refetch();
      }
    };
    window.addEventListener('vp-storage-sync', handler);
    return () => window.removeEventListener('vp-storage-sync', handler);
  }, [syncKey, refetch]);
}

export function useSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const cached = localStorage.getItem('vp_portfolio_settings');
      if (cached) {
        return { ...defaultSettings, ...JSON.parse(cached) };
      }
    } catch {
      // fallback
    }
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await DataService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useSyncListener('settings', fetchSettings);

  const updateSettings = async (newSettings: WebsiteSettings) => {
    await DataService.saveSettings(newSettings);
    setSettings({ ...defaultSettings, ...newSettings });
  };

  return { settings, loading, refetch: fetchSettings, updateSettings };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem('vp_portfolio_projects');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return defaultProjects;
  });
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await DataService.getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useSyncListener('projects', fetchProjects);

  const saveProject = async (project: Project) => {
    await DataService.saveProject(project);
    await fetchProjects();
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id && p.slug !== id));
    await DataService.deleteProject(id);
    await fetchProjects();
  };

  return { projects, loading, refetch: fetchProjects, saveProject, deleteProject };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const data = await DataService.getServices();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useSyncListener('services', fetchServices);

  const saveService = async (service: Service) => {
    await DataService.saveService(service);
    await fetchServices();
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id && s.slug !== id));
    await DataService.deleteService(id);
    await fetchServices();
  };

  return { services, loading, refetch: fetchServices, saveService, deleteService };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      const data = await DataService.getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useSyncListener('skills', fetchSkills);

  const saveSkill = async (skill: Skill) => {
    await DataService.saveSkill(skill);
    await fetchSkills();
  };

  const deleteSkill = async (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    await DataService.deleteSkill(id);
    await fetchSkills();
  };

  return { skills, loading, refetch: fetchSkills, saveSkill, deleteSkill };
}

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExp = useCallback(async () => {
    try {
      const data = await DataService.getExperience();
      setExperience(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExp();
  }, [fetchExp]);

  useSyncListener('experience', fetchExp);

  const saveExperience = async (exp: Experience) => {
    await DataService.saveExperience(exp);
    await fetchExp();
  };

  const deleteExperience = async (id: string) => {
    setExperience(prev => prev.filter(e => e.id !== id));
    await DataService.deleteExperience(id);
    await fetchExp();
  };

  return { experience, loading, refetch: fetchExp, saveExperience, deleteExperience };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTest = useCallback(async () => {
    try {
      const data = await DataService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  useSyncListener('testimonials', fetchTest);

  const saveTestimonial = async (item: Testimonial) => {
    await DataService.saveTestimonial(item);
    await fetchTest();
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    await DataService.deleteTestimonial(id);
    await fetchTest();
  };

  return { testimonials, loading, refetch: fetchTest, saveTestimonial, deleteTestimonial };
}

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = useCallback(async () => {
    try {
      const data = await DataService.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  useSyncListener('enquiries', fetchEnquiries);

  const submitEnquiry = async (data: Omit<Enquiry, 'id' | 'date' | 'status' | 'read'>) => {
    const res = await DataService.submitEnquiry(data);
    await fetchEnquiries();
    return res;
  };

  const updateStatus = async (id: string, status: Enquiry['status'], read = true) => {
    await DataService.updateEnquiryStatus(id, status, read);
    await fetchEnquiries();
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    await DataService.deleteEnquiry(id);
    await fetchEnquiries();
  };

  return { enquiries, loading, refetch: fetchEnquiries, submitEnquiry, updateStatus, deleteEnquiry };
}

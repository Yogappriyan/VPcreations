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

export function useSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
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

  const updateSettings = async (newSettings: WebsiteSettings) => {
    await DataService.saveSettings(newSettings);
    setSettings(newSettings);
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

  const saveService = async (service: Service) => {
    await DataService.saveService(service);
    await fetchServices();
  };

  const deleteService = async (id: string) => {
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

  const saveSkill = async (skill: Skill) => {
    await DataService.saveSkill(skill);
    await fetchSkills();
  };

  const deleteSkill = async (id: string) => {
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

  const saveExperience = async (exp: Experience) => {
    await DataService.saveExperience(exp);
    await fetchExp();
  };

  const deleteExperience = async (id: string) => {
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

  const saveTestimonial = async (item: Testimonial) => {
    await DataService.saveTestimonial(item);
    await fetchTest();
  };

  const deleteTestimonial = async (id: string) => {
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
    await DataService.deleteEnquiry(id);
    await fetchEnquiries();
  };

  return { enquiries, loading, refetch: fetchEnquiries, submitEnquiry, updateStatus, deleteEnquiry };
}

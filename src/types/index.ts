export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  subtitle?: string;
  browserUrl?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
  shortDescription: string;
  description: string;
  problem?: string;
  solution?: string;
  challenges?: string;
  results?: string;
  clientType?: string;
  image: string;
  gallery?: string[];
  technologies: string[];
  keyBadges?: string[];
  features?: string[];
  developmentProcess?: string[];
  architecture?: {
    frontend?: string;
    backend?: string;
    database?: string;
    payments?: string;
    hosting?: string;
  };
  metrics?: { label: string; value: string; desc: string }[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  benefits: string[];
  technologies: string[];
  developmentProcess?: { step: string; title: string; desc: string }[];
  faq?: { question: string; answer: string }[];
  featured: boolean;
  order?: number;
  createdAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Payments' | 'Automation' | 'Deployment' | 'AI';
  level: number;
  icon?: string;
  order?: number;
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  role?: string;
  description: string;
  technologies: string[];
  order?: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  business: string;
  testimonial: string;
  rating: number;
  photo?: string;
  featured: boolean;
  createdAt?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  serviceRequired: string;
  budgetRange: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Closed';
  read: boolean;
}

export interface WebsiteSettings {
  name: string;
  tagline: string;
  personName: string;
  profession: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  instagramUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  resumePdfUrl: string;
  seoTitle: string;
  seoDescription: string;
  favicon: string;
  footerText: string;
}

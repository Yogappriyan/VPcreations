import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Service, Skill, Experience, Testimonial } from '../../types';
import { Modal } from '../common/Modal';
import { sanitizeSlug } from '../../lib/utils';

// --- SERVICE MODAL ---
interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: Service | null;
  onSave: (service: Service) => Promise<void>;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    slug: '',
    description: '',
    icon: 'Globe',
    features: [],
    benefits: [],
    technologies: [],
    featured: true,
    order: 1
  });
  const [featuresText, setFeaturesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [techText, setTechText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setSaving(false);
    if (serviceToEdit) {
      setFormData(serviceToEdit);
      setFeaturesText((serviceToEdit.features || []).join('\n'));
      setBenefitsText((serviceToEdit.benefits || []).join('\n'));
      setTechText((serviceToEdit.technologies || []).join(', '));
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        icon: 'Globe',
        features: [],
        benefits: [],
        technologies: [],
        featured: true,
        order: 1
      });
      setFeaturesText('');
      setBenefitsText('');
      setTechText('');
    }
  }, [serviceToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    const slug = sanitizeSlug(val);
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: serviceToEdit ? prev.slug : slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedTitle = (formData.title || '').trim();
    const finalSlug = sanitizeSlug(formData.slug || trimmedTitle);
    if (!trimmedTitle || !finalSlug) {
      setError('Service title and slug are required.');
      return;
    }

    const service: Service = {
      ...(serviceToEdit || {}),
      id: serviceToEdit?.id || 'serv-' + Date.now(),
      title: trimmedTitle,
      slug: finalSlug,
      description: (formData.description || '').trim(),
      icon: formData.icon || 'Globe',
      features: featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      benefits: benefitsText.split('\n').map(s => s.trim()).filter(Boolean),
      technologies: techText.split(',').map(s => s.trim()).filter(Boolean),
      featured: !!formData.featured,
      order: Number(formData.order) || 1,
      createdAt: serviceToEdit?.createdAt || new Date().toISOString()
    };

    setSaving(true);
    try {
      await onSave(service);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={serviceToEdit ? 'Edit Service' : 'Add Service'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Icon</label>
            <select
              value={formData.icon || 'Globe'}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="Globe">Globe (Websites)</option>
              <option value="Smartphone">Smartphone (Apps)</option>
              <option value="ShoppingBag">ShoppingBag (E-Commerce)</option>
              <option value="Bot">Bot (AI Integration)</option>
              <option value="Workflow">Workflow (Automation)</option>
              <option value="Cpu">Cpu (Software Solutions)</option>
              <option value="Palette">Palette (UI/UX)</option>
              <option value="TrendingUp">TrendingUp (Marketing Support)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Display Order</label>
            <input
              type="number"
              value={formData.order ?? 1}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Description</label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Features (One per line)</label>
            <textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Responsive layout&#10;SEO Optimization&#10;Speed tuning"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Key Benefits (One per line)</label>
            <textarea
              rows={3}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="Higher conversion rate&#10;24/7 automation"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            value={techText}
            onChange={(e) => setTechText(e.target.value)}
            placeholder="React, TypeScript, Tailwind CSS"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="featured_service"
            checked={!!formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded bg-slate-950 border-slate-800 text-cyan-400 focus:ring-cyan-400 w-4 h-4"
          />
          <label htmlFor="featured_service" className="text-sm text-slate-300 cursor-pointer">
            Featured Service
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- SKILL MODAL ---
interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillToEdit?: Skill | null;
  onSave: (skill: Skill) => Promise<void>;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  skillToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend',
    level: 90,
    order: 1
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setSaving(false);
    if (skillToEdit) {
      setFormData(skillToEdit);
    } else {
      setFormData({ name: '', category: 'Frontend', level: 90, order: 1 });
    }
  }, [skillToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = (formData.name || '').trim();
    if (!trimmedName) {
      setError('Skill name is required.');
      return;
    }

    const skill: Skill = {
      ...(skillToEdit || {}),
      id: skillToEdit?.id || 'skill-' + Date.now(),
      name: trimmedName,
      category: formData.category || 'Frontend',
      level: Number(formData.level) || 80,
      order: Number(formData.order) || 1
    };

    setSaving(true);
    try {
      await onSave(skill);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={skillToEdit ? 'Edit Skill' : 'Add Skill'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Skill Name *</label>
          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. React.js, TypeScript"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Category</label>
          <select
            value={formData.category || 'Frontend'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill['category'] })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Payments">Payments</option>
            <option value="Automation">Automation</option>
            <option value="Deployment">Deployment</option>
            <option value="AI">AI</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-mono text-slate-300 uppercase">Proficiency Level (%)</label>
            <span className="text-xs font-mono text-cyan-400 font-bold">{formData.level}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            value={formData.level ?? 90}
            onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
            className="w-full accent-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Order</label>
          <input
            type="number"
            value={formData.order ?? 1}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Skill'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- EXPERIENCE MODAL ---
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  expToEdit?: Experience | null;
  onSave: (exp: Experience) => Promise<void>;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  expToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Experience>>({
    year: '2026',
    title: '',
    role: 'Full Stack Developer',
    description: '',
    technologies: [],
    order: 1
  });
  const [techText, setTechText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setSaving(false);
    if (expToEdit) {
      setFormData(expToEdit);
      setTechText((expToEdit.technologies || []).join(', '));
    } else {
      setFormData({ year: '2026', title: '', role: 'Full Stack Developer', description: '', technologies: [], order: 1 });
      setTechText('');
    }
  }, [expToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedTitle = (formData.title || '').trim();
    const trimmedYear = (formData.year || '').trim();
    if (!trimmedTitle || !trimmedYear) {
      setError('Year and milestone title are required.');
      return;
    }

    const exp: Experience = {
      ...(expToEdit || {}),
      id: expToEdit?.id || 'exp-' + Date.now(),
      year: trimmedYear,
      title: trimmedTitle,
      role: (formData.role || '').trim(),
      description: (formData.description || '').trim(),
      technologies: techText.split(',').map(s => s.trim()).filter(Boolean),
      order: Number(formData.order) || 1
    };

    setSaving(true);
    try {
      await onSave(exp);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save milestone.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expToEdit ? 'Edit Experience' : 'Add Experience'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Year *</label>
            <input
              type="text"
              required
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="e.g. 2026"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Order</label>
            <input
              type="number"
              value={formData.order ?? 1}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Title / Milestone *</label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. AI Integrations & Automation Specialist"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Role / Designation</label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Lead Developer"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Description</label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            value={techText}
            onChange={(e) => setTechText(e.target.value)}
            placeholder="React, n8n, AI APIs, Firebase"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Milestone'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- TESTIMONIAL MODAL ---
interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testToEdit?: Testimonial | null;
  onSave: (test: Testimonial) => Promise<void>;
}

export const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  testToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    clientName: '',
    business: '',
    testimonial: '',
    rating: 5,
    featured: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setSaving(false);
    if (testToEdit) {
      setFormData(testToEdit);
    } else {
      setFormData({ clientName: '', business: '', testimonial: '', rating: 5, featured: true });
    }
  }, [testToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = (formData.clientName || '').trim();
    const trimmedContent = (formData.testimonial || '').trim();
    if (!trimmedName || !trimmedContent) {
      setError('Client name and testimonial content are required.');
      return;
    }

    const item: Testimonial = {
      ...(testToEdit || {}),
      id: testToEdit?.id || 'test-' + Date.now(),
      clientName: trimmedName,
      business: (formData.business || '').trim(),
      testimonial: trimmedContent,
      rating: Number(formData.rating) || 5,
      featured: !!formData.featured,
      createdAt: testToEdit?.createdAt || new Date().toISOString()
    };

    setSaving(true);
    try {
      await onSave(item);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={testToEdit ? 'Edit Testimonial' : 'Add Testimonial'} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Client Name *</label>
          <input
            type="text"
            required
            value={formData.clientName || ''}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Business / Designation</label>
          <input
            type="text"
            value={formData.business || ''}
            onChange={(e) => setFormData({ ...formData, business: e.target.value })}
            placeholder="e.g. Founder at TopFashion"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Testimonial Content *</label>
          <textarea
            required
            rows={3}
            value={formData.testimonial || ''}
            onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
            placeholder="Describe the collaboration, speed, results, and satisfaction..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Rating (Stars: 1 - 5)</label>
          <select
            value={formData.rating ?? 5}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
            <option value={3}>⭐⭐⭐ (3 Stars)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="featured_test"
            checked={!!formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded bg-slate-950 border-slate-800 text-cyan-400 focus:ring-cyan-400 w-4 h-4"
          />
          <label htmlFor="featured_test" className="text-sm text-slate-300 cursor-pointer">
            Feature on Homepage
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg cursor-pointer disabled:opacity-50 inline-flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Story'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

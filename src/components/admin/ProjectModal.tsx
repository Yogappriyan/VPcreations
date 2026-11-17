import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Project } from '../../types';
import { Modal } from '../common/Modal';
import { DataService } from '../../lib/firebase';
import { normalizeUrl, extractDomain, sanitizeSlug } from '../../lib/utils';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
  existingProjects?: Project[];
  onSave: (project: Project) => Promise<void>;
}

const CATEGORY_PRESETS = [
  'E-Commerce',
  'Fashion E-Commerce',
  'Fancy store E-Commerce',
  'Fashion / E-Commerce',
  'Women accesories',
  'Car rental Website',
  'Websites',
  'Web Applications',
  'Business Software',
  'AI',
  'Automation'
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  existingProjects = [],
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    subtitle: '',
    browserUrl: '',
    bannerHeadline: '',
    bannerSubheadline: '',
    category: 'E-Commerce',
    shortDescription: '',
    description: '',
    problem: '',
    solution: '',
    challenges: '',
    results: '',
    clientType: '',
    image: '/images/topfashion.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    features: [],
    liveUrl: '',
    githubUrl: '',
    featured: true,
    order: 1
  });

  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [browserUrlTouched, setBrowserUrlTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [error]);

  useEffect(() => {
    setError(null);
    setSaving(false);
    setBrowserUrlTouched(false);

    if (projectToEdit) {
      setFormData({
        ...projectToEdit,
        category: projectToEdit.category || 'E-Commerce',
        image: projectToEdit.image || '/images/topfashion.jpg'
      });
      setTechInput((projectToEdit.technologies || []).join(', '));
      setFeaturesInput((projectToEdit.features || []).join('\n'));
    } else {
      setFormData({
        title: '',
        slug: '',
        subtitle: '',
        browserUrl: '',
        bannerHeadline: '',
        bannerSubheadline: '',
        category: 'E-Commerce',
        shortDescription: '',
        description: '',
        problem: '',
        solution: '',
        challenges: '',
        results: '',
        clientType: '',
        image: '/images/topfashion.jpg',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        features: [],
        liveUrl: '',
        githubUrl: '',
        featured: true,
        order: 1
      });
      setTechInput('React, TypeScript, Tailwind CSS');
      setFeaturesInput('');
    }
  }, [projectToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    const generatedSlug = sanitizeSlug(val);
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: projectToEdit ? prev.slug : generatedSlug
    }));
  };

  const handleLiveUrlChange = (val: string) => {
    const newDomain = extractDomain(val);
    setFormData(prev => {
      const oldDomain = extractDomain(prev.liveUrl);
      const shouldSyncBrowserUrl =
        !browserUrlTouched && (!prev.browserUrl || prev.browserUrl === oldDomain);
      return {
        ...prev,
        liveUrl: val,
        browserUrl: shouldSyncBrowserUrl ? newDomain : prev.browserUrl
      };
    });
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, SVG).');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await DataService.uploadImage(file, 'projects');
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Image upload failed. Try pasting an image URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const ensureUniqueSlug = (rawSlug: string, currentId?: string): string => {
    let baseSlug = sanitizeSlug(rawSlug) || `project-${Date.now()}`;
    const taken = new Set(
      existingProjects
        .filter(p => p.id !== currentId)
        .map(p => p.slug)
    );
    if (!taken.has(baseSlug)) return baseSlug;
    let counter = 2;
    while (taken.has(`${baseSlug}-${counter}`)) {
      counter++;
    }
    return `${baseSlug}-${counter}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = (formData.title || '').trim();
    if (!trimmedTitle) {
      setError('Project Title is required.');
      return;
    }

    const rawSlug = (formData.slug || '').trim() || trimmedTitle;
    const finalSlug = ensureUniqueSlug(rawSlug, projectToEdit?.id);

    const techs = techInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const featuresList = featuresInput
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const normalizedLiveUrl = normalizeUrl(formData.liveUrl);
    const normalizedGithubUrl = normalizeUrl(formData.githubUrl);

    const derivedBrowserUrl =
      (formData.browserUrl || '').trim() ||
      (normalizedLiveUrl ? extractDomain(normalizedLiveUrl) : '');

    const finalImage = (formData.image || '').trim() || '/images/topfashion.jpg';
    let updatedGallery = projectToEdit?.gallery ? [...projectToEdit.gallery] : undefined;
    if (updatedGallery && projectToEdit?.image !== finalImage) {
      updatedGallery = updatedGallery.length <= 1
        ? [finalImage]
        : [finalImage, ...updatedGallery.slice(1).filter(img => img !== projectToEdit?.image)];
    }

    // Preserve all existing fields (architecture, metrics, keyBadges, etc.) when editing
    const project: Project = {
      ...(projectToEdit || {}),
      id: projectToEdit?.id || `proj-${Date.now()}`,
      title: trimmedTitle,
      slug: finalSlug,
      subtitle: (formData.subtitle || '').trim() || undefined,
      browserUrl: derivedBrowserUrl || undefined,
      bannerHeadline: (formData.bannerHeadline || '').trim() || undefined,
      bannerSubheadline: (formData.bannerSubheadline || '').trim() || undefined,
      category: (formData.category || '').trim() || 'E-Commerce',
      shortDescription: (formData.shortDescription || '').trim(),
      description: (formData.description || '').trim() || (formData.shortDescription || '').trim(),
      problem: (formData.problem || '').trim(),
      solution: (formData.solution || '').trim(),
      challenges: (formData.challenges || '').trim(),
      results: (formData.results || '').trim(),
      clientType: (formData.clientType || '').trim(),
      image: finalImage,
      gallery: updatedGallery,
      technologies: techs.length > 0 ? techs : ['React', 'TypeScript'],
      features: featuresList.length > 0 ? featuresList : projectToEdit?.features,
      liveUrl: normalizedLiveUrl,
      githubUrl: normalizedGithubUrl,
      featured: !!formData.featured,
      order: formData.order === undefined || Number.isNaN(Number(formData.order)) ? 1 : Number(formData.order),
      createdAt: projectToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSaving(true);
    try {
      await onSave(project);
      onClose();
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setError(err?.message || 'Failed to save project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Add New Project'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && (
          <div
            ref={errorRef}
            className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Project Name / Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. SUREKA TRENDZ"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Slug (URL identifier) *</label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. sureka-trendz"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Category</label>
            <input
              type="text"
              list="project-category-presets"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="E-Commerce, Websites, AI..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
            <datalist id="project-category-presets">
              {CATEGORY_PRESETS.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Subtitle / Type</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Fashion E-Commerce"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Display Order</label>
            <input
              type="number"
              value={formData.order ?? ''}
              onChange={(e) => setFormData({ ...formData, order: e.target.value === '' ? undefined : Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Live Website URL</label>
            <input
              type="text"
              value={formData.liveUrl || ''}
              onChange={(e) => handleLiveUrlChange(e.target.value)}
              placeholder="https://example.vercel.app"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">GitHub URL</label>
            <input
              type="text"
              value={formData.githubUrl || ''}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Browser Bar Address</label>
            <input
              type="text"
              value={formData.browserUrl || ''}
              onChange={(e) => {
                setBrowserUrlTouched(true);
                setFormData({ ...formData, browserUrl: e.target.value });
              }}
              placeholder="example.vercel.app"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Client / Business Type</label>
            <input
              type="text"
              value={formData.clientType || ''}
              onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
              placeholder="e.g. Retail Apparel Brand"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Image upload / URL */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-300 uppercase">Project Image</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Image URL (or upload below)"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono inline-flex items-center gap-1.5 border border-slate-700">
                  <Upload className="w-3 h-3" />
                  {uploading ? 'Processing...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                </label>
                <span className="text-[11px] text-slate-500">Preset: /images/topfashion.jpg, /images/tiara.jpg, /images/dressup.jpg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Banner Headline (Optional)</label>
            <input
              type="text"
              value={formData.bannerHeadline || ''}
              onChange={(e) => setFormData({ ...formData, bannerHeadline: e.target.value })}
              placeholder="e.g. Style For Every Man"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Banner Subheadline (Optional)</label>
            <input
              type="text"
              value={formData.bannerSubheadline || ''}
              onChange={(e) => setFormData({ ...formData, bannerSubheadline: e.target.value })}
              placeholder="e.g. Trendy Looks. Timeless Style."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Short Description</label>
          <input
            type="text"
            value={formData.shortDescription || ''}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Brief 1-2 sentence overview for cards"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Full Description</label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Case study deep details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Problem</label>
            <textarea
              rows={2}
              value={formData.problem || ''}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Solution</label>
            <textarea
              rows={2}
              value={formData.solution || ''}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Challenges</label>
            <textarea
              rows={2}
              value={formData.challenges || ''}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Results & Impact</label>
            <textarea
              rows={2}
              value={formData.results || ''}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Key Features (One per line)</label>
          <textarea
            rows={2}
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="Responsive product catalog&#10;Interactive shopping cart&#10;Secure Razorpay checkout"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, TypeScript, Node.js, Razorpay, Tailwind CSS"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="featured_project"
            checked={!!formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded bg-slate-950 border-slate-800 text-cyan-400 focus:ring-cyan-400 w-4 h-4"
          />
          <label htmlFor="featured_project" className="text-sm text-slate-300 cursor-pointer">
            Feature this project on Homepage
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>

      </form>
    </Modal>
  );
};

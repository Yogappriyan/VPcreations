import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Project } from '../../types';
import { Modal } from '../common/Modal';
import { DataService } from '../../lib/firebase';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
  onSave: (project: Project) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
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
    liveUrl: '',
    githubUrl: '',
    featured: true,
    order: 1
  });

  const [techInput, setTechInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData(projectToEdit);
      setTechInput(projectToEdit.technologies ? projectToEdit.technologies.join(', ') : '');
    } else {
      setFormData({
        title: '',
        slug: '',
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
        liveUrl: '',
        githubUrl: '',
        featured: true,
        order: 1
      });
      setTechInput('React, TypeScript, Tailwind CSS');
    }
  }, [projectToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug && projectToEdit ? prev.slug : slug
    }));
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await DataService.uploadImage(file, 'projects');
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;

    const techs = techInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const project: Project = {
      id: projectToEdit?.id || 'proj-' + Date.now(),
      title: formData.title,
      slug: formData.slug,
      category: formData.category || 'E-Commerce',
      shortDescription: formData.shortDescription || '',
      description: formData.description || '',
      problem: formData.problem || '',
      solution: formData.solution || '',
      challenges: formData.challenges || '',
      results: formData.results || '',
      clientType: formData.clientType || '',
      image: formData.image || '/images/topfashion.jpg',
      technologies: techs.length > 0 ? techs : ['React', 'TypeScript'],
      liveUrl: formData.liveUrl || '',
      githubUrl: formData.githubUrl || '',
      featured: !!formData.featured,
      order: Number(formData.order) || 1,
      createdAt: projectToEdit?.createdAt || new Date().toISOString()
    };

    await onSave(project);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Add New Project'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
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
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Category</label>
            <select
              value={formData.category || 'E-Commerce'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="E-Commerce">E-Commerce</option>
              <option value="Websites">Websites</option>
              <option value="Web Applications">Web Applications</option>
              <option value="Business Software">Business Software</option>
              <option value="AI">AI</option>
              <option value="Automation">Automation</option>
            </select>
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
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono inline-flex items-center gap-1.5 border border-slate-700">
                  <Upload className="w-3 h-3" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                </label>
                <span className="text-[11px] text-slate-500">Preset: /images/topfashion.jpg, /images/tiara.jpg, /images/dressup.jpg</span>
              </div>
            </div>
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
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, TypeScript, Node.js, Razorpay, Tailwind CSS"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Live URL</label>
            <input
              type="url"
              value={formData.liveUrl || ''}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.githubUrl || ''}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            Save Project
          </button>
        </div>

      </form>
    </Modal>
  );
};

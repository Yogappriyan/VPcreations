import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Briefcase, 
  Code2, 
  Calendar, 
  MessageSquare, 
  Inbox, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Star, 
  Flame, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Mail,
  Send,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  useProjects, 
  useServices, 
  useSkills, 
  useExperience, 
  useTestimonials, 
  useEnquiries, 
  useSettings 
} from '../../hooks/usePortfolioData';
import { Project, Service, Skill, Experience, Testimonial, Enquiry } from '../../types';
import { ProjectModal } from '../../components/admin/ProjectModal';
import { 
  ServiceModal, 
  SkillModal, 
  ExperienceModal, 
  TestimonialModal 
} from '../../components/admin/AdminModals';
import { FirebaseConfigModal } from '../../components/admin/FirebaseConfigModal';
import { isFirebaseConfigured, DataService } from '../../lib/firebase';

type AdminTab = 'overview' | 'projects' | 'services' | 'skills' | 'experience' | 'testimonials' | 'enquiries' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Hooks
  const { projects, saveProject, deleteProject } = useProjects();
  const { services, saveService, deleteService } = useServices();
  const { skills, saveSkill, deleteSkill } = useSkills();
  const { experience, saveExperience, deleteExperience } = useExperience();
  const { testimonials, saveTestimonial, deleteTestimonial } = useTestimonials();
  const { enquiries, updateStatus, deleteEnquiry } = useEnquiries();
  const { settings, updateSettings } = useSettings();

  // Modal States
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Testimonial | null>(null);

  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Deletion Confirmation Modal State (replaces blocked window.confirm in iframes)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'project' | 'service' | 'skill' | 'experience' | 'testimonial' | 'enquiry';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === 'project') {
        await deleteProject(deleteConfirm.id);
        showToast(`Project "${deleteConfirm.title}" permanently deleted.`);
      } else if (deleteConfirm.type === 'service') {
        await deleteService(deleteConfirm.id);
        showToast(`Service "${deleteConfirm.title}" deleted.`);
      } else if (deleteConfirm.type === 'skill') {
        await deleteSkill(deleteConfirm.id);
        showToast(`Skill "${deleteConfirm.title}" deleted.`);
      } else if (deleteConfirm.type === 'experience') {
        await deleteExperience(deleteConfirm.id);
        showToast(`Experience milestone deleted.`);
      } else if (deleteConfirm.type === 'testimonial') {
        await deleteTestimonial(deleteConfirm.id);
        showToast(`Testimonial deleted.`);
      } else if (deleteConfirm.type === 'enquiry') {
        await deleteEnquiry(deleteConfirm.id);
        showToast(`Enquiry deleted.`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast('Error: Failed to delete item.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Settings local state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Sync settings when loaded
  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSyncStatus('Settings updated successfully!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const isConnectedToFirebase = isFirebaseConfigured();

  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#02040a]">
      {/* Top Admin Bar */}
      <div className="border-b border-slate-800 bg-[#040713]/90 backdrop-blur-xl sticky top-16 z-30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono">
              VP
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-['Outfit']">VP CREATIONS ADMIN</h2>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className={`w-2 h-2 rounded-full ${isConnectedToFirebase ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'}`}></span>
                <span className={isConnectedToFirebase ? 'text-emerald-400' : 'text-amber-400'}>
                  {isConnectedToFirebase ? 'Firebase Firestore Connected' : 'Local Persistence (Ready for Cloud)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFirebaseModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Firebase Config & Sync
            </button>

            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/40 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-800 scrollbar-none mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'projects', label: `Projects (${projects.length})`, icon: <FolderKanban className="w-4 h-4" /> },
            { id: 'services', label: `Services (${services.length})`, icon: <Briefcase className="w-4 h-4" /> },
            { id: 'skills', label: `Skills (${skills.length})`, icon: <Code2 className="w-4 h-4" /> },
            { id: 'experience', label: `Experience (${experience.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: <MessageSquare className="w-4 h-4" /> },
            { 
              id: 'enquiries', 
              label: `Enquiries (${enquiries.length})`, 
              badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
              icon: <Inbox className="w-4 h-4" /> 
            },
            { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase">Total Projects</span>
                <div className="text-3xl font-black text-white font-['Outfit'] mt-2">{projects.length}</div>
                <span className="text-[11px] font-mono text-cyan-400">{projects.filter(p => p.featured).length} Featured on Home</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase">Client Enquiries</span>
                <div className="text-3xl font-black text-white font-['Outfit'] mt-2">{enquiries.length}</div>
                <span className="text-[11px] font-mono text-emerald-400">{newEnquiriesCount} Pending Response</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase">Live Services</span>
                <div className="text-3xl font-black text-white font-['Outfit'] mt-2">{services.length}</div>
                <span className="text-[11px] font-mono text-slate-400">Website, E-Com, AI, etc.</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase">Testimonials</span>
                <div className="text-3xl font-black text-white font-['Outfit'] mt-2">{testimonials.length}</div>
                <span className="text-[11px] font-mono text-amber-400">100% 5-Star Reviews</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-slate-400 uppercase mr-2">Quick Actions:</span>
              <button
                onClick={() => { setEditingProject(null); setProjectModalOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Project
              </button>
              <button
                onClick={() => { setEditingService(null); setServiceModalOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Service
              </button>
              <button
                onClick={() => setActiveTab('enquiries')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <Inbox className="w-3.5 h-3.5 text-cyan-400" />
                View Inbound Leads
              </button>
            </div>

            {/* Recent Enquiries Preview */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-mono uppercase">Recent Inbound Enquiries</h3>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  View All ({enquiries.length}) →
                </button>
              </div>

              {enquiries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-mono text-xs">
                  No enquiries received yet. Form submissions on the public site will appear here automatically.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.slice(0, 3).map((enq) => (
                    <div key={enq.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{enq.name}</span>
                          <span className="text-xs font-mono text-slate-400">({enq.businessName || 'Individual'})</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                            {enq.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {enq.serviceRequired} • Budget: {enq.budgetRange}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic">
                          "{enq.message}"
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab('enquiries')}
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-400 border border-slate-800 shrink-0"
                      >
                        Manage Lead
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Projects Portfolio Manager</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Manage your featured case studies, live links, and categories.
                </p>
              </div>
              <button
                onClick={() => { setEditingProject(null); setProjectModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between">
                  <div className="relative aspect-video bg-slate-950">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                        {proj.category}
                      </span>
                    </div>
                    {proj.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-amber-300" /> Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{proj.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {proj.shortDescription || proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {proj.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <Link
                        to={`/projects/${proj.slug}`}
                        target="_blank"
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View Page
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingProject(proj); setProjectModalOpen(true); }}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'project', id: proj.id, title: proj.title })}
                          className="p-1.5 rounded bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Services & Capabilities</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Manage services offered by VP Creations.
                </p>
              </div>
              <button
                onClick={() => { setEditingService(null); setServiceModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-cyan-400">Order: {srv.order}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditingService(srv); setServiceModalOpen(true); }}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'service', id: srv.id, title: srv.title })}
                          className="p-1.5 rounded bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60 text-rose-300 cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{srv.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 mb-3">{srv.description}</p>
                  </div>
                  <Link
                    to={`/services/${srv.slug}`}
                    target="_blank"
                    className="text-xs font-mono text-cyan-400 hover:underline pt-2 border-t border-slate-800 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View Public Page
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Skills Matrix</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Update your technical proficiencies, tools, and categories.
                </p>
              </div>
              <button
                onClick={() => { setEditingSkill(null); setSkillModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((sk) => (
                <div key={sk.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 block">{sk.category}</span>
                    <h4 className="text-sm font-bold text-white">{sk.name}</h4>
                    <span className="text-xs font-mono text-slate-400">{sk.level}% proficiency</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingSkill(sk); setSkillModalOpen(true); }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'skill', id: sk.id, title: sk.name })}
                      className="p-1 rounded bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60 text-rose-300 cursor-pointer"
                      title="Delete Skill"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Career & Experience Milestones</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Add or update your career milestones displayed on the timeline.
                </p>
              </div>
              <button
                onClick={() => { setEditingExp(null); setExpModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                        {exp.year}
                      </span>
                      <h4 className="text-base font-bold text-white">{exp.title}</h4>
                    </div>
                    <p className="text-xs font-mono text-slate-400">{exp.role}</p>
                    <p className="text-xs text-slate-300 max-w-2xl">{exp.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setEditingExp(exp); setExpModalOpen(true); }}
                      className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'experience', id: exp.id, title: `${exp.year} - ${exp.title}` })}
                      className="p-2 rounded bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60 text-rose-300 cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Client Testimonials</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Manage social proof and feedback from business owners.
                </p>
              </div>
              <button
                onClick={() => { setEditingTest(null); setTestModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Story
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-cyan-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-cyan-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingTest(t); setTestModalOpen(true); }}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'testimonial', id: t.id, title: `${t.clientName}'s review` })}
                          className="p-1 rounded bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60 text-rose-300 cursor-pointer"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic mb-4">"{t.testimonial}"</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <h5 className="text-sm font-bold text-white">{t.clientName}</h5>
                    <p className="text-[11px] text-slate-400 font-mono">{t.business}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">Client Enquiries & Inbound Leads</h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Every enquiry submitted on the contact forms is recorded here in real-time.
              </p>
            </div>

            {enquiries.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center font-mono text-xs text-slate-500">
                No enquiries recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => {
                  const whatsappReplyUrl = `https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${enq.name}, Vishwam Kumar here from VP Creations. I received your enquiry regarding ${enq.serviceRequired}.`
                  )}`;

                  return (
                    <div key={enq.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-bold text-white">{enq.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">({enq.businessName || 'Individual'})</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-mono text-slate-400">Status:</label>
                          <select
                            value={enq.status}
                            onChange={(e) => updateStatus(enq.id, e.target.value as any)}
                            className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Closed">Closed</option>
                          </select>

                          <button
                            onClick={() => setDeleteConfirm({ type: 'enquiry', id: enq.id, title: `${enq.name}'s enquiry` })}
                            className="p-1.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 ml-2 cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block">Service Required:</span>
                          <span className="text-cyan-300 font-bold">{enq.serviceRequired}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Budget Range:</span>
                          <span className="text-emerald-400 font-bold">{enq.budgetRange}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Contact Info:</span>
                          <div className="flex flex-col gap-0.5 text-slate-300">
                            <span>Phone: {enq.phone}</span>
                            <span>Email: {enq.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Project message */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                        <strong className="text-slate-400 block mb-1 uppercase font-mono text-[10px]">Client Description:</strong>
                        {enq.message}
                      </div>

                      {/* Quick Contact Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}?subject=VP Creations - Your Project Enquiry`}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5"
                          >
                            <Mail className="w-3 h-3 text-cyan-400" />
                            Email Client
                          </a>
                        )}

                        {enq.phone && (
                          <a
                            href={whatsappReplyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 hover:bg-emerald-900 text-xs font-mono text-emerald-300 flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            WhatsApp Client Directly
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 8. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">Company & Global Settings</h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Update brand info, phone, email, WhatsApp numbers, and social links across the entire site.
              </p>
            </div>

            {syncStatus && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{syncStatus}</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={settingsForm.email || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settingsForm.linkedinUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={settingsForm.githubUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Resume File / URL</label>
                <input
                  type="text"
                  value={settingsForm.resumeUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, resumeUrl: e.target.value })}
                  placeholder="/resume"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFirebaseModalOpen(true)}
                  className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5" />
                  Configure Firestore & Auth Credentials
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer text-xs font-mono"
                >
                  Save Global Settings
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        projectToEdit={editingProject}
        onSave={async (proj) => {
          await saveProject(proj);
        }}
      />

      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        serviceToEdit={editingService}
        onSave={async (srv) => {
          await saveService(srv);
        }}
      />

      <SkillModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        skillToEdit={editingSkill}
        onSave={async (sk) => {
          await saveSkill(sk);
        }}
      />

      <ExperienceModal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        expToEdit={editingExp}
        onSave={async (exp) => {
          await saveExperience(exp);
        }}
      />

      <TestimonialModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        testToEdit={editingTest}
        onSave={async (t) => {
          await saveTestimonial(t);
        }}
      />

      <FirebaseConfigModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        onConfigSaved={() => {
          // Trigger refresh
        }}
      />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-xs font-mono text-cyan-300 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern In-App Deletion Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0b1120] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Confirm Deletion</h3>
                <p className="text-xs font-mono text-rose-400/80">Permanent action</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">"{deleteConfirm.title}"</span>? This will permanently remove it from your live portfolio and database.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.4)]"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

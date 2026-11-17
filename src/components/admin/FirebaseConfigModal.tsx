import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Key, 
  ExternalLink,
  Flame,
  RefreshCw
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { 
  getStoredFirebaseConfig, 
  initFirebase, 
  isFirebaseConfigured, 
  DataService 
} from '../../lib/firebase';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const currentConfig = getStoredFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  };

  const [formData, setFormData] = useState(currentConfig);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('vp_firebase_config', JSON.stringify(formData));
      const res = initFirebase();
      if (res) {
        setTestResult({ success: true, message: 'Firebase configuration saved and initialized successfully!' });
        onConfigSaved();
      } else {
        setTestResult({ success: false, message: 'Configuration saved, but initialization encountered an issue. Check console.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Error saving configuration' });
    }
  };

  const handleClear = () => {
    localStorage.removeItem('vp_firebase_config');
    setFormData({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    });
    setTestResult({ success: true, message: 'Cleared custom config. Reverting to environment variables or local persistence.' });
    onConfigSaved();
  };

  const handleSeedFirestore = async () => {
    setSeeding(true);
    setTestResult(null);
    const res = await DataService.seedAllToFirestore();
    setSeeding(false);
    setTestResult({ success: res.success, message: res.message });
  };

  const configured = isFirebaseConfigured();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Firebase Integration Settings" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Status banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
          configured 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <Flame className={`w-5 h-5 ${configured ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <p className="text-xs font-mono font-bold uppercase">
                {configured ? 'Firebase Connected' : 'Running in Local / Standalone Mode'}
              </p>
              <p className="text-[11px] text-slate-300">
                {configured 
                  ? 'Firestore & Auth are active. Public data is loaded from Firebase.' 
                  : 'Changes are safely persisted locally. You can plug in your Firebase credentials below anytime.'}
              </p>
            </div>
          </div>

          {configured && (
            <button
              type="button"
              onClick={handleSeedFirestore}
              disabled={seeding}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Syncing...' : 'Sync Data to Firestore'}
            </button>
          )}
        </div>

        {testResult && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            testResult.success 
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">API Key</label>
              <input
                type="text"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Project ID</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="vp-creations-portfolio"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Auth Domain</label>
              <input
                type="text"
                value={formData.authDomain}
                onChange={(e) => setFormData({ ...formData, authDomain: e.target.value })}
                placeholder="vp-creations.firebaseapp.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Storage Bucket</label>
              <input
                type="text"
                value={formData.storageBucket}
                onChange={(e) => setFormData({ ...formData, storageBucket: e.target.value })}
                placeholder="vp-creations.appspot.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Messaging Sender ID</label>
              <input
                type="text"
                value={formData.messagingSenderId}
                onChange={(e) => setFormData({ ...formData, messagingSenderId: e.target.value })}
                placeholder="123456789"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">App ID</label>
              <input
                type="text"
                value={formData.appId}
                onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                placeholder="1:123456789:web:abcdef"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </form>

      </div>
    </Modal>
  );
};

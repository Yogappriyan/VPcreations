import React from 'react';
import { 
  Code2, 
  FileCode, 
  FileCode2, 
  Braces, 
  Atom, 
  Palette, 
  Server, 
  Cpu, 
  Flame, 
  Network, 
  Database, 
  HardDrive, 
  CreditCard, 
  Workflow, 
  MessageSquare, 
  Zap, 
  GitBranch, 
  Github, 
  Cloud, 
  Bot, 
  Sparkles 
} from 'lucide-react';
import { Skill } from '../../types';

interface SkillCardProps {
  skill: Skill;
}

const skillIcons: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-4 h-4 text-cyan-400" />,
  FileCode: <FileCode className="w-4 h-4 text-sky-400" />,
  Braces: <Braces className="w-4 h-4 text-yellow-400" />,
  FileCode2: <FileCode2 className="w-4 h-4 text-blue-400" />,
  Atom: <Atom className="w-4 h-4 text-cyan-400" />,
  Palette: <Palette className="w-4 h-4 text-teal-400" />,
  Server: <Server className="w-4 h-4 text-emerald-400" />,
  Cpu: <Cpu className="w-4 h-4 text-indigo-400" />,
  Flame: <Flame className="w-4 h-4 text-orange-400" />,
  Network: <Network className="w-4 h-4 text-sky-400" />,
  Database: <Database className="w-4 h-4 text-emerald-400" />,
  HardDrive: <HardDrive className="w-4 h-4 text-blue-400" />,
  CreditCard: <CreditCard className="w-4 h-4 text-cyan-400" />,
  Workflow: <Workflow className="w-4 h-4 text-purple-400" />,
  MessageSquare: <MessageSquare className="w-4 h-4 text-emerald-400" />,
  Zap: <Zap className="w-4 h-4 text-amber-400" />,
  GitBranch: <GitBranch className="w-4 h-4 text-rose-400" />,
  Github: <Github className="w-4 h-4 text-slate-300" />,
  Cloud: <Cloud className="w-4 h-4 text-cyan-400" />,
  Bot: <Bot className="w-4 h-4 text-cyan-400" />,
  Sparkles: <Sparkles className="w-4 h-4 text-sky-400" />
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const icon = (skill.icon && skillIcons[skill.icon]) || <Code2 className="w-4 h-4 text-cyan-400" />;

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-sm transition-all duration-200 group">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
            {icon}
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
            {skill.name}
          </span>
        </div>
        <span className="text-xs font-mono font-medium text-cyan-400">
          {skill.level}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 group-hover:brightness-125"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { Sparkles, FileText, LayoutTemplate, ChevronRight, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

export function ToolsScreen() {
  const tools = [
    {
      to: '/tools/proposal',
      title: 'Proposal Generator',
      description: 'Create winning proposals for Upwork & Fiverr',
      icon: FileText,
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
      border: 'hover:border-fuchsia-500/50'
    },
    {
      to: '/tools/gig-title',
      title: 'Gig Title Generator',
      description: 'Generate SEO-optimized Fiverr gig titles',
      icon: Sparkles,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/50'
    },
    {
      to: '/tools/image-generator',
      title: 'AI Image Generator',
      description: 'Turn your text prompts into amazing photos',
      icon: ImageIcon,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/50'
    },
    {
      to: '/tools/income-tracker',
      title: 'Smart Income Tracker',
      description: 'Log earnings naturally with AI extraction',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/50'
    },
    {
      to: '/tools/templates',
      title: 'Template Library',
      description: 'Manage cover letters and quick replies',
      icon: LayoutTemplate,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'hover:border-pink-500/50'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Freelance Tools</h1>
        <p className="text-slate-400 text-sm">AI-powered tools to boost your productivity.</p>
      </header>

      <div className="space-y-4">
        {tools.map((tool) => (
          <Link 
            key={tool.to} 
            to={tool.to}
            className={`flex items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl transition-all group ${tool.border}`}
          >
            <div className={`${tool.bg} w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4`}>
              <tool.icon className={tool.color} size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-200">{tool.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{tool.description}</p>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-slate-400 transition-colors" size={20} />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

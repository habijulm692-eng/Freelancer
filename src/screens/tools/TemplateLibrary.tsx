import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, LayoutTemplate, Copy, Check, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

const PREBUILT_TEMPLATES = [
  {
    id: 't1',
    title: 'Fiverr Gig Description',
    content: `Are you looking for a professional [Your Service] expert? You've come to the right place!\n\nI am a highly skilled [Your Profession] with [X] years of experience. I specialize in helping businesses and individuals achieve their goals through high-quality [Your Service].\n\nWhat you will get:\n- High-quality work\n- Fast delivery\n- Unlimited revisions (if applicable)\n- 100% satisfaction guarantee\n\nWhy choose me?\n- Proven track record\n- Excellent communication\n- Attention to detail\n\nPlease message me before placing an order to discuss your specific requirements. Let's create something amazing together!`
  },
  {
    id: 't2',
    title: 'Buyer Request Reply',
    content: `Hi [Client Name],\n\nI saw your request for [Service/Project] and I am confident I can deliver exactly what you need.\n\nI have extensive experience in [Relevant Skill/Tool] and have successfully completed similar projects in the past. I understand that you need [Briefly restate their main requirement], and my approach would be to [Briefly explain your solution].\n\nI am available to start immediately and can deliver within [Timeframe].\n\nPlease feel free to check my portfolio and reviews. I look forward to discussing the details with you.\n\nBest regards,\n[Your Name]`
  },
  {
    id: 't3',
    title: 'Cover Letter (Upwork)',
    content: `Dear Hiring Manager,\n\nI am writing to express my interest in the [Job Title] position you posted. With my background in [Your Field] and proven ability to deliver [Key Result], I am well-prepared to contribute to your project's success.\n\nIn my previous role/project, I successfully [Mention a relevant achievement or project]. This experience has equipped me with the skills necessary to tackle the challenges outlined in your job description, specifically [Mention a specific requirement from the job post].\n\nI am particularly drawn to this project because [Reason you like the project/company]. I am confident that my skills in [Skill 1] and [Skill 2] will be valuable assets to your team.\n\nI have attached my portfolio for your review. I am available for an interview at your earliest convenience and look forward to the possibility of working together.\n\nSincerely,\n[Your Name]`
  }
];

export function TemplateLibrary() {
  const navigate = useNavigate();
  const { saveItem } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (template: typeof PREBUILT_TEMPLATES[0]) => {
    saveItem({
      type: 'Template',
      title: template.title,
      content: template.content
    });
    alert('Saved to Profile!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6 min-h-screen pb-24 bg-slate-950"
    >
      <header className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white">Template Library</h1>
      </header>

      <div className="space-y-4">
        <p className="text-slate-400 text-sm mb-6">Pre-built templates to save you time. Copy and customize them for your needs.</p>

        {PREBUILT_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-500/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <LayoutTemplate className="text-pink-400" size={20} />
                </div>
                <h3 className="font-semibold text-slate-200">{template.title}</h3>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleCopy(template.content, template.id)}
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedId === template.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={() => handleSave(template)}
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition-colors"
                  title="Save to profile"
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-950 border border-slate-800/50 p-4 rounded-2xl">
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{template.content}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

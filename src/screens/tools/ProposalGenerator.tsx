import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, FileText, Copy, Check, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export function ProposalGenerator() {
  const navigate = useNavigate();
  const { saveItem } = useStore();
  
  const [jobTitle, setJobTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');
  const [tone, setTone] = useState('Professional');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generateProposal = async () => {
    if (!jobTitle.trim() || !requirements.trim()) return;
    setIsGenerating(true);
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
      const prompt = `Write a highly converting freelance proposal (cover letter) for Upwork/Fiverr.
      Tone: ${tone}
      Job Title: ${jobTitle}
      Client Requirements: ${requirements}
      ${budget ? `Budget mentioned: ${budget}` : ''}
      
      Rules:
      1. Start with a strong hook.
      2. Show understanding of their problem.
      3. Briefly mention relevant experience.
      4. End with a clear Call to Action (CTA).
      5. Keep it concise, scannable, and professional.
      6. Do not include placeholders like [Your Name] unless absolutely necessary, use generic but confident sign-offs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResult(response.text || '');
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert('Failed to generate proposal. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    saveItem({
      type: 'Proposal',
      title: `Proposal for: ${jobTitle}`,
      content: result
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
        <h1 className="text-xl font-bold tracking-tight text-white">Proposal Generator</h1>
      </header>

      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Job Title</label>
            <input 
              type="text" 
              placeholder="e.g., React Native Developer Needed"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all text-white placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Client Requirements</label>
            <textarea 
              rows={4}
              placeholder="Paste the job description or key requirements here..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all text-white placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">Budget (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g., $500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all text-white placeholder:text-slate-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all text-white"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly & Approachable">Friendly</option>
                <option value="Expert & Confident">Expert</option>
                <option value="Short & Direct">Direct</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={generateProposal}
            disabled={isGenerating || !jobTitle.trim() || !requirements.trim()}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-white font-medium py-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-500/20 mt-2"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FileText size={18} />
                <span>Generate Proposal</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Generated Proposal</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-medium"
                >
                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg hover:bg-fuchsia-500/20 transition-colors text-xs font-medium"
                >
                  <Bookmark size={14} />
                  <span>Save</span>
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

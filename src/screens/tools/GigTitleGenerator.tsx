import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Sparkles, Copy, Check, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export function GigTitleGenerator() {
  const navigate = useNavigate();
  const { saveItem } = useStore();
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateTitles = async () => {
    if (!keywords.trim()) return;
    setIsGenerating(true);
    setResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
      const prompt = `Generate 5 highly optimized, catchy Fiverr gig titles for the following keywords: "${keywords}".
      Rules:
      1. Start with "I will"
      2. Keep it under 80 characters if possible.
      3. Use strong adjectives (e.g., professional, stunning, expert).
      4. Output ONLY the titles, one per line, no numbering, no bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || '';
      const titles = text.split('\n').filter(t => t.trim().length > 0 && t.toLowerCase().startsWith('i will'));
      setResults(titles);
    } catch (error) {
      console.error('Error generating titles:', error);
      alert('Failed to generate titles. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = (title: string) => {
    saveItem({
      type: 'GigTitle',
      title: 'Gig Title Idea',
      content: title
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
        <h1 className="text-xl font-bold tracking-tight text-white">Gig Title Generator</h1>
      </header>

      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Keywords or Niche</label>
            <input 
              type="text" 
              placeholder="e.g., logo design, video editing"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-slate-600"
            />
          </div>
          
          <button 
            onClick={generateTitles}
            disabled={isGenerating || !keywords.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Titles</span>
              </>
            )}
          </button>
        </div>

        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mt-8"
          >
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Results</h2>
            {results.map((title, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl group flex items-start justify-between">
                <p className="text-slate-200 text-sm leading-relaxed pr-4">{title}</p>
                <div className="flex flex-col space-y-2 shrink-0">
                  <button 
                    onClick={() => handleCopy(title, index)}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <button 
                    onClick={() => handleSave(title)}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                    title="Save to profile"
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

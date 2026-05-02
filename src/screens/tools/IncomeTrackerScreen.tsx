import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Sparkles, DollarSign, Trash2, Calendar, Briefcase, Edit3, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';

export function IncomeTrackerScreen() {
  const navigate = useNavigate();
  const { incomes, addIncome, deleteIncome } = useStore();
  
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');

  // AI State
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual State
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const processIncomeAI = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
      const systemInstruction = `You are a Financial Data Extractor for a Freelancer Income Tracker.
      Task: Analyze the user's input regarding their earnings and extract:
      - Amount (Number only)
      - Currency (e.g., USD, BDT, EUR)
      - Platform (e.g., Upwork, Fiverr, Direct Client)
      - Project Name/Description
      - Date (If mentioned, otherwise "Today")
      Constraint: Output MUST be in valid JSON format. If information is missing, use "Unknown".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              platform: { type: Type.STRING },
              description: { type: Type.STRING },
              date: { type: Type.STRING },
              status: { type: Type.STRING }
            },
            required: ["amount", "currency", "platform", "description", "date"]
          }
        }
      });

      const text = response.text || '';
      const data = JSON.parse(text);

      addIncome({
        amount: data.amount || 0,
        currency: data.currency || 'USD',
        platform: data.platform || 'Unknown',
        description: data.description || 'Unknown',
        date: data.date === 'Today' ? new Date().toISOString().split('T')[0] : data.date,
      });

      setPrompt('');
      setActiveTab('manual');
    } catch (error) {
      console.error('Error processing income:', error);
      alert('Failed to process income. Please check your API key and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !platform || !description || !date) return;
    
    addIncome({
      amount: Number(amount),
      currency,
      platform,
      description,
      date,
    });
    
    setAmount('');
    setDescription('');
    setPlatform('');
    // Keep currency and date as they are usually repetitive
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
        <h1 className="text-xl font-bold tracking-tight text-white">Income Tracker</h1>
      </header>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'manual' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Edit3 size={16} />
              <span>Manual Entry</span>
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'ai' ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Wand2 size={16} />
              <span>AI Smart Log</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'manual' ? (
              <motion.form 
                key="manual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleManualSubmit} 
                className="space-y-4"
              >
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount</label>
                    <input 
                      type="number" 
                      required 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white placeholder:text-slate-600" 
                      placeholder="e.g. 500" 
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Currency</label>
                    <input 
                      type="text" 
                      required 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value.toUpperCase())} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white placeholder:text-slate-600 uppercase" 
                      placeholder="USD, BDT..." 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
                  <input 
                    type="text" 
                    required 
                    value={platform} 
                    onChange={e => setPlatform(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white placeholder:text-slate-600" 
                    placeholder="e.g. Fiverr, Upwork, Direct" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                  <input 
                    type="text" 
                    required 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white placeholder:text-slate-600" 
                    placeholder="e.g. Logo Design, Web Dev" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 mt-2"
                >
                  Save Income
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Log your earnings naturally</label>
                  <textarea 
                    rows={4}
                    placeholder="e.g., Just got paid $500 for a logo design on Fiverr today!"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600 resize-none"
                  />
                </div>
                
                <button 
                  onClick={processIncomeAI}
                  disabled={isProcessing || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Extract & Save</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Recent Earnings</h2>
          
          {incomes.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 border border-slate-800/50 rounded-2xl border-dashed">
              <div className="bg-slate-800/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-slate-500" size={20} />
              </div>
              <p className="text-slate-500 text-sm">No income logged yet.</p>
              <p className="text-slate-600 text-xs mt-1">Add your earnings above to track them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomes.map((income) => (
                <motion.div 
                  layout
                  key={income.id} 
                  className="bg-slate-900 border border-slate-800 p-4 rounded-2xl group flex flex-col space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-200 text-lg">
                        {income.currency} {income.amount}
                      </h3>
                      <p className="text-sm text-slate-400 mt-0.5">{income.description}</p>
                    </div>
                    <button 
                      onClick={() => deleteIncome(income.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center space-x-1.5">
                      <Briefcase size={14} className="text-emerald-500/70" />
                      <span className="font-medium">{income.platform}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar size={14} className="text-blue-500/70" />
                      <span>{income.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

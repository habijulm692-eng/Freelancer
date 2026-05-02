import { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Settings, Bookmark, Trash2, Edit2, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function ProfileScreen() {
  const { userName, setUserName, savedItems, deleteSavedItem } = useStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8 min-h-screen pb-24"
    >
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </header>

      {/* User Info */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-fuchsia-500 to-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-fuchsia-500/20">
          <User size={32} className="text-white" />
        </div>
        <div className="flex-1">
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white w-full focus:outline-none focus:border-fuchsia-500"
                autoFocus
              />
              <button onClick={handleSaveName} className="text-emerald-400 p-1 hover:bg-emerald-400/10 rounded">
                <Check size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{userName}</h2>
              <button onClick={() => setIsEditingName(true)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <p className="text-sm text-slate-400">Pro Freelancer</p>
        </div>
      </section>

      {/* Saved Items */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bookmark className="text-fuchsia-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Saved Items</h2>
        </div>

        {savedItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800/50 rounded-2xl border-dashed">
            <p className="text-slate-500 text-sm">No saved items yet.</p>
            <p className="text-slate-600 text-xs mt-1">Generate proposals or gig titles to save them here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedItems.map(item => (
              <motion.div 
                layout
                key={item.id} 
                className="bg-slate-900 border border-slate-800 p-4 rounded-2xl group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      item.type === 'GigTitle' ? 'bg-blue-500/10 text-blue-400' :
                      item.type === 'Proposal' ? 'bg-fuchsia-500/10 text-fuchsia-400' :
                      'bg-pink-500/10 text-pink-400'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.dateSaved).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteSavedItem(item.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="font-medium text-slate-200 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-3 whitespace-pre-wrap">{item.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}

import React, { useState } from 'react';
import { useStore, Client, ClientStatus, Platform } from '../store/useStore';
import { Plus, Search, MoreVertical, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ClientsScreen() {
  const { clients, addClient, deleteClient } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('Fiverr');
  const [projectDetails, setProjectDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Pending');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.projectDetails.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !projectDetails) return;
    
    addClient({
      name,
      platform,
      projectDetails,
      budget,
      deadline,
      status
    });
    
    // Reset form
    setName('');
    setProjectDetails('');
    setBudget('');
    setDeadline('');
    setIsAdding(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 min-h-screen pb-24"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clients</h1>
          <p className="text-slate-400 text-sm">Manage your active projects.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white p-2 rounded-full transition-colors shadow-lg shadow-fuchsia-500/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text"
          placeholder="Search clients or projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all placeholder:text-slate-600"
        />
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddClient} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 mb-6">
              <h3 className="font-semibold text-fuchsia-400">Add New Client</h3>
              
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Client Name" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-fuchsia-500/50"
                />
                
                <select 
                  value={platform} onChange={e => setPlatform(e.target.value as Platform)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-fuchsia-500/50"
                >
                  <option value="Fiverr">Fiverr</option>
                  <option value="Upwork">Upwork</option>
                  <option value="Other">Other</option>
                </select>

                <textarea 
                  placeholder="Project Details" required rows={2}
                  value={projectDetails} onChange={e => setProjectDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-fuchsia-500/50 resize-none"
                />

                <div className="flex space-x-3">
                  <input 
                    type="text" placeholder="Budget ($)"
                    value={budget} onChange={e => setBudget(e.target.value)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-fuchsia-500/50"
                  />
                  <input 
                    type="date" placeholder="Deadline"
                    value={deadline} onChange={e => setDeadline(e.target.value)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-fuchsia-500/50"
                  />
                </div>

                <select 
                  value={status} onChange={e => setStatus(e.target.value as ClientStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-fuchsia-500/50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-fuchsia-600 text-white text-sm font-medium hover:bg-fuchsia-500 transition-colors">
                  Save Client
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredClients.length === 0 && !isAdding ? (
          <div className="text-center py-12">
            <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-600" size={24} />
            </div>
            <h3 className="text-slate-300 font-medium">No clients found</h3>
            <p className="text-slate-500 text-sm mt-1">Add a client to start tracking projects.</p>
          </div>
        ) : (
          filteredClients.map(client => (
            <motion.div 
              layout
              key={client.id} 
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative group"
            >
              <button 
                onClick={() => deleteClient(client.id)}
                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors"
                title="Delete client"
              >
                <MoreVertical size={18} />
              </button>
              
              <div className="flex items-start justify-between mb-3 pr-6">
                <div>
                  <h3 className="font-semibold text-slate-200 text-lg">{client.name}</h3>
                  <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-medium rounded-md mt-1 uppercase tracking-wider">
                    {client.platform}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  client.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  client.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>
                  {client.status}
                </span>
              </div>
              
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{client.projectDetails}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/50">
                <div className="flex items-center space-x-1">
                  <DollarSign size={14} className="text-emerald-500/70" />
                  <span className="font-medium text-slate-300">{client.budget || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} className="text-blue-500/70" />
                  <span>{client.deadline ? new Date(client.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

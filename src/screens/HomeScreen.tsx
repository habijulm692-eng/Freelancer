import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FileText, Sparkles, LayoutTemplate, CheckCircle2, Clock, Plus, Circle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function HomeScreen() {
  const { userName, tasks, addTask, toggleTask, deleteTask, clients } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const activeClients = clients.filter(c => c.status === 'Ongoing');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim(), deadline: new Date().toISOString() });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400">{userName}</span>!
        </h1>
        <p className="text-slate-400 text-sm">Let's crush some goals today.</p>
      </header>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/tools/proposal" className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-fuchsia-500/50 transition-colors group">
            <div className="bg-fuchsia-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:bg-fuchsia-500/20 transition-colors">
              <FileText className="text-fuchsia-400" size={20} />
            </div>
            <h3 className="font-medium text-sm">Write Proposal</h3>
          </Link>
          <Link to="/tools/gig-title" className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
              <Sparkles className="text-blue-400" size={20} />
            </div>
            <h3 className="font-medium text-sm">Gig Titles</h3>
          </Link>
          <Link to="/tools/templates" className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-pink-500/50 transition-colors group col-span-2 flex items-center space-x-4">
            <div className="bg-pink-500/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-pink-500/20 transition-colors shrink-0">
              <LayoutTemplate className="text-pink-400" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-sm">Open Templates</h3>
              <p className="text-xs text-slate-400 mt-0.5">Access your saved responses</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Overview</h2>
        <div className="flex space-x-4">
          <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-amber-400" size={16} />
              <span className="text-xs text-slate-400 font-medium">Pending Tasks</span>
            </div>
            <p className="text-2xl font-bold">{pendingTasks.length}</p>
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="text-emerald-400" size={16} />
              <span className="text-xs text-slate-400 font-medium">Active Clients</span>
            </div>
            <p className="text-2xl font-bold">{activeClients.length}</p>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Today's Tasks</h2>
          <button 
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors p-1"
          >
            <Plus size={20} />
          </button>
        </div>

        <AnimatePresence>
          {isAddingTask && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleAddTask} className="flex space-x-2 mb-4">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fuchsia-500/50"
                />
                <button 
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 border-dashed">
              No tasks for today. You're all caught up!
            </p>
          ) : (
            tasks.map(task => (
              <motion.div 
                layout
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                  task.isCompleted 
                    ? 'bg-slate-900/50 border-slate-800/50 opacity-60' 
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 transition-colors ${task.isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-fuchsia-400'}`}
                  >
                    {task.isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <span className={`text-sm ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1 ml-2"
                >
                  <Plus size={16} className="rotate-45" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </motion.div>
  );
}

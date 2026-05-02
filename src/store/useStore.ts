import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type ClientStatus = 'Pending' | 'Ongoing' | 'Completed';
export type Platform = 'Fiverr' | 'Upwork' | 'Other';

export interface Client {
  id: string;
  name: string;
  platform: Platform;
  projectDetails: string;
  budget: string;
  deadline: string;
  status: ClientStatus;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  isCompleted: boolean;
}

export interface SavedItem {
  id: string;
  type: 'GigTitle' | 'Proposal' | 'Template';
  title: string;
  content: string;
  dateSaved: string;
}

export interface Income {
  id: string;
  amount: number;
  currency: string;
  platform: string;
  description: string;
  date: string;
}

interface AppState {
  userName: string;
  setUserName: (name: string) => void;
  
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'id' | 'dateSaved'>) => void;
  deleteSavedItem: (id: string) => void;

  incomes: Income[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  deleteIncome: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userName: 'Freelancer',
      setUserName: (name) => set({ userName: name }),
      
      clients: [],
      addClient: (client) => set((state) => ({
        clients: [...state.clients, { ...client, id: uuidv4() }]
      })),
      updateClient: (id, updatedClient) => set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...updatedClient } : c)
      })),
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter(c => c.id !== id)
      })),
      
      tasks: [],
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: uuidv4(), isCompleted: false }]
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      savedItems: [],
      saveItem: (item) => set((state) => ({
        savedItems: [{ ...item, id: uuidv4(), dateSaved: new Date().toISOString() }, ...state.savedItems]
      })),
      deleteSavedItem: (id) => set((state) => ({
        savedItems: state.savedItems.filter(i => i.id !== id)
      })),

      incomes: [],
      addIncome: (income) => set((state) => ({
        incomes: [{ ...income, id: uuidv4() }, ...state.incomes]
      })),
      deleteIncome: (id) => set((state) => ({
        incomes: state.incomes.filter(i => i.id !== id)
      })),
    }),
    {
      name: 'freelancer-storage',
    }
  )
);

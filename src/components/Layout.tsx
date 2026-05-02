import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-fuchsia-500/30">
      <main className="max-w-md mx-auto min-h-screen pb-20 relative shadow-2xl shadow-black/50 bg-slate-950">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

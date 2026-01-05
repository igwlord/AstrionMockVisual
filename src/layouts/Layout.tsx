import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import clsx from 'clsx';

export function Layout() {
  const [presentationMode, setPresentationMode] = useState(false);

  return (
    <div className="min-h-screen bg-abyss text-bone selection:bg-gold/30">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-20" />
      
      {/* Sidebar - Hidden in Presentation Mode */}
      {/* Sidebar - Hidden in Presentation Mode */}
      <aside 
        className={clsx(
          "fixed left-0 top-0 h-screen w-64 z-20 bg-abyss-panel border-r border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          presentationMode ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className={clsx(
        "relative z-10 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        presentationMode ? "pl-0" : "pl-64"
      )}>
        <TopBar 
          presentationMode={presentationMode} 
          togglePresentationMode={() => setPresentationMode(!presentationMode)} 
        />
        
        <div className="pt-20 px-8 pb-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

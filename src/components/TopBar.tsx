import { MonitorPlay, X } from 'lucide-react';
import clsx from 'clsx';

interface TopBarProps {
  presentationMode: boolean;
  togglePresentationMode: () => void;
}

export function TopBar({ presentationMode, togglePresentationMode }: TopBarProps) {
  return (
    <header className={clsx(
      "fixed top-0 right-0 z-30 transition-all duration-500 border-b border-white/5 bg-abyss/80 backdrop-blur-md",
      presentationMode ? "left-0" : "left-64"
    )}>
      <div className="h-16 flex items-center justify-between px-8">
        {/* Left: Breadcrumb or Page Title (Dynamic optional) */}
        <div className="flex items-center gap-4">
           {presentationMode && (
             <span className="font-display text-gold tracking-[0.2em] text-xs font-bold uppercase">
               Astrion Presentation Mode
             </span>
           )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePresentationMode}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-300",
              presentationMode 
                ? "bg-gold/10 border-gold/40 text-gold hover:bg-gold/20" 
                : "bg-white/5 border-white/10 text-bone/60 hover:text-bone hover:border-white/20"
            )}
          >
            {presentationMode ? <X className="w-3 h-3" /> : <MonitorPlay className="w-3 h-3" />}
            <span>{presentationMode ? 'EXIT PRES' : 'PRESENTATION'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import { NavLink } from 'react-router-dom';
import { 
  Command, 
  Palette, 
  Instagram, 
  Youtube, 
  Music, 
  Download,
  Disc,
  Layout
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Overview', icon: Disc },
  { path: '/style-guide', label: 'Style Guide', icon: Palette },
  { path: '/instagram', label: 'Instagram', icon: Instagram },
  { path: '/youtube', label: 'YouTube', icon: Youtube },
  { path: '/soundcloud', label: 'SoundCloud', icon: Music },
  { path: '/studio', label: 'Studio', icon: Layout },
  { path: '/exports', label: 'Banco de Imagenes', icon: Download },
];

export function Sidebar() {
  return (
    <div className="h-full w-full flex flex-col bg-abyss-panel/50 backdrop-blur-xl border-r border-white/5 relative overflow-hidden">
      {/* Abstract bg element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="h-24 flex items-center px-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <Command className="w-4 h-4 text-gold" />
          </div>
          <div>
            <span className="font-display font-medium tracking-wide text-sm text-bone block leading-none">
              ASTRION
            </span>
            <span className="text-[10px] font-mono text-bone/30 tracking-widest uppercase">
              Brand OS
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 z-10 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors duration-300",
              isActive 
                ? "text-bone font-medium" 
                : "text-bone/40 hover:text-bone/70"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Subtle Background Highlight */}
                {isActive && (
                   <motion.div 
                     layoutId="active-bg"
                     className="absolute inset-0 rounded-lg bg-white/5 pointer-events-none"
                     initial={false}
                     transition={{ type: "spring", stiffness: 400, damping: 35 }}
                   />
                )}

                {/* Accent Dot */}
                <div className="relative z-10 flex items-center gap-3">
                  <span className={clsx(
                    "w-1 h-1 rounded-full transition-all duration-300",
                    isActive ? "bg-gold scale-100" : "bg-transparent scale-0 group-hover:bg-white/10 group-hover:scale-100"
                  )} />
                  
                  <item.icon className={clsx(
                    "w-4 h-4 transition-colors duration-300",
                    isActive ? "text-gold" : "text-current group-hover:text-bone/80"
                  )} />
                  
                  <span className="tracking-wide">
                    {item.label}
                  </span>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5 z-10 bg-abyss-panel/30">
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-mono tracking-widest uppercase">System Online</span>
        </div>
      </div>
    </div>
  );
}

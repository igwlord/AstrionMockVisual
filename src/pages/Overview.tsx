import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music, Globe, ArrowRight, Disc, type LucideIcon } from 'lucide-react';

function BrandMark() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
       {/* Outer Ring */}
       <div className="absolute inset-0 border border-white/5 rounded-full" />
       
       {/* Ritual Rings */}
       <div className="absolute inset-4 border border-gold/20 rounded-full animate-[spin_12s_linear_infinite]" />
       <div className="absolute inset-12 border border-nebula/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
       
       {/* Core */}
       <div className="w-24 h-24 bg-abyss-deep rounded-full border border-bone/10 flex items-center justify-center z-10 shadow-[0_0_50px_-10px_rgba(91,75,138,0.3)]">
          <Disc className="w-12 h-12 text-gold opacity-80" />
       </div>
       
       {/* Orbitals */}
       <div className="absolute top-0 left-1/2 w-2 h-2 bg-gold rounded-full -translate-x-1/2 -translate-y-1 shadow-[0_0_10px_rgba(198,168,107,0.8)]" />
    </div>
  );
}

function LinkCard({ to, icon: Icon, title, desc }: { to: string, icon: LucideIcon, title: string, desc: string }) {
  return (
    <Link to={to} className="group p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
       <div className="w-12 h-12 rounded-full bg-abyss flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-bone group-hover:text-white" />
       </div>
       <h3 className="text-lg font-medium text-bone mb-1 group-hover:text-white">{title}</h3>
       <p className="text-sm text-bone/50 group-hover:text-bone/70">{desc}</p>
       <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
          OPEN <ArrowRight className="w-3 h-3" />
       </div>
    </Link>
  );
}

export function Overview() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out] space-y-20 pb-12">
      {/* Hero */}
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
         <BrandMark />
         
         <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-display font-medium text-bone uppercase tracking-tight leading-none">
               Astrion <br/>
               <span className="text-gold/80">Brand OS</span>
            </h1>
            <p className="text-lg text-bone/60 max-w-xl font-light leading-relaxed">
               Organismo sonoro · Frecuencia contenida · Transmutación encarnada
               <br/><br/>
               This Operating System defines the visual and sonic laws of the Astrion ecosystem.
            </p>
         </div>
      </div>

      {/* Brand Principles */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border-t border-b border-white/5 py-8">
         {['Silence', 'Gravity', 'Ritual', 'Pulse', 'Signal'].map((principle) => (
            <div key={principle} className="text-center space-y-2 group cursor-default">
               <div className="w-2 h-2 bg-white/10 rounded-full mx-auto group-hover:bg-gold transition-colors" />
               <span className="block text-sm font-mono uppercase tracking-[0.2em] text-bone/50 group-hover:text-bone transition-colors">{principle}</span>
            </div>
         ))}
      </div>

      {/* Quick Links */}
      <section className="space-y-6">
         <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
            Access Nodes
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LinkCard to="/instagram" icon={Instagram} title="Instagram" desc="Visual Grid & 21-Day Cycle" />
            <LinkCard to="/youtube" icon={Youtube} title="YouTube" desc="Frequency Sessions & Visuals" />
            <LinkCard to="/soundcloud" icon={Music} title="SoundCloud" desc="Audio Signals & Sets" />
            <LinkCard to="/web" icon={Globe} title="Web Experience" desc="Central Hub & Landing" />
         </div>
      </section>
    </div>
  );
}

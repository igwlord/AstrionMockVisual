import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music, Globe, ArrowRight, type LucideIcon } from 'lucide-react';



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
         <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            {/* Spinning Vinyl Logo */}
            <div className="w-full h-full rounded-full overflow-hidden shadow-[0_0_50px_-10px_rgba(91,75,138,0.5)] border-4 border-abyss-deep animate-[spin_6s_linear_infinite]">
               <img 
                 src="/images/Logo IG.png" 
                 alt="Astrion Vinyl" 
                 className="w-full h-full object-cover"
               />
            </div>
         </div>
         
         <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-display font-medium text-bone uppercase tracking-tight leading-none">
               Astrion <br/>
               <span className="text-gold/80">Brand OS</span>
            </h1>
            <p className="text-lg text-bone/60 max-w-xl font-light leading-relaxed">
               Organismo sonoro · Frecuencia contenida · Transmutación encarnada
               <br/><br/>
               Este Sistema Operativo define las leyes visuales y sonoras del ecosistema Astrion.
            </p>
         </div>
      </div>

      {/* Quick Links */}
      <section className="space-y-6">
         <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
            Nodos de Acceso
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LinkCard to="/instagram" icon={Instagram} title="Instagram" desc="Grilla Visual y Ciclo de 21 Días" />
            <LinkCard to="/youtube" icon={Youtube} title="YouTube" desc="Sesiones de Frecuencia y Visuales" />
            <LinkCard to="/soundcloud" icon={Music} title="SoundCloud" desc="Señales de Audio y Sets" />
            <LinkCard to="/web" icon={Globe} title="Web Experience" desc="Nodo Central y Landing" />
         </div>
      </section>
    </div>
  );
}

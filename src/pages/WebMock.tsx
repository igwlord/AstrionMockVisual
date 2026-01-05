import { PageHeader } from '../components/PageHeader';
import { ArrowDown, Music, Instagram, Youtube } from 'lucide-react';

export function WebMock() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <PageHeader 
        title="Web Experience" 
        subtitle="The central digital node." 
      />

      <div className="relative w-full h-[80vh] border border-white/5 rounded-2xl overflow-hidden bg-abyss flex flex-col items-center justify-center group">
        
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="absolute inset-0">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nebula/10 rounded-full blur-3xl animate-pulse-slow" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Elements (Parallax Mock) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-12 right-12 opacity-20 font-mono text-xs tracking-widest text-bone">
             LAT: 34.6037 S <br/>
             LON: 58.3816 W
          </div>
          <div className="absolute bottom-12 left-12 opacity-20 font-mono text-xs tracking-widest text-bone">
             SYS_READY <br/>
             FREQ_STABLE
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-8 p-4">
           {/* Logo Mark */}
           <div className="w-24 h-24 mx-auto rounded-full border border-bone/10 flex items-center justify-center mb-6 bg-abyss/50 backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(198,168,107,0.1)]">
              <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center">
                 <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_rgba(198,168,107,0.8)]" />
              </div>
           </div>

           {/* Wordmark */}
           <div className="space-y-4">
             <h1 className="text-6xl md:text-8xl font-display font-medium text-bone tracking-tighter uppercase mix-blend-overlay">
               Astrion
             </h1>
             <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
             <p className="font-mono text-gold/80 tracking-[0.2em] text-sm uppercase">
               Cosmic Groove · Light Through Bass
             </p>
           </div>
        </div>

        {/* CTAs */}
        <div className="relative z-10 mt-16 flex gap-6 md:gap-12">
           <a href="#" className="group flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/10 transition-all duration-300">
                <Music className="w-5 h-5 text-bone group-hover:text-gold" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-bone/50 group-hover:text-gold transition-colors">SoundCloud</span>
           </a>
           <a href="#" className="group flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-nebula/50 group-hover:bg-nebula/10 transition-all duration-300">
                <Instagram className="w-5 h-5 text-bone group-hover:text-nebula" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-bone/50 group-hover:text-nebula transition-colors">Instagram</span>
           </a>
           <a href="#" className="group flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all duration-300">
                <Youtube className="w-5 h-5 text-bone group-hover:text-red-500" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-bone/50 group-hover:text-red-500 transition-colors">YouTube</span>
           </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce opacity-30">
           <ArrowDown className="w-4 h-4 text-bone" />
        </div>
      </div>
      
      {/* Mock Section Breakdown */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 pointer-events-none">
         <div className="h-32 border border-white/5 bg-white/5 rounded flex items-center justify-center">
            <span className="font-mono text-xs">Section: Bio</span>
         </div>
         <div className="h-32 border border-white/5 bg-white/5 rounded flex items-center justify-center">
            <span className="font-mono text-xs">Section: Dates</span>
         </div>
         <div className="h-32 border border-white/5 bg-white/5 rounded flex items-center justify-center">
            <span className="font-mono text-xs">Section: Contact</span>
         </div>
      </div>
    </div>
  );
}

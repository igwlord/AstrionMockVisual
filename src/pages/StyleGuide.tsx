import { PageHeader } from '../components/PageHeader';

export function StyleGuide() {
  const colors = [
    { name: 'Abyss Violet 1', hex: '#0B0A14', class: 'bg-abyss', text: 'Base' },
    { name: 'Abyss Violet 2', hex: '#120E1F', class: 'bg-abyss-deep', text: 'Secondary Base' },
    { name: 'Deep Graphite', hex: '#0E1014', class: 'bg-abyss-panel', text: 'Panels & Cards' },
    { name: 'Organic Gold', hex: '#C6A86B', class: 'bg-gold', text: 'Accents (Sparingly)' },
    { name: 'Nebula Violet', hex: '#5B4B8A', class: 'bg-nebula', text: 'Pulse Highlights' },
    { name: 'Night Blue', hex: '#0F1B2D', class: 'bg-night', text: 'Tech / Secondary' },
    { name: 'Bone White', hex: '#E6E2DA', class: 'bg-bone', text: 'Primary Text (Never Pure White)' },
  ];

  return (
    <div className="space-y-16 animate-[fadeIn_0.5s_ease-out]">
      <PageHeader 
        title="Style Guide" 
        subtitle="The visual DNA of the Astrion organism. Defined by silence, depth, and organic precision." 
      />

      {/* Color System */}
      <section className="space-y-6">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
          01 // Color System
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div key={color.hex} className="group cursor-pointer">
              <div className={`h-32 w-full rounded-lg shadow-2xl mb-4 border border-white/5 transition-transform duration-300 group-hover:-translate-y-1 ${color.class}`}></div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <div>
                  <h3 className="text-bone font-medium">{color.name}</h3>
                  <p className="text-bone/40 text-xs mt-1 uppercase tracking-wider">{color.text}</p>
                </div>
                <span className="font-mono text-xs text-gold/60">{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography System */}
      <section className="space-y-6">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
          02 // Typography
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Headings */}
           <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-mono text-bone/30">Display H1 / Satoshi / Medium / Uppercase</span>
                <h1 className="text-6xl font-display font-medium text-bone uppercase tracking-tight">
                  Astrion
                </h1>
              </div>
              <div className="space-y-2">
                 <span className="text-xs font-mono text-bone/30">H2 / Satoshi / Regular / Tracking Wider</span>
                 <h2 className="text-4xl font-display font-medium text-bone/90 uppercase tracking-widest">
                   Frequency
                 </h2>
              </div>
              <div className="space-y-2">
                 <span className="text-xs font-mono text-bone/30">H3 / Satoshi / Regular</span>
                 <h3 className="text-2xl font-display font-medium text-bone/80 uppercase tracking-wide text-gold">
                   Living Abyss
                 </h3>
              </div>
           </div>

           {/* Body */}
           <div className="space-y-8 bg-abyss-panel p-8 rounded-xl border border-white/5">
              <div className="space-y-4">
                 <span className="text-xs font-mono text-bone/30">Body / Inter / Regular</span>
                 <p className="text-bone/80 leading-relaxed max-w-prose">
                   Astrion is not a DJ brand. It is a living sonic organism that transmits frequency. The aesthetic must feel organic (biological textures, subtle grain) and deep (void as potential, not dead black).
                 </p>
                 <p className="text-bone/80 leading-relaxed max-w-prose">
                   We avoid festival hype. We avoid neon. We cultivate silence and hierarchy. Every element has gravity.
                 </p>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-white/5">
                 <span className="text-xs font-mono text-bone/30">Micro / Mono / System</span>
                 <p className="font-mono text-xs text-bone/50 tracking-wider">
                   SESSION_ID: 21 // 128 BPM // F MINOR
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="space-y-6">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
          03 // Directives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DO */}
          <div className="p-6 border-l-2 border-emerald-500/50 bg-emerald-900/10 rounded-r-lg">
            <h3 className="text-emerald-400 font-display uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-lg">✓</span> Do
            </h3>
            <ul className="space-y-3 text-bone/80 text-sm">
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Use large negative space. Silence is part of the design.</li>
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Use subtle gradients (Abyss 1 to Abyss 2).</li>
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Treat "Gold" as a rare metal. Use it sparingly.</li>
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Use bone white for text, never pure #FFFFFF.</li>
            </ul>
          </div>

          {/* DON'T */}
           <div className="p-6 border-l-2 border-red-500/50 bg-red-900/10 rounded-r-lg">
            <h3 className="text-red-400 font-display uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-lg">×</span> Don't
            </h3>
            <ul className="space-y-3 text-bone/80 text-sm">
               <li className="flex gap-2"><span className="text-red-500">•</span> No neon glows or "cyberpunk" aesthetics.</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> No pure black (#000000). It kills the organic feel.</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> No cluttered layouts or small margins.</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> No heavy drop shadows. Keep it flat or subtle.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}


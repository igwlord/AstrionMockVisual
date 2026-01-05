import { PageHeader } from '../components/PageHeader';

export function StyleGuide() {
  const colors = [
    { name: 'Abyss Violet 1', hex: '#0B0A14', class: 'bg-abyss', text: 'Base' },
    { name: 'Abyss Violet 2', hex: '#120E1F', class: 'bg-abyss-deep', text: 'Base Secundaria' },
    { name: 'Deep Graphite', hex: '#0E1014', class: 'bg-abyss-panel', text: 'Paneles y Tarjetas' },
    { name: 'Organic Gold', hex: '#C6A86B', class: 'bg-gold', text: 'Acentos (Moderado)' },
    { name: 'Nebula Violet', hex: '#5B4B8A', class: 'bg-nebula', text: 'Highlights de Pulso' },
    { name: 'Night Blue', hex: '#0F1B2D', class: 'bg-night', text: 'Tech / Secundario' },
    { name: 'Bone White', hex: '#E6E2DA', class: 'bg-bone', text: 'Texto Primario (Nunca blanco puro)' },
  ];

  return (
    <div className="space-y-16 animate-[fadeIn_0.5s_ease-out]">
      <PageHeader 
        title="Guía de Estilo" 
        subtitle="El ADN visual del organismo Astrion. Definido por silencio, profundidad y precisión orgánica." 
      />

      {/* Color System */}
      <section className="space-y-6">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
          01 // Sistema de Color
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
          02 // Tipografía
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
                   Frecuencia
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
                 <span className="text-xs font-mono text-bone/30">Cuerpo / Inter / Regular</span>
                 <p className="text-bone/80 leading-relaxed max-w-prose">
                   Astrion no es una marca de DJ. Es un organismo sonoro vivo que transmite frecuencia. La estética debe sentirse orgánica (texturas biológicas, grano sutil) y profunda (el vacío como potencia, no negro muerto).
                 </p>
                 <p className="text-bone/80 leading-relaxed max-w-prose">
                   Evitamos el hype de festival. Evitamos el neón. Cultivamos el silencio y la jerarquía. Cada elemento tiene gravedad.
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
          03 // Directivas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DO */}
          <div className="p-6 border-l-2 border-emerald-500/50 bg-emerald-900/10 rounded-r-lg">
            <h3 className="text-emerald-400 font-display uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-lg">✓</span> Correcto
            </h3>
            <ul className="space-y-3 text-bone/80 text-sm">
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Usar grandes espacios negativos. El silencio es parte del diseño.</li>
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Usar gradientes sutiles (Abyss 1 a Abyss 2).</li>
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Tratar el "Oro" como metal raro. Usarlo con moderación.</li>
               <li className="flex gap-2"><span className="text-emerald-500">•</span> Usar blanco hueso para texto, nunca blanco puro (#FFFFFF).</li>
            </ul>
          </div>

          {/* DON'T */}
           <div className="p-6 border-l-2 border-red-500/50 bg-red-900/10 rounded-r-lg">
            <h3 className="text-red-400 font-display uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-lg">×</span> Incorrecto
            </h3>
            <ul className="space-y-3 text-bone/80 text-sm">
               <li className="flex gap-2"><span className="text-red-500">•</span> No usar neón ni estética "cyberpunk".</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> No usar negro puro (#000000). Mata la sensación orgánica.</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> No usar layouts saturados o márgenes pequeños.</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> Evitar sombras pesadas (drop shadows). Mantenerlo plano o sutil.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}


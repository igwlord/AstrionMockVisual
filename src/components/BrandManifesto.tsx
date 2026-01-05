import { X, LayoutGrid, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandManifesto({ isOpen, onClose }: BrandManifestoProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyss/90 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="w-full max-w-4xl bg-abyss-deep border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-abyss-panel sticky top-0 z-10">
            <div>
               <span className="text-xs font-mono text-gold/80 uppercase tracking-widest block mb-1">Guía Visual & Estratégica</span>
               <h2 className="text-xl font-display text-bone">Protocolo Astrion v1.0</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-bone transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-8 space-y-16 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             
             {/* 01. POSICIONAMIENTO */}
             <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 text-gold">
                      <span className="font-mono font-bold">01</span>
                   </div>
                   <h3 className="text-2xl font-display text-bone">La Élite Silenciosa</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-bone/70">
                   <p>
                      ASTRION no se presenta como un producto de consumo masivo. Se posiciona en el nicho del <strong className="text-bone">Lujo Silencioso</strong> y el Ritualismo Electrónico. En un mercado saturado de ruido visual y estética festivalera, ASTRION gana poder mediante la omisión.
                   </p>
                   <div className="bg-white/5 p-4 rounded border-l-2 border-gold/50 italic text-bone/90">
                      "Nuestra ventaja competitiva no es 'ser vistos', sino 'ser descubiertos' por aquellos con el criterio estético para valorar la profundidad y la sobriedad."
                   </div>
                </div>
             </section>

             {/* 02. CONCEPTO */}
             <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 text-gold">
                      <span className="font-mono font-bold">02</span>
                   </div>
                   <h3 className="text-2xl font-display text-bone">El Organismo Sonoro</h3>
                </div>
                <p className="text-bone/70 max-w-2xl mb-8">
                   El concepto central es la biología de la frecuencia. Visualmente, ASTRION debe ser tratado como una entidad viva que habita en el Sol Central del Universo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="border border-white/5 p-4 rounded bg-abyss-panel">
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Morfología</span>
                      <p className="text-sm text-bone">Uso de formas orgánicas, fluidas y microscópicas.</p>
                   </div>
                   <div className="border border-white/5 p-4 rounded bg-abyss-panel">
                      <span className="text-xs uppercase tracking-widest text-gold mb-2 block">Estado</span>
                      <p className="text-sm text-bone">Contemplativo y latente.</p>
                   </div>
                </div>
             </section>

             {/* 03. ADN VISUAL */}
             <section className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 text-gold">
                      <span className="font-mono font-bold">03</span>
                   </div>
                   <h3 className="text-2xl font-display text-bone">ADN Visual</h3>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                   <h4 className="text-sm font-medium text-bone border-b border-white/10 pb-2">3.1 Paleta Evolucionada</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                         <div className="h-24 rounded bg-[#0B0A14] border border-white/10 shadow-lg" />
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-bone">Violeta Abisal</span>
                            <span className="text-xs font-mono text-bone/40">#0B0A14</span>
                         </div>
                         <p className="text-xs text-bone/50">Base: Actúa como el vacío. Profundidad púrpura imperceptible.</p>
                      </div>
                      <div className="space-y-2">
                         <div className="h-24 rounded bg-[#C6A86B] shadow-[0_0_20px_rgba(198,168,107,0.2)]" />
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-bone">Oro Orgánico</span>
                            <span className="text-xs font-mono text-bone/40">#C6A86B</span>
                         </div>
                         <p className="text-xs text-bone/50">Acento: Conciencia encarnada. Puntos de luz.</p>
                      </div>
                      <div className="space-y-2">
                         <div className="h-24 rounded bg-[#5B4B8A]" />
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-medium text-bone">Violeta Transm.</span>
                            <span className="text-xs font-mono text-bone/40">#5B4B8A</span>
                         </div>
                         <p className="text-xs text-bone/50">Transmisión: Pulsos visuales activos.</p>
                      </div>
                   </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                   <h4 className="text-sm font-medium text-bone border-b border-white/10 pb-2">3.2 Tipografía</h4>
                   <div className="grid gap-4">
                      <div className="p-4 border border-white/5 bg-white/5 rounded">
                         <p className="font-display uppercase tracking-[0.5em] text-2xl text-bone mb-2">Astrion Music</p>
                         <span className="text-[10px] uppercase font-mono text-gold">Primaria (Display) • Sans-serif Minimalista • Tracking +500</span>
                      </div>
                      <div className="p-4 border border-white/5 bg-white/5 rounded font-mono text-xs text-bone/70">
                         <p className="mb-2">TRNS_001 // FREQUENCY MAP</p>
                         <p>432Hz - REC_DATE: 2024</p>
                         <span className="text-[10px] uppercase text-gold mt-2 block">Técnica (Monospace) • Metadatos</span>
                      </div>
                   </div>
                </div>
             </section>

             {/* 04. EXECUTION */}
             <section className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 text-gold">
                      <span className="font-mono font-bold">04</span>
                   </div>
                   <h3 className="text-2xl font-display text-bone">Manual de Ejecución</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* IG */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gold">
                         <LayoutGrid className="w-5 h-5" />
                         <h4 className="font-medium">Instagram: Curador</h4>
                      </div>
                      <ul className="space-y-3 text-sm text-bone/70 list-disc pl-4">
                         <li><strong className="text-bone">Ritmo 1:2</strong>: 1 Concepto por cada 2 de Aire.</li>
                         <li><strong className="text-bone">Navegación</strong>: Carruseles panorámicos seamless.</li>
                         <li><strong className="text-bone">Sujeto</strong>: Artista en "estado de flujo", siluetas.</li>
                      </ul>
                   </div>

                   {/* YT */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gold">
                         <Video className="w-5 h-5" />
                         <h4 className="font-medium">YouTube: Templo</h4>
                      </div>
                      <div className="space-y-3 text-sm text-bone/70">
                         <p><strong>EON Series</strong>: Iluminación 100% diegética (lámparas sal, tungsteno).</p>
                         <p><strong>Frequency Maps</strong>: Fluidos ferromagnéticos, microscopio. NO audio-reactives genéricos.</p>
                         <div className="bg-black/40 p-3 rounded border border-white/5 mt-2">
                            <span className="text-xs font-mono text-gold block mb-1">REGLA THUMBNAILS</span>
                            <p className="text-xs">80% Textura Abisal + 20% Cuadro Técnico (Sup. Izq).</p>
                            <p className="text-xs mt-1 text-red-400">PROHIBIDO: Caras primer plano, clickbait.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             {/* 05. BIO & HIGHLIGHTS */}
             <section className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 text-gold">
                      <span className="font-mono font-bold">05</span>
                   </div>
                   <h3 className="text-2xl font-display text-bone">Biografía & Accesos</h3>
                </div>

                <div className="bg-white/5 p-6 rounded-lg text-center font-light italic text-bone/80 border border-white/5">
                   "Arquitectura de frecuencias latentes. Cultivando la geometría del sonido."
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                   {[
                      { code: 'EON', label: 'Origen', desc: 'Registros de tiempo profundo', color: 'border-white/10' },
                      { code: 'TRNS', label: 'Transición', desc: 'Evidencias visuales', color: 'border-gold/30' },
                      { code: 'HZ', label: 'Frecuencia', desc: 'Arquitectura continua', color: 'border-white/10' },
                      { code: 'LOG', label: 'Registro', desc: 'Archivo histórico', color: 'border-white/10' },
                      { code: 'TRVL', label: 'Deriva', desc: 'Protocolo humano', color: 'border-white/10' },
                   ].map((item) => (
                      <div key={item.code} className={`p-3 border ${item.color} bg-abyss-panel rounded text-center`}>
                         <div className="text-lg font-display font-medium text-bone mb-1">{item.code}</div>
                         <div className="text-[10px] uppercase font-bold text-gold mb-1">{item.label}</div>
                         <div className="text-[9px] text-bone/50 leading-tight">{item.desc}</div>
                      </div>
                   ))}
                </div>
             </section>

             {/* CONCLUSION */}
             <section className="border-t border-white/10 pt-8 mt-8">
                <h3 className="text-xl font-display text-gold mb-4 text-center">Conclusión de Proyecto</h3>
                <p className="text-center text-bone/70 max-w-2xl mx-auto mb-6">
                   ASTRION es una marca de culto. Cada decisión visual debe reforzar la idea de que el usuario ha sido "invitado" a presenciar algo privado y profundo.
                </p>
                <div className="bg-gold/10 border border-gold/20 p-4 rounded text-center text-gold text-sm font-medium">
                   Regla de Oro: Si una pieza visual parece "agradable para todos", debe ser descartada. Si genera una sensación de misterio, presencia y profundidad silenciosa, es ASTRION.
                </div>
             </section>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

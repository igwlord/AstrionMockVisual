import { useState, useRef } from 'react';
import { useImageSystem } from '../hooks/useImageSystem';
import { Upload, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UploadMatrix() {
  const [activeSection, setActiveSection] = useState<'instagram' | 'youtube' | 'soundcloud'>('instagram');
  const { images, loading, error, uploadImage, refresh } = useImageSystem(activeSection);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       setUploading(true);
       try {
          await uploadImage(file);
       } catch (error) {
          console.error("Upload error", error);
          alert("Error uploading: Check console");
       } finally {
          setUploading(false);
       }
    }
  };

  return (
    <div className="min-h-screen bg-abyss text-bone font-mono p-8 animate-[fadeIn_0.5s_ease-out]">
       
       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONTROL PANEL */}
          <div className="space-y-8">
             <div className="border border-white/10 bg-abyss-panel p-6 rounded-lg">
                <h2 className="text-xl font-display text-gold mb-6 flex items-center gap-2">
                   <Database className="w-5 h-5" /> NODO DE CARGA
                </h2>

                <div className="space-y-4">
                   <label className="text-xs uppercase tracking-widest text-bone/50 block">Destino de Datos</label>
                   <div className="grid grid-cols-1 gap-2">
                      {(['instagram', 'youtube', 'soundcloud'] as const).map(sec => (
                         <button
                           key={sec}
                           onClick={() => setActiveSection(sec)}
                           className={`text-left px-4 py-3 border rounded transition-all text-sm uppercase tracking-wide flex justify-between items-center ${activeSection === sec ? 'border-gold bg-gold/5 text-bone' : 'border-white/5 bg-white/5 text-bone/50 hover:bg-white/10'}`}
                         >
                            {sec}
                            {activeSection === sec && <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                   <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect}
                      accept="image/*"
                   />
                   <button 
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-white/20 hover:border-gold/50 hover:bg-white/5 rounded-lg flex flex-col items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {uploading ? (
                         <RefreshCw className="w-8 h-8 animate-spin text-gold" />
                      ) : (
                         <Upload className="w-8 h-8 text-bone/40 group-hover:text-gold" />
                      )}
                      
                      <span className="text-xs uppercase tracking-widest text-bone/60 group-hover:text-bone">
                         {uploading ? 'Transmitiendo...' : 'Iniciar Carga de Archivo'}
                      </span>
                   </button>
                </div>
             </div>

             {/* SYSTEM LOG */}
             <div className="border border-white/10 bg-black/60 p-4 rounded-lg h-48 overflow-y-auto text-xs font-mono space-y-2">
                <div className="text-emerald-500 flex gap-2">
                   <span>[SYS]</span> <span>System Initialized.</span>
                </div>
                <div className="text-bone/50 flex gap-2">
                   <span>[NET]</span> <span>Connected to node: {activeSection.toUpperCase()}</span>
                </div>
                 {loading && (
                   <div className="text-gold flex gap-2 animate-pulse">
                      <span>[LOAD]</span> <span>Fetching bucket data...</span>
                   </div>
                )}
                {error && (
                   <div className="text-red-500 flex gap-2">
                      <span>[ERR]</span> <span>{error}</span>
                   </div>
                )}
                {!loading && !error && (
                   <div className="text-emerald-500/70 flex gap-2">
                      <span>[OK]</span> <span>Data sync complete. Found {images.length} assets.</span>
                   </div>
                )}
             </div>
          </div>

          {/* VISUAL MATRIX (PREVIEW) */}
          <div className="lg:col-span-2 border border-white/10 bg-abyss-deep rounded-lg p-6 relative min-h-[500px]">
             
             {/* Header */}
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <h3 className="text-sm font-mono uppercase tracking-widest text-bone/50">Visualización de Datos / {activeSection}</h3>
                <button onClick={() => refresh()} className="p-2 hover:bg-white/5 rounded text-bone/50 hover:text-bone">
                   <RefreshCw className="w-4 h-4" />
                </button>
             </div>

             {/* Grid */}
             {loading ? (
                <div className="flex items-center justify-center h-64">
                   <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
             ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-bone/20 gap-4">
                   <AlertCircle className="w-12 h-12" />
                   <p className="upppercase tracking-widest text-xs">No Signal Detected</p>
                </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   <AnimatePresence>
                   {images.map((img) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={img.fullPath} 
                        className="aspect-square bg-black border border-white/10 rounded overflow-hidden relative group"
                      >
                         <img src={img.url} alt={img.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] truncate w-full text-bone/80">{img.name}</span>
                         </div>
                      </motion.div>
                   ))}
                   </AnimatePresence>
                </div>
             )}
          </div>

       </div>
    </div>
  );
}

import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useImageSystem } from '../hooks/useImageSystem';
import { Copy, Check, Download, FileText } from 'lucide-react';
import clsx from 'clsx';
import { SimpleCarousel } from '../components/SimpleCarousel';
import { TRACKS_DATA } from '../data/mockData';

function CopyBlock({ label, text }: { label: string, text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-xs font-mono text-bone/50 uppercase tracking-widest">{label}</label>
        <button 
          onClick={handleCopy}
          className={clsx(
            "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded transition-all",
            copied ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-bone/60 hover:bg-white/10 hover:text-bone"
          )}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'COPIADO' : 'COPIAR TEXTO'}
        </button>
      </div>
      <div className="bg-abyss-panel p-4 rounded-lg border border-white/5 font-mono text-sm text-bone/80 whitespace-pre-wrap leading-relaxed">
        {text}
      </div>
    </div>
  );
}

interface AssetDownloadCardProps {
  title: string;
  type: string;
  size: string;
  imageSrc?: string;
  downloadUrl: string;
  fileName: string;
}

function AssetDownloadCard({ title, type, size, imageSrc, downloadUrl, fileName }: AssetDownloadCardProps) {
  return (
    <div className="group border border-white/5 bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300">
       <div className="aspect-video w-full bg-abyss-deep relative overflow-hidden border-b border-white/5">
          {imageSrc ? (
            <img src={imageSrc} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-bone/20">
               <FileText className="w-8 h-8" />
            </div>
          )}
          
          <a 
            href={downloadUrl} 
            download={fileName}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
             <Download className="w-8 h-8 text-gold" />
          </a>
       </div>
       
       <div className="p-3 flex justify-between items-start">
          <div>
             <h4 className="text-sm font-medium text-bone leading-tight mb-1">{title}</h4>
             <p className="text-[10px] font-mono uppercase text-bone/40 tracking-wider bg-black/20 inline-block px-1.5 py-0.5 rounded">{type} • {size}</p>
          </div>
       </div>
    </div>
  );
}

// ... (keep helper components CopyBlock, AssetDownloadCard)

export function Exports() {
  const toneOfVoice = `Tono: calmado, preciso, selectivo.
Sin emojis.
Sin hype.
Ejemplos:
- "Frequency Session 21. Un nuevo pulso."
- "No es música. Es resonancia."
- "Deep frequencies. Controlled energy."`;

  const bookerStatement = `Astrion es un DJ y live performer especializado en Progressive y Melodic Techno. Su propuesta es un organismo sonoro vivo, diseñado para transportar a la audiencia a través de frecuencias profundas y texturas orgánicas. Lejos del hype comercial, Astrion cultiva el silencio y la precisión.`;

  const { images: instagramImages } = useImageSystem('instagram');
  const { images: youtubeImages } = useImageSystem('youtube');
  const { images: soundcloudImages } = useImageSystem('soundcloud');

  const riderTech = `1x Allen & Heath Xone:96
2x Pioneer CDJ-3000 (Linked)
1x Eventide H9 Max
1x Roland TR-8S
2x Booth Monitors (High Quality)`;

  // Helper to find IG post
  const getIgPost = (index: number) => instagramImages.find(img => img.name === `instagram_post_${index}`);

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] max-w-7xl mx-auto space-y-20 pb-20 px-6">
      <PageHeader 
        title="Exportaciones y Recursos" 
        subtitle="Centro de descarga de activos de marca, guías y recursos visuales." 
      />

      {/* 01. Communications */}
      <section className="space-y-8">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-4">
          01 // Comunicaciones y Textos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <CopyBlock label="Reglas de Tono de Voz" text={toneOfVoice} />
              <CopyBlock label="Resumen de Rider Técnico" text={riderTech} />
           </div>
           <div>
              <CopyBlock label="Statement para Bookers (ES)" text={bookerStatement} />
           </div>
        </div>
      </section>

      {/* 02. Digital Assets Layer */}
      <section className="space-y-12">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-4">
          02 // Activos Digitales y Visuales
        </h2>

        {/* INSTAGRAM SECTION */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-500/20 to-orange-500/20 flex items-center justify-center border border-white/10">
                 <span className="font-display font-bold text-bone">IG</span>
              </div>
              <h3 className="text-lg font-medium text-bone">Instagram System</h3>
           </div>
           
           {/* Profile & Highlights */}
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-1">
                   <h4 className="text-xs uppercase tracking-widest text-bone/40 mb-4">Profile Picture</h4>
                   <AssetDownloadCard 
                       title="Profile Picture (Logo)" 
                       type="PNG" 
                       size="1.8MB" 
                       imageSrc="/images/Logo IG.png"
                       downloadUrl="/images/Logo IG.png"
                       fileName="Astrion_Profile_Logo.png"
                    />
               </div>
               <div className="lg:col-span-3">
                   <h4 className="text-xs uppercase tracking-widest text-bone/40 mb-4">Stories Highlights</h4>
                   <SimpleCarousel>
                        {[1, 2, 3, 4, 5].map(num => (
                            <div key={num} className="min-w-[200px] snap-start">
                                <AssetDownloadCard 
                                    title={`Highlight 0${num}`} 
                                    type="PNG" 
                                    size="~1MB" 
                                    imageSrc={`/images/historia (${num}).png`}
                                    downloadUrl={`/images/historia (${num}).png`}
                                    fileName={`Astrion_Highlight_0${num}.png`}
                                />
                            </div>
                        ))}
                   </SimpleCarousel>
               </div>
           </div>

           {/* Feed Grid (12 Slots) */}
           <div className="pt-8 border-t border-white/5">
                <h4 className="text-xs uppercase tracking-widest text-bone/40 mb-4">Feed Grid (12 Posts)</h4>
                <SimpleCarousel itemWidth={320}>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const img = getIgPost(i);
                        return (
                            <div key={i} className="min-w-[280px] snap-start">
                                {img ? (
                                    <AssetDownloadCard 
                                        title={`IG Post ${i}`} 
                                        type="IMG" 
                                        size="Uploaded" 
                                        imageSrc={img.url}
                                        downloadUrl={img.url} 
                                        fileName={img.name}
                                    />
                                ) : (
                                    <div className="h-full min-h-[200px] border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 bg-white/5 text-bone/20">
                                        <span className="text-2xl font-display">{i}</span>
                                        <span className="text-xs uppercase tracking-wider">Empty Slot</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </SimpleCarousel>
           </div>
        </div>

        {/* YOUTUBE SECTION */}
        <div className="space-y-6 pt-12 border-t border-white/5">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-red-600/20 to-red-900/20 flex items-center justify-center border border-white/10">
                 <span className="font-display font-bold text-bone">YT</span>
              </div>
              <h3 className="text-lg font-medium text-bone">YouTube System</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Channel Banner */}
              <div className="md:col-span-3">
                 <div className="border border-white/5 bg-white/5 rounded-lg overflow-hidden group hover:border-gold/30 transition-colors relative">
                    <img src="/images/banneryoutube.png" className="w-full h-48 md:h-64 object-cover" alt="Banner" />
                    <a 
                      href="/images/banneryoutube.png" 
                      download="Astrion_YouTube_Banner.png"
                      className="absolute bottom-4 right-4 bg-abyss-panel border border-white/10 px-4 py-2 rounded text-sm font-medium text-bone hover:bg-gold hover:text-abyss transition-colors flex items-center gap-2"
                    >
                       <Download className="w-4 h-4" /> Download Banner
                    </a>
                 </div>
              </div>

              {/* Video Covers Carousel */}
              <div className="col-span-full">
                  <h4 className="text-xs uppercase tracking-widest text-bone/40 mb-4">Video Thumbnails</h4>
                   <SimpleCarousel>
                      {youtubeImages.filter(img => img.name.startsWith('youtube_video_')).map((img) => (
                         <div key={img.name} className="min-w-[280px] snap-start">
                             <AssetDownloadCard 
                               title={`Thumbnail: Video ${img.name.replace('youtube_video_', '')}`} 
                               type="IMG" 
                               size="Uploaded" 
                               imageSrc={img.url}
                               downloadUrl={img.url}
                               fileName={img.name}
                             />
                         </div>
                      ))}
                       {youtubeImages.filter(img => img.name.startsWith('youtube_video_')).length === 0 && (
                          <div className="min-w-[300px] py-8 text-center text-bone/40 text-sm border border-dashed border-white/10 rounded">
                              No video thumbnails uploaded yet.
                          </div>
                      )}
                   </SimpleCarousel>
              </div>
           </div>
        </div>

        {/* SOUNDCLOUD SECTION */}
        <div className="space-y-6 pt-12 border-t border-white/5">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-orange-600/20 to-orange-900/20 flex items-center justify-center border border-white/10">
                 <span className="font-display font-bold text-bone">SC</span>
              </div>
              <h3 className="text-lg font-medium text-bone">SoundCloud System</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {/* SC Banner */}
              <div className="md:col-span-4">
                 <div className="border border-white/5 bg-white/5 rounded-lg overflow-hidden group hover:border-gold/30 transition-colors relative">
                    <img src="/images/bannerSoundcloud.png" className="w-full h-48 md:h-64 object-cover" alt="SC Banner" />
                    <a 
                      href="/images/bannerSoundcloud.png" 
                      download="Astrion_SoundCloud_Banner.png"
                      className="absolute bottom-4 right-4 bg-abyss-panel border border-white/10 px-4 py-2 rounded text-sm font-medium text-bone hover:bg-gold hover:text-abyss transition-colors flex items-center gap-2"
                    >
                       <Download className="w-4 h-4" /> Download Banner
                    </a>
                 </div>
              </div>

               {/* Profile Picture */}
               <div className="md:col-span-1">
                  <AssetDownloadCard 
                   title="Profile Picture" 
                   type="PNG" 
                   size="1.8MB" 
                   imageSrc="/images/Logo IG.png"
                   downloadUrl="/images/Logo IG.png"
                   fileName="Astrion_SC_Profile.png"
                 />
               </div>

              {/* Track Covers Carousel */}
              <div className="md:col-span-3">
                  <h4 className="text-xs uppercase tracking-widest text-bone/40 mb-4">Track Covers</h4>

                  <SimpleCarousel>
                     {TRACKS_DATA.map((track, idx) => {
                         // We use the same naming convention as SoundCloud.tsx: soundcloud_track_{index} (0-based)
                         const uploaded = soundcloudImages.find(img => img.name === `soundcloud_track_${idx}`);
                         
                         // Priority: Uploaded > Default
                         const finalSrc = uploaded ? uploaded.url : track.defaultCover;
                         const fileName = uploaded ? uploaded.name : `Astrion_SC_${track.title.replace(/ /g, '_')}_Cover${track.defaultCover.substring(track.defaultCover.lastIndexOf('.'))}`;
                         
                         return (
                             <div key={idx} className="min-w-[200px] snap-start">
                                 <AssetDownloadCard 
                                   title={`Cover: ${track.title}`} 
                                   type="IMG" 
                                   size={uploaded ? "Uploaded" : "Original"} 
                                   imageSrc={finalSrc}
                                   downloadUrl={finalSrc}
                                   fileName={fileName}
                                 />
                             </div>
                         );
                     })}
                  </SimpleCarousel>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

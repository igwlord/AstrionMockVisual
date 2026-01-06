import { PageHeader } from '../components/PageHeader';
import { useImageSystem } from '../hooks/useImageSystem';
import { Download, FileText } from 'lucide-react';
import { SimpleCarousel } from '../components/SimpleCarousel';
import { TRACKS_DATA } from '../data/mockData';



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




  const { images: instagramImages } = useImageSystem('instagram');
  const { images: youtubeImages } = useImageSystem('youtube');
  const { images: soundcloudImages } = useImageSystem('soundcloud');



  // Helper to find IG post
  const getIgPost = (index: number) => instagramImages.find(img => img.name === `instagram_post_${index}`);

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] max-w-7xl mx-auto space-y-20 pb-20 px-6">
      <PageHeader 
        title="Banco de Imagenes" 
        subtitle="Centro de descarga de activos de marca, guías y recursos visuales." 
      />

      {/* 01. Digital Assets Layer */}
      <section className="space-y-12">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-4">
          Activos Digitales y Visuales
        </h2>

        {/* INSTAGRAM SECTION */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-500/20 to-orange-500/20 flex items-center justify-center border border-white/10">
                 <span className="font-display font-bold text-bone">IG</span>
              </div>
              <a href="https://www.instagram.com/astrion.music/" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-bone hover:text-gold transition-colors">Instagram</a>
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
              <a href="https://www.youtube.com/@AstrionDjMusic" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-bone hover:text-gold transition-colors">YouTube</a>
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
              <a href="https://www.soundcloud.com/astrion888" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-bone hover:text-gold transition-colors">SoundCloud</a>
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

import { useState, useRef } from 'react';
import { useImageSystem } from '../hooks/useImageSystem';
import { Plus, Edit2, Loader2 } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  views: string;
  date: string;
  duration: string;
  thumbnailUrl?: string;
  isPlaceholder?: boolean;
}

const placeholderVideos: Video[] = [
  { id: 1, title: 'Astrion - Frequency Session 21 [Live]', views: '124K', date: '2 weeks ago', duration: '1:04:20', isPlaceholder: true },
  { id: 2, title: 'Astrion - Deep Void Signals (Ambient Mix)', views: '45K', date: '1 month ago', duration: '45:00', isPlaceholder: true },
  { id: 3, title: 'Astrion - Frequency Session 20 [Live]', views: '89K', date: '2 months ago', duration: '58:12', isPlaceholder: true },
  { id: 4, title: 'Astrion - Transmutation Process', views: '12K', date: '3 months ago', duration: '08:45', isPlaceholder: true },
  { id: 5, title: 'Astrion - Frequency Session 19', views: '67K', date: '4 months ago', duration: '1:02:30', isPlaceholder: true },
  { id: 6, title: 'Astrion - Organic Core', views: '33K', date: '5 months ago', duration: '12:15', isPlaceholder: true },
];

export function YouTube() {
  const { images, loading, uploadImage } = useImageSystem('youtube');
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<number | null>(null);

  // Mapped Videos: Combine Placeholders with Real Uploads
  const displayVideos: Video[] = placeholderVideos.map((placeholder, idx) => {
      // Find if we have an image for this slot
      const existingImage = images.find(img => img.name === `youtube_video_${idx}`);
      
      if (existingImage) {
          return {
              ...placeholder,
              thumbnailUrl: existingImage.url,
              isPlaceholder: false,
              title: `Uploaded Session ${idx + 1}`
          };
      }
      return placeholder;
  });

  const handleUploadClick = (e: React.MouseEvent, slotIndex: number) => {
      e.stopPropagation();
      activeSlotRef.current = slotIndex;
      fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const slot = activeSlotRef.current;
      if (e.target.files && e.target.files[0] && slot !== null) {
          setUploadingSlot(slot);
          try {
              const file = e.target.files[0];
              await uploadImage(file, `youtube_video_${slot}`);
          } catch (error) {
              console.error("Video thumbnail upload failed", error);
              alert("Error uploading thumbnail.");
          } finally {
              setUploadingSlot(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
          }
      }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      {/* Hidden Global Input */}
      <input 
         type="file" 
         ref={fileInputRef} 
         className="hidden" 
         accept="image/*"
         onChange={handleFileChange}
      />

      {/* Channel Banner */}
      <div className="w-full aspect-[6/1] rounded-xl overflow-hidden mb-6 border border-white/5">
         <img 
           src="/images/banneryoutube.png" 
           alt="Channel Banner" 
           className="w-full h-full object-cover"
         />
      </div>

      {/* Channel Header Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 px-4">
         {/* Avatar */}
         <div className="flex-shrink-0">
             <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-abyss-panel">
                {/* Visual placeholder for avatar based on screenshot - gold geometric */}
                <img src="/images/Logo IG.png" className="w-full h-full object-cover" alt="Avatar" />
             </div>
         </div>

         {/* Info */}
         <div className="flex-1 space-y-3 pt-2">
            <div>
               <h1 className="text-4xl font-display font-medium text-bone mb-1">Astrion Music</h1>
               <div className="text-bone/60 text-sm flex items-center gap-2">
                  <span className="font-medium">@AstrionDjMusic</span>
                  <span>•</span>
                  <span>5 subscribers</span>
                  <span>•</span>
                  <span>{displayVideos.length} videos</span>
               </div>
            </div>
            
            <div className="text-bone/60 text-sm max-w-2xl cursor-pointer hover:text-bone">
               <p className="line-clamp-1">
                  Astrion is a DJ and producer specializing in Progressive House, Melodic Techno, and sets... <span className="font-medium text-bone">more</span>
               </p>
               <a href="#" className="text-gold/80 hover:text-gold mt-1 block font-medium">astrionmusic.netlify.app</a>
            </div>

            <div className="flex gap-3 pt-1">
               <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-bone text-sm font-medium rounded-full transition-colors">
                  Customize channel
               </button>
               <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-bone text-sm font-medium rounded-full transition-colors">
                  Manage videos
               </button>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-white/10 px-4 mb-6 sticky top-0 bg-abyss/95 backdrop-blur z-30">
         {['Videos', 'Playlists', 'Posts'].map((tab, i) => (
            <button key={tab} className={`pb-3 text-sm font-medium border-b-2 uppercase tracking-wide transition-colors ${i === 0 ? 'border-bone text-bone' : 'border-transparent text-bone/60 hover:text-bone'}`}>
               {tab}
            </button>
         ))}
         <button className="pb-3 text-bone/60 hover:text-bone">
             {/* Search icon placeholder */}
             <span className="sr-only">Search</span>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 px-4 mb-8">
         {['Latest', 'Popular', 'Oldest'].map((filter, i) => (
            <button key={filter} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-bone text-abyss' : 'bg-white/10 text-bone hover:bg-white/20'}`}>
               {filter}
            </button>
         ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 px-4 pb-20 relative min-h-[200px]">
          {loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-abyss/50 z-10 pointer-events-none">
                 <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
             </div>
         )}

         {displayVideos.map((video, idx) => (
            <div key={video.id} className="group cursor-pointer flex flex-col gap-3">
               {/* Thumbnail */}
               <div className="aspect-video w-full rounded-xl overflow-hidden relative border border-white/5 bg-abyss-deep">
                  <img 
                    src={video.thumbnailUrl || "/images/coverart Youtube.png"}
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-[10px] font-medium text-white rounded">
                     {video.duration}
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-red-600 w-3/4" /> {/* Progress bar mock */}

                  {/* Edit/Upload Button */}
                  <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={(e) => handleUploadClick(e, idx)}
                       className="p-1.5 bg-black/70 hover:bg-gold text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                       title={video.isPlaceholder ? "Upload Thumbnail" : "Replace Thumbnail"}
                     >
                        {uploadingSlot === idx ? (
                           <Loader2 className="w-3 h-3 animate-spin" />
                        ) : video.isPlaceholder ? (
                           <Plus className="w-3 h-3" />
                        ) : (
                           <Edit2 className="w-3 h-3" />
                        )}
                     </button>
                  </div>
               </div>

               {/* Info */}
               <div className="flex gap-3">
                  <div className="flex-1">
                     <h3 className="text-sm font-medium text-bone leading-tight line-clamp-2 group-hover:text-white mb-1">
                        {video.title}
                     </h3>
                     <div className="text-xs text-bone/60 flex flex-col">
                        <span>{video.views} views • {video.date}</span>
                     </div>
                  </div>
                  <div className="flex-shrink-0 pt-0.5">
                      {/* 3 dots icon */}
                      <div className="w-1 h-1 bg-bone/60 rounded-full mb-1" />
                      <div className="w-1 h-1 bg-bone/60 rounded-full mb-1" />
                      <div className="w-1 h-1 bg-bone/60 rounded-full" />
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}


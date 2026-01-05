interface Video {
  id: number;
  title: string;
  views: string;
  date: string;
  duration: string;
}

const videos: Video[] = [
  { id: 1, title: 'Astrion - Frequency Session 21 [Live]', views: '124K', date: '2 weeks ago', duration: '1:04:20' },
  { id: 2, title: 'Astrion - Deep Void Signals (Ambient Mix)', views: '45K', date: '1 month ago', duration: '45:00' },
  { id: 3, title: 'Astrion - Frequency Session 20 [Live]', views: '89K', date: '2 months ago', duration: '58:12' },
  { id: 4, title: 'Astrion - Transmutation Process', views: '12K', date: '3 months ago', duration: '08:45' },
  { id: 5, title: 'Astrion - Frequency Session 19', views: '67K', date: '4 months ago', duration: '1:02:30' },
  { id: 6, title: 'Astrion - Organic Core', views: '33K', date: '5 months ago', duration: '12:15' },
];

export function YouTube() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
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
                  <span>11 videos</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 px-4 pb-20">
         {videos.map((video) => (
            <div key={video.id} className="group cursor-pointer flex flex-col gap-3">
               {/* Thumbnail */}
               <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                  <img 
                    src="/images/coverart Youtube.png" 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-[10px] font-medium text-white rounded">
                     {video.duration}
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-red-600 w-3/4" /> {/* Progress bar mock */}
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


import { PageHeader } from '../components/PageHeader';

interface Video {
  id: number;
  title: string;
  views: string;
  date: string;
  style: 'RITUAL' | 'PULSE';
}

const videos: Video[] = [
  { id: 1, title: 'Astrion - Frequency Session 21 [Live]', views: '124K views', date: '2 weeks ago', style: 'RITUAL' },
  { id: 2, title: 'Astrion - Deep Void Signals (Ambient Mix)', views: '45K views', date: '1 month ago', style: 'PULSE' },
  { id: 3, title: 'Astrion - Frequency Session 20 [Live]', views: '89K views', date: '2 months ago', style: 'RITUAL' },
  { id: 4, title: 'Astrion - Transmutation Process', views: '12K views', date: '3 months ago', style: 'PULSE' },
  { id: 5, title: 'Astrion - Frequency Session 19', views: '67K views', date: '4 months ago', style: 'RITUAL' },
  { id: 6, title: 'Astrion - Organic Core', views: '33K views', date: '5 months ago', style: 'PULSE' },
];

function VideoThumbnail({ video }: { video: Video }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-video bg-abyss-deep rounded-xl overflow-hidden relative mb-3 border border-white/5 transition-transform duration-300 group-hover:-translate-y-1">
        {/* Thumbnail Visual Generation */}
        {video.style === 'RITUAL' ? (
          <div className="absolute inset-0 bg-abyss flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-nebula/20 via-abyss-deep to-abyss opacity-60" />
             <div className="z-10 text-center">
                <div className="w-12 h-12 rounded-full border border-bone/20 mx-auto mb-2 flex items-center justify-center">
                   <div className="w-1 h-1 bg-gold rounded-full" />
                </div>
                <span className="text-bone/40 text-xs tracking-widest uppercase">Ritual Mode</span>
             </div>
             <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-white">
               1:04:20
             </div>
          </div>
        ) : (
           <div className="absolute inset-0 bg-gradient-to-br from-night to-abyss-deep overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-nebula/30 blur-3xl rounded-full mix-blend-screen" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gold/10 blur-3xl rounded-full mix-blend-screen" />
              <div className="absolute bottom-4 left-4 border-l-2 border-gold pl-3">
                 <span className="text-gold/80 text-xs font-mono uppercase tracking-widest">Pulse</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-white">
               45:00
             </div>
           </div>
        )}
      </div>
      
      <div className="flex gap-3">
         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-abyss to-nebula/40 flex-shrink-0" />
         <div>
            <h3 className="font-medium text-bone leading-tight group-hover:text-white transition-colors">
              {video.title}
            </h3>
            <div className="text-bone/40 text-xs mt-1 space-y-0.5">
               <p>Astrion</p>
               <p>{video.views} • {video.date}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

export function YouTube() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <PageHeader 
        title="YouTube Channel" 
        subtitle="Frequency Sessions and visual narratives." 
      />

      {/* Channel Banner */}
      <div className="w-full h-48 md:h-64 rounded-2xl bg-gradient-to-r from-abyss-deep via-night to-abyss-deep border border-white/5 relative overflow-hidden mb-8 flex items-center justify-center">
         <div className="absolute inset-0 bg-noise opacity-20" />
         <div className="text-center space-y-2 z-10">
            <h1 className="text-4xl md:text-6xl font-display font-medium text-bone tracking-widest uppercase opacity-90 mix-blend-overlay">
               Astrion
            </h1>
            <p className="text-xs font-mono text-gold tracking-[1em] uppercase opacity-60">
               Official Channel
            </p>
         </div>
         {/* Subscribe Button Mock */}
         <div className="absolute bottom-6 right-8">
            <button className="bg-bone text-abyss font-medium px-6 py-2 rounded-full text-sm hover:bg-white transition-colors">
               Subscribe
            </button>
         </div>
      </div>

      {/* Shelf */}
      <div className="mb-8 flex items-center gap-6 overflow-x-auto pb-4 border-b border-white/5 no-scrollbar">
         {['Home', 'Videos', 'Live', 'Playlists', 'Community', 'Channels', 'About'].map((tab, i) => (
            <button key={tab} className={`text-sm font-medium whitespace-nowrap ${i === 0 ? 'text-bone border-b-2 border-bone pb-4 -mb-4.5' : 'text-bone/50 hover:text-bone/80'}`}>
               {tab}
            </button>
         ))}
      </div>

      <div className="space-y-4 mb-6">
         <h2 className="text-xl font-medium text-bone">Latest Releases</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
         {videos.map(video => (
            <VideoThumbnail key={video.id} video={video} />
         ))}
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
            <h3 className="text-gold font-mono text-xs uppercase tracking-widest mb-4">Thumbnail Rules</h3>
            <ul className="space-y-4 text-sm text-bone/60">
               <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5"></span>
                  <p><strong className="text-bone">Ritual Style:</strong> Minimalist. Use heavy negative space. Center alignment. Focus on the geometry.</p>
               </li>
               <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5"></span>
                  <p><strong className="text-bone">Pulse Style:</strong> Abstract gradients. Use Nebula Violet and Night Blue. Off-center composition.</p>
               </li>
            </ul>
         </div>
         <div className="bg-abyss-panel p-6 rounded-xl border border-white/5 flex items-center justify-center">
            <p className="text-bone/30 text-center italic text-sm">
               "The thumbnail is the first frequencies the eye receives. Keep it clean."
            </p>
         </div>
      </div>
    </div>
  );
}

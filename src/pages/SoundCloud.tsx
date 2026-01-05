import { useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Play, Heart, Repeat, MoreHorizontal, Share } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  plays: string;
  duration: string;
  genre: string;
  imageStyle: 'A' | 'B';
  date?: string;
}

const tracks: Track[] = [
  { id: 1, title: 'Astrion - Frequency Session 21 [Live at Void]', plays: '12.4K', duration: '1:04:20', genre: 'Melodic Techno', imageStyle: 'A', date: '2d' },
  { id: 2, title: 'Astrion - Cellular Regeneration (432Hz)', plays: '8.2K', duration: '7:42', genre: 'Ambient', imageStyle: 'B', date: '5d' },
  { id: 3, title: 'Astrion - Dark Matter Transpilation', plays: '15.1K', duration: '6:30', genre: 'Progressive House', imageStyle: 'A', date: '1w' },
  { id: 4, title: 'Astrion - Nebula Signal 004', plays: '5.6K', duration: '8:15', genre: 'Deep Techno', imageStyle: 'B', date: '2w' },
  { id: 5, title: 'Astrion - Silence Between Notes', plays: '9.3K', duration: '5:45', genre: 'Minimal', imageStyle: 'A', date: '1mo' },
];

function Waveform() {
  // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
  const bars = useMemo(() => Array.from({ length: 60 }).map(() => ({
    // eslint-disable-next-line
    height: Math.max(20, Math.random() * 100),
    // eslint-disable-next-line
    opacity: Math.random() > 0.5 ? 0.8 : 0.4 
  })), []);

  return (
    <div className="flex items-end gap-[2px] h-12 w-full opacity-50">
      {bars.map((bar, i) => (
         <div 
           key={i} 
           className="w-1 bg-bone" 
           style={{ 
             height: `${bar.height}%`,
             opacity: bar.opacity
            }} 
          />
      ))}
    </div>
  );
}

function TrackItem({ track }: { track: Track }) {
  return (
    <div className="flex gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors group">
      {/* Cover Art */}
      <div className={`w-32 h-32 flex-shrink-0 rounded shadow-lg overflow-hidden relative ${track.imageStyle === 'A' ? 'bg-abyss' : 'bg-nebula/20'}`}>
         {track.imageStyle === 'A' ? (
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMEIwQTE0Ii8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMiLz4KPC9zdmc+')] opacity-20 flex items-center justify-center">
               <div className="w-8 h-8 rounded-full border border-gold/40" />
            </div>
         ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-night to-nebula flex items-center justify-center">
               <span className="text-[10px] font-mono tracking-widest text-gold/80 mix-blend-overlay">PULSE</span>
            </div>
         )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
         <div className="flex justify-between items-start">
           <div>
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-gold text-abyss flex items-center justify-center pl-1 cursor-pointer hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="text-bone/60 text-xs">Astrion</span>
                  <span className="text-bone font-medium text-sm hover:underline cursor-pointer">{track.title}</span>
                </div>
             </div>
           </div>
           <div className="text-xs text-bone/40">{track.date || '2d'}</div>
         </div>

         {/* Waveform */}
         <div className="my-2">
            <Waveform />
         </div>

         {/* Actions */}
         <div className="flex justify-between items-center text-xs text-bone/60">
            <div className="flex gap-4">
              <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Heart className="w-3 h-3" /> {track.plays}</span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Repeat className="w-3 h-3" /> 142</span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Share className="w-3 h-3" /> Share</span>
              <span className="flex items-center gap-1 hover:text-white cursor-pointer"><MoreHorizontal className="w-3 h-3" /> More</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-bone/30">{track.plays} plays</span>
               <span className="bg-white/5 px-2 py-0.5 rounded-full border border-white/5 hover:border-white/20 cursor-pointer transition-colors">#{track.genre}</span>
            </div>
         </div>
      </div>
    </div>
  );
}

export function SoundCloud() {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <PageHeader 
        title="SoundCloud Profile" 
        subtitle="Pure audio signal distribution." 
      />

      {/* SC Header */}
      <div className="relative h-64 bg-gradient-to-br from-neutral-900 to-stone-900 border-b border-white/5 mb-8 group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614726365723-49cfaaaa5c86?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale mix-blend-overlay" />
          <div className="absolute top-8 left-8 flex gap-6 items-end">
            <div className="w-40 h-40 rounded-full bg-abyss shadow-2xl border-4 border-abyss-deep flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <span className="font-display font-bold text-4xl text-bone z-10">A</span>
            </div>
            <div className="mb-4 space-y-2 bg-black/40 p-4 rounded backdrop-blur-sm">
               <span className="bg-black/60 text-white px-2 py-0.5 text-xs uppercase tracking-wider font-medium inline-block mb-1">CABA, AR</span>
               <h1 className="text-3xl font-medium bg-black/60 inline-block px-2 text-white">Astrion</h1>
               <h2 className="text-white/80 bg-black/60 inline-block px-2 text-lg">DJ & Producer</h2>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
           {/* Spotlight */}
           <div className="border-b border-white/5 pb-2 mb-4">
              <h3 className="text-lg font-medium text-bone">Spotlight</h3>
           </div>
           <div>
              <TrackItem track={tracks[0]} />
           </div>

           {/* Recent */}
           <div className="border-b border-white/5 pb-2 mb-4 mt-8">
              <h3 className="text-lg font-medium text-bone">Recent</h3>
           </div>
           <div className="space-y-4">
              {tracks.slice(1).map(track => (
                 <TrackItem key={track.id} track={track} />
              ))}
           </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="p-4 border border-x-0 border-y-white/5 space-y-4">
              <div className="flex justify-between text-xs text-bone/50 uppercase tracking-widest">
                 <span>Followers</span>
                 <span className="text-bone">18.5K</span>
              </div>
              <div className="flex justify-between text-xs text-bone/50 uppercase tracking-widest">
                 <span>Following</span>
                 <span className="text-bone">42</span>
              </div>
              <div className="flex justify-between text-xs text-bone/50 uppercase tracking-widest">
                 <span>Tracks</span>
                 <span className="text-bone">86</span>
              </div>
           </div>

           <div className="space-y-4">
             <h4 className="text-sm font-medium text-bone/60 uppercase">Cover Art Templates</h4>
             <div className="bg-abyss-panel p-4 rounded border border-white/5 space-y-4">
               <div>
                 <span className="block text-xs font-bold text-bone mb-1">Style A: Abyss Field</span>
                 <p className="text-[10px] text-bone/50">Dark noise background, subtle gradient, centered Gold Mark.</p>
               </div>
               <div>
                 <span className="block text-xs font-bold text-bone mb-1">Style B: Violet Pulse</span>
                 <p className="text-[10px] text-bone/50">Rich violet/nebula gradient. Minimal typography overlays.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

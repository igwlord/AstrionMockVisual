import { useMemo, useState } from 'react';
import { Play, Heart, MoreHorizontal, RefreshCw, BarChart2, Radio, Pencil, Share2, Link as LinkIcon, Star, Trash, Plus } from 'lucide-react';
import { useImageSystem } from '../hooks/useImageSystem';
import { EditableText } from '../components/EditableText';
import { SoundCloudMockModal } from '../components/SoundCloudMockModal';
import type { SoundCloudMockData } from '../components/SoundCloudMockModal';

// Initial Data for fresh load
import { TRACKS_DATA } from '../data/mockData';

function Waveform() {
  // eslint-disable-next-line
  const bars = useMemo(() => Array.from({ length: 60 }).map(() => Math.max(20, (Math.random() * 100))), []);

  return (
    <div className="flex items-end gap-[2px] h-12 w-full opacity-60">
      {bars.map((height, i) => (
        <div 
          key={i} 
          className="w-full bg-bone hover:bg-gold transition-colors"
          style={{ height: `${height}%` }} 
        />
      ))}
    </div>
  );
}

interface TrackItemProps {
    track: SoundCloudMockData;
    index: number;
    onClick: (track: SoundCloudMockData) => void;
    onDelete: (id: string, fileName?: string) => void;
}

function TrackItem({ track, onClick, onDelete }: TrackItemProps) {
  return (
    <div 
       className="flex gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors group relative cursor-pointer"
       onClick={() => onClick(track)}
    >
      {/* Cover Art */}
      <div className="w-40 h-40 flex-shrink-0 bg-abyss-deep rounded shadow-lg overflow-hidden relative group/cover">
          <img src={track.coverImage} className="w-full h-full object-cover" alt={track.title} />
          
          {/* Play Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity z-10"
            onClick={(e) => {
               e.stopPropagation();
               window.open(track.soundCloudUrl, '_blank');
            }}
          >
             <div className="w-12 h-12 rounded-full bg-gold text-abyss flex items-center justify-center hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
             </div>
          </div>

          {/* Delete Overlay */}
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/cover:opacity-100 transition-opacity">
              <button 
                 onClick={(e) => { e.stopPropagation(); onDelete(track.id, track.fileName); }}
                 className="p-1.5 bg-black/70 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                 title="Remove Mock"
              >
                 <Trash className="w-3 h-3"/>
              </button>
          </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
         <div className="flex justify-between items-start">
           <div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold text-abyss flex items-center justify-center pl-1 hover:scale-105 transition-transform lg:hidden">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="text-bone/60 text-xs mb-1">{track.artist}</span>
                  <span className="text-bone font-medium text-base hover:text-white truncate">{track.title}</span>
                </div>
             </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-bone/40">{track.timeAgo}</span>
              <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] text-bone/60 border border-white/5">
                 {track.genre}
              </span>
           </div>
         </div>

         {/* Waveform */}
         <div className="my-2 py-2">
            <Waveform />
         </div>

         {/* Actions */}
         <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-2">
               {[Heart, RefreshCw, Share2, LinkIcon, MoreHorizontal].map((Icon, i) => (
                  <button key={i} className="px-2 py-1 text-bone/60 hover:text-white border border-white/10 rounded-sm text-xs flex items-center gap-1 transition-colors hover:bg-white/5">
                     <Icon className="w-3 h-3" /> {i === 0 ? 'Like' : i === 1 ? 'Repost' : i === 2 ? 'Share' : i === 3 ? 'Copy Link' : 'More'}
                  </button>
               ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-bone/40">
               <span className="flex items-center gap-1"><Play className="w-3 h-3" /> 1K</span>
               <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> 45</span>
               <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 12</span>
            </div>
         </div>
      </div>
    </div>
  );
}

export function SoundCloud() {
  const { deleteImage } = useImageSystem('soundcloud');
  const [selectedMock, setSelectedMock] = useState<SoundCloudMockData | null>(null);

  // Lazy initialize mocks
  const [mocks, setMocks] = useState<SoundCloudMockData[]>(() => {
    const saved = localStorage.getItem('sc_mocks');
    if (saved) {
        return JSON.parse(saved);
    } 
    // Defaults
    return TRACKS_DATA.map((t, i) => ({
        id: `default_${i}`,
        title: t.title,
        artist: t.artist,
        coverImage: t.defaultCover || '',
        soundCloudUrl: 'https://soundcloud.com/astrion888',
        duration: t.duration,
        timeAgo: t.timeAgo,
        genre: t.genre,
        description: "Astrion is a DJ and producer specializing in Progressive House, Melodic Techno, and sets with a strong sonic identity. I combine musical design, energy, and technology to create immersive experiences in clubs, festivals, and private events."
    }));
  });

  const saveMocks = (newMocks: SoundCloudMockData[]) => {
      setMocks(newMocks);
      localStorage.setItem('sc_mocks', JSON.stringify(newMocks));
  };

  const handleCreateMock = () => {
      const template = mocks.length > 0 ? mocks[0] : {
          id: 'temp',
          title: 'New Frequency Session',
          artist: 'Astrion',
          coverImage: '/images/cover (1).jpg',
          soundCloudUrl: 'https://soundcloud.com/astrion888',
          duration: '1:00:00',
          timeAgo: 'Just now',
          genre: 'Progressive House'
      };

      const newMock: SoundCloudMockData = {
          ...template,
          id: `custom_${Date.now()}`,
          title: 'New Untitled Session ' + (mocks.length + 1),
          timeAgo: 'Just now',
          fileName: undefined // Don't copy filename associated with another ID
      };

      const updated = [newMock, ...mocks];
      saveMocks(updated);
  };

  const handleDeleteMock = async (id: string, fileName?: string) => {
      if (window.confirm("Delete this visual mock?")) {
         if (fileName) {
             await deleteImage(fileName);
         }
         const updated = mocks.filter(m => m.id !== id);
         saveMocks(updated);
      }
  };

  const handleUpdateMock = (updated: SoundCloudMockData) => {
      const newMocks = mocks.map(m => m.id === updated.id ? updated : m);
      saveMocks(newMocks);
      // Keep selected mock safely updated
      setSelectedMock(updated); 
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] min-h-screen text-bone font-sans pb-20">
      
      {/* HEADER SECTION */}
      <div className="relative mb-8 bg-abyss-panel group">
         {/* Banner */}
         <div className="h-[260px] w-full bg-abyss-deep relative overflow-hidden">
             <img src="/images/bannerSoundcloud.png" className="w-full h-full object-cover" alt="SoundCloud Banner" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
         </div>

         {/* Profile Info Overlay */}
         <div className="absolute top-8 left-8 flex gap-6 items-start z-10">
             {/* Avatar */}
             <div className="w-48 h-48 rounded-full border-4 border-abyss-panel bg-abyss shadow-2xl overflow-hidden relative">
                 <img src="/images/Logo IG.png" className="w-full h-full object-cover" alt="Avatar" />
             </div>
             
             {/* Text Info */}
             <div className="mt-8">
                 <h1 className="text-3xl font-display bg-black/80 px-2 py-1 inline-block text-white mb-2 shadow-lg">
                    <EditableText storageKey="sc_display_name" defaultText="Astrion" />
                 </h1>
                 <br/>
                 <h2 className="text-sm text-white/80 bg-black/60 px-2 py-0.5 inline-block mb-3 font-medium text-bone/80">
                    <EditableText storageKey="sc_full_name" defaultText="Guido Di Pietro" />
                 </h2>
                 <br/>
                 <div className="text-xs text-white/60 mb-2 inline-block bg-black/60 px-2 py-0.5">
                    <EditableText storageKey="sc_location" defaultText="Buenos Aires, Argentina" />
                 </div>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="bg-gold text-abyss text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                       <Star className="w-2 h-2 fill-abyss" /> Artist Pro
                    </div>
                 </div>
             </div>
         </div>
      </div>

      {/* NAV BAR */}
      <div className="border-b border-white/10 px-6 py-0 flex justify-between items-center bg-abyss-panel mb-8 sticky top-0 z-30">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
             {['All', 'Popular tracks', 'Tracks', 'Albums', 'Playlists', 'Reposts'].map((tab, i) => (
                 <button key={tab} className={`text-sm font-medium py-4 border-b-2 transition-colors whitespace-nowrap ${i === 2 ? 'text-gold border-gold' : 'text-bone/60 border-transparent hover:text-bone'}`}>
                    {tab}
                 </button>
             ))}
          </div>
          <div className="hidden md:flex gap-3 py-3">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs hover:bg-white/10 transition-colors">
                <BarChart2 className="w-3 h-3" /> <span className="hidden lg:inline">Your Insights</span>
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs hover:bg-white/10 transition-colors">
                <Radio className="w-3 h-3" /> Station
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs hover:bg-white/10 transition-colors">
                <Share2 className="w-3 h-3" /> Share
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs hover:bg-white/10 transition-colors">
                <Pencil className="w-3 h-3" /> Edit
             </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COL: Feed */}
          <div className="lg:col-span-3 space-y-8">
             {/* Spotlight Header */}
             <div className="flex justify-between items-end border-b border-white/5 pb-2">
                 <h3 className="text-lg font-medium text-bone">Spotlight (0/5)</h3>
                 <button className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10">Edit Spotlight</button>
             </div>
             
             <div className="py-4 text-center border border-dashed border-white/10 rounded-lg">
                 <p className="text-sm text-bone/40">Spotlight 5 tracks or playlists at the top of your profile to get them more plays.</p>
             </div>

             {/* Recent Header */}
             <div className="flex justify-between items-end border-b border-white/5 pb-2 mt-8">
                 <div className="flex items-center gap-4">
                     <h3 className="text-xl font-medium text-bone">Recent Visual Mocks</h3>
                     <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">PREVIEW SYSTEM</span>
                 </div>
                 
                 <button 
                   onClick={handleCreateMock}
                   className="flex items-center gap-2 px-3 py-1.5 bg-gold text-abyss rounded text-sm font-semibold hover:bg-white transition-colors"
                 >
                    <Plus className="w-4 h-4" /> Create Mock
                 </button>
             </div>

             {/* Tracks List */}
             <div className="space-y-6">
                 {mocks.length === 0 && (
                     <div className="text-center py-12 border border-dashed border-white/10 rounded bg-white/5 text-bone/40">
                         No mocks created yet. Click "Create Mock" to start.
                     </div>
                 )}
                 {mocks.map((track, i) => (
                    <TrackItem 
                       key={track.id} 
                       track={track} 
                       index={i}
                       onClick={setSelectedMock}
                       onDelete={handleDeleteMock}
                    />
                 ))}
             </div>
          </div>

          {/* RIGHT COL: Sidebar */}
          <div className="lg:col-span-1 space-y-8 pl-0 lg:pl-4 lg:border-l border-white/5">
              {/* Stats Row */}
              <div className="flex justify-between text-bone/60 text-xs border-b border-white/5 pb-4">
                  <div className="w-1/3 pr-2 group cursor-pointer hover:text-white">
                     <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">Followers</span>
                     <span className="text-xl font-display text-white group-hover:text-gold block">14</span>
                  </div>
                  <div className="w-1/3 px-2 border-l border-white/5 group cursor-pointer hover:text-white">
                     <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">Following</span>
                     <span className="text-xl font-display text-white group-hover:text-gold block">33</span>
                  </div>
                  <div className="w-1/3 pl-2 border-l border-white/5 group cursor-pointer hover:text-white">
                     <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">Tracks</span>
                     <span className="text-xl font-display text-white group-hover:text-gold block">19</span>
                  </div>
              </div>

              {/* Bio */}
              <div className="text-sm text-bone/80 space-y-2 leading-relaxed">
                 <div className="line-clamp-4">
                    <EditableText 
                        storageKey="sc_bio" 
                        defaultText="Cada set está pensado para elevar tu vibración. Desde la profundidad, mi música busca abrir armonizar la energía, expandir la conciencia y llevarlos por un viaje inolvidable." 
                        multiline 
                    />
                 </div>
                 <button className="text-bone/60 text-xs font-semibold hover:text-white transition-colors">Show more</button>
              </div>

              {/* Likes Mock */}
              <div>
                 <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                    <span className="text-xs uppercase tracking-wider text-bone/60 font-medium">12 Likes</span>
                    <span className="text-xs text-bone/40 hover:text-white cursor-pointer">View all</span>
                 </div>
                 <div className="space-y-3">
                    {/* Like Item Mock 1 */}
                    <div className="flex gap-3 items-center group cursor-pointer">
                       <div className="w-12 h-12 bg-abyss-deep rounded overflow-hidden flex-shrink-0">
                           {/* Using one of the provided covres for mock like */}
                          <img src="/images/cover (3).jpg" className="w-full h-full object-cover" alt="Like 1" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs text-bone/60 truncate">Astrion</p>
                          <p className="text-sm text-bone group-hover:text-gold truncate font-medium">Frequency Sessions 12</p>
                          <div className="flex gap-3 text-[10px] text-bone/30 mt-0.5">
                             <span className="flex items-center gap-1"><Play className="w-2 h-2" /> 1K</span>
                             <span className="flex items-center gap-1"><Heart className="w-2 h-2" /> 45</span>
                          </div>
                       </div>
                    </div>
                    
                     {/* Like Item Mock 2 */}
                     <div className="flex gap-3 items-center group cursor-pointer">
                       <div className="w-12 h-12 bg-abyss-deep rounded overflow-hidden flex-shrink-0">
                           <img src="/images/cover (2).jpg" className="w-full h-full object-cover" alt="Like 2" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs text-bone/60 truncate">Flower of Bass</p>
                          <p className="text-sm text-bone group-hover:text-gold truncate font-medium">Frequency Sessions 10</p>
                          <div className="flex gap-3 text-[10px] text-bone/30 mt-0.5">
                             <span className="flex items-center gap-1"><Play className="w-2 h-2" /> 500</span>
                             <span className="flex items-center gap-1"><Heart className="w-2 h-2" /> 22</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Tour */}
              <div>
                 <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                    <Radio className="w-3 h-3 text-bone" />
                    <span className="text-xs uppercase tracking-wider text-bone/60 font-medium">On Tour</span>
                    <span className="ml-auto text-bone/40 hover:text-white cursor-pointer"><MoreHorizontal className="w-3 h-3" /></span>
                 </div>
                 <div className="bg-abyss-panel/50 p-4 rounded text-center space-y-3 border border-white/5">
                    <p className="text-xs text-bone/60">As an Artist Pro subscriber, you can create ticketed live events on SoundCloud.</p>
                    <button className="w-full bg-bone text-abyss font-medium py-2 rounded text-sm hover:bg-white transition-colors">
                       Add Events
                    </button>
                 </div>
              </div>
          </div>
      </div>

      <SoundCloudMockModal 
          isOpen={!!selectedMock}
          onClose={() => setSelectedMock(null)}
          mockData={selectedMock}
          onUpdate={handleUpdateMock}
          onDelete={() => {
              if (selectedMock) {
                  handleDeleteMock(selectedMock.id, selectedMock.fileName);
                  setSelectedMock(null);
              }
          }}
      />
    </div>
  );
}

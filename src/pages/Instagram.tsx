import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Grid, Heart, MessageCircle, Share2, X, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PostType = 'PULSE' | 'RITUAL' | 'SIGNAL';

interface Post {
  id: number;
  type: PostType;
  title: string;
  likes: number;
  caption: string;
}

// Generate 12 posts with 3-layer cycle
const posts: Post[] = Array.from({ length: 12 }).map((_, i) => {
  const typeCycle: PostType[] = ['PULSE', 'RITUAL', 'SIGNAL'];
  const type = typeCycle[i % 3];
  
  return {
    id: i + 1,
    type,
    title: `Frequency ${i + 14}`,
    likes: 800 + i * 42,
    caption: `Cycle ${i + 1}. The resonant field expands. \n\n#astrion #frequency #techno`
  };
});

function PostVisual({ type, index }: { type: PostType, index: number }) {
  if (type === 'PULSE') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-abyss-deep to-nebula/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-nebula/30 blur-2xl animate-pulse-slow" />
        </div>
      </div>
    );
  }
  
  if (type === 'RITUAL') {
    return (
      <div className="w-full h-full bg-abyss relative group overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
         <div className="absolute inset-0 flex items-end p-4">
            <span className="text-bone/20 text-xs font-mono tracking-widest uppercase">Ritual // {index}</span>
         </div>
      </div>
    );
  }
  
  // SIGNAL
  return (
    <div className="w-full h-full bg-white/5 border border-white/5 flex items-center justify-center relative group">
      <div className="text-center space-y-1">
        <span className="block text-4xl font-display font-medium text-bone/90 tracking-tighter">
          {new Date().getDate() + index}
        </span>
        <span className="block text-xs font-mono text-gold uppercase tracking-widest">
          OCT
        </span>
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />
    </div>
  );
}

export function Instagram() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <PageHeader 
        title="Instagram Feed" 
        subtitle="The 21-day cycle visual grid." 
      />

      {/* Grid Stats Mock */}
      <div className="flex gap-8 mb-12 border-b border-white/5 pb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-abyss to-nebula/30 p-1">
          <div className="w-full h-full rounded-full bg-abyss-panel flex items-center justify-center border border-white/10">
            <span className="font-display font-bold text-xl">A</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-4">
           <div className="flex items-center gap-6">
             <h2 className="text-xl font-medium">astrion.official</h2>
             <button className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
               Edit Profile
             </button>
           </div>
           <div className="flex gap-8 text-sm">
             <span><strong className="text-bone">21</strong> posts</span>
             <span><strong className="text-bone">12.5k</strong> followers</span>
             <span><strong className="text-bone">42</strong> following</span>
           </div>
           <div className="text-sm text-bone/80 max-w-md">
             <p>Organismo sonoro · Frecuencia contenida</p>
             <p className="font-mono text-xs text-gold/80 mt-1">linktr.ee/astrion</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-12 border-t border-white/5 mb-8">
        <button className="flex items-center gap-2 py-4 border-t border-bone text-bone text-xs font-medium uppercase tracking-wider">
          <Grid className="w-4 h-4" /> Posts
        </button>
        <button className="flex items-center gap-2 py-4 border-t border-transparent text-bone/40 text-xs font-medium uppercase tracking-wider hover:text-bone/70">
          <Bookmark className="w-4 h-4" /> Saved
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post, idx) => (
          <motion.div 
            key={post.id}
            layoutId={`post-${post.id}`}
            onClick={() => setSelectedPost(post)}
            className="aspect-square cursor-pointer relative group overflow-hidden bg-abyss-deep"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <PostVisual type={post.type} index={idx} />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-bone">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                <span className="font-bold">{post.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span className="font-bold">{idx * 3 + 4}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div 
              layoutId={`post-${selectedPost.id}`}
              className="relative w-full max-w-5xl h-[80vh] bg-abyss-panel rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 z-10"
            >
              <div className="w-full md:w-[60%] h-1/2 md:h-full bg-abyss-deep">
                 <PostVisual type={selectedPost.type} index={selectedPost.id} />
              </div>
              
              <div className="w-full md:w-[40%] flex flex-col h-1/2 md:h-full bg-abyss-panel border-l border-white/5">
                 <div className="p-4 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-abyss to-nebula/30" />
                     <span className="font-medium text-sm">astrion.official</span>
                   </div>
                   <button onClick={() => setSelectedPost(null)} className="text-bone/50 hover:text-white">
                      <X className="w-5 h-5" />
                   </button>
                 </div>

                 <div className="flex-1 p-4 overflow-y-auto">
                   <div className="space-y-4">
                     <div className="text-sm">
                       <span className="font-medium mr-2">astrion.official</span>
                       <span className="text-bone/80 whitespace-pre-wrap">{selectedPost.caption}</span>
                     </div>
                     {/* Fake comments */}
                     <div className="space-y-2 mt-4">
                       <p className="text-xs text-bone/50"><span className="font-medium text-bone/70 mr-2">user_01</span>Incredible atmosphere.</p>
                       <p className="text-xs text-bone/50"><span className="font-medium text-bone/70 mr-2">depth_seeker</span>Resonance.</p>
                     </div>
                   </div>
                 </div>

                 <div className="p-4 border-t border-white/5 space-y-4">
                   <div className="flex justify-between items-center text-bone">
                      <div className="flex gap-4">
                        <Heart className="w-6 h-6 hover:text-white/50 cursor-pointer" />
                        <MessageCircle className="w-6 h-6 hover:text-white/50 cursor-pointer" />
                        <Share2 className="w-6 h-6 hover:text-white/50 cursor-pointer" />
                      </div>
                      <Bookmark className="w-6 h-6 hover:text-white/50 cursor-pointer" />
                   </div>
                   <div className="text-sm font-medium">{selectedPost.likes} likes</div>
                   <div className="text-[10px] uppercase text-bone/40">2 days ago</div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

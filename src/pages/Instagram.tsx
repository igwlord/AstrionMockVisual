import { useState, useRef } from 'react';
import { Grid, Heart, MessageCircle, Share2, X, Bookmark, Plus, Edit2, Loader2, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '../components/EditableText';

import { useImageSystem } from '../hooks/useImageSystem';

type PostType = 'PULSE' | 'RITUAL' | 'SIGNAL';

interface Post {
  id: number;
  type: PostType;
  title: string;
  likes: number;
  caption: string;
  imageUrl?: string;
  isPlaceholder?: boolean; // Flag to know if it's a real upload or a filler
  fileName?: string; // Add filename to reference for deletion
}

// Generate 12 placeholder posts
const placeholderPosts: Post[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    type: ['PULSE', 'RITUAL', 'SIGNAL'][i % 3] as PostType,
    title: `Frequency ${i + 14}`,
    likes: 800 + i * 42,
    caption: `Cycle ${i + 1}. The resonant field expands. \n\n#astrion #frequency #techno`,
    isPlaceholder: true
}));

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
  const { images, loading, uploadImage, deleteImage } = useImageSystem('instagram');
  const [uploadingSlot, setUploadingSlot] = useState<number | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlotRef = useRef<number | string | null>(null);

  // Mapped Grid: Combine Placeholders with Real Uploads
  // We expect files named "instagram_post_0", "instagram_post_1", etc.
  const displayPosts: Post[] = placeholderPosts.map((placeholder, idx) => {
      // Find if we have an image for this slot
      const existingImage = images.find(img => img.name === `instagram_post_${idx}`);
      
      if (existingImage) {
          return {
              ...placeholder,
              imageUrl: existingImage.url,
              isPlaceholder: false,
              caption: `Uploaded Content // Slot ${idx}`,
              fileName: existingImage.name
          };
      }
      return placeholder;
  });

  const handleUploadClick = (e: React.MouseEvent, slotIndex: number | string) => {
      e.stopPropagation(); // Prevent opening modal
      activeSlotRef.current = slotIndex;
      fileInputRef.current?.click();
  };

  const handleDeleteClick = async (e: React.MouseEvent, fileName: string) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this image?")) {
          await deleteImage(fileName);
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const slot = activeSlotRef.current;
      if (e.target.files && e.target.files[0] && slot !== null) {
          setUploadingSlot(slot);
          try {
              const file = e.target.files[0];
              // Determine filename based on slot type and upload
              await uploadImage(file, typeof slot === 'number' ? `instagram_post_${slot}` : `instagram_${slot}`);
          } catch (error) {
              console.error("Grid upload failed", error);
              alert("Error uploading to grid.");
          } finally {
              setUploadingSlot(null);
              // Reset input
              if (fileInputRef.current) fileInputRef.current.value = '';
          }
      }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Hidden Global Input */}
      <input 
         type="file" 
         ref={fileInputRef} 
         className="hidden" 
         accept="image/*"
         onChange={handleFileChange}
      />


      {/* ... Header ... */}
      <div className="flex flex-col gap-4 pt-4">
           {/* Profile Header */}
           <div className="flex items-center gap-8 md:gap-12 pl-4 md:pl-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 bg-gradient-to-br from-abyss-deep to-abyss p-1">
                 <div className="w-full h-full rounded-full bg-abyss flex items-center justify-center border border-white/5 overflow-hidden">
                    <img src="/images/Logo IG.png" alt="Astrion Logo" className="w-full h-full object-cover" />
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <h2 className="text-xl font-medium text-bone">
                        <EditableText storageKey="ig_username" defaultText="astrion.official" />
                    </h2>
                 </div>
                 
                 <div className="flex items-center gap-8 text-sm">
                    <span><span className="font-bold text-bone">12</span> <span className="text-bone/60">posts</span></span>
                    <span><span className="font-bold text-bone">12.5k</span> <span className="text-bone/60">followers</span></span>
                    <span><span className="font-bold text-bone">42</span> <span className="text-bone/60">following</span></span>
                 </div>
                 
                 <div>
                    <div className="text-sm font-medium text-bone/90 mb-1">
                        <EditableText storageKey="ig_bio" defaultText="Organismo sonoro · Frecuencia contenida" multiline />
                    </div>
                    <div className="text-sm text-bone/50">
                        <EditableText storageKey="ig_link" defaultText="linktr.ee/astrion" link className="text-bone/50 hover:text-gold" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Highlighted Stories (Historias Destacadas) */}
           <div className="flex gap-6 md:gap-8 px-4 md:pl-8 py-6 overflow-x-auto no-scrollbar">
               {[
                   { id: 'EON', img: '/images/historia (1).png' },
                   { id: 'TRNS', img: '/images/historia (2).png' },
                   { id: 'HZ', img: '/images/historia (3).png' },
                   { id: 'LOG', img: '/images/historia (4).png' },
                   { id: 'TRVL', img: '/images/historia (5).png' },
               ].map((highlight) => {
                   // Check for uploaded override
                   const override = images.find(img => img.name === `instagram_highlight_${highlight.id}`);
                   const displayImage = override ? override.url : highlight.img;
                   const isUploading = uploadingSlot === `highlight_${highlight.id}`; // Type assertion for shared state

                   return (
                       <div key={highlight.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={(e) => {
                           e.stopPropagation();
                           activeSlotRef.current = `highlight_${highlight.id}`;
                           fileInputRef.current?.click();
                       }}>
                         <div className="w-16 h-16 rounded-full border border-white/5 bg-abyss flex items-center justify-center relative overflow-hidden group-hover:border-gold/30 transition-colors p-0.5">
                            <img src={displayImage} alt={highlight.id} className="w-full h-full rounded-full object-cover" />
                            
                            {/* Edit Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : <Edit2 className="w-4 h-4 text-white" />}
                            </div>
                         </div>
                         <span className="text-[10px] font-mono tracking-widest text-bone/50 uppercase group-hover:text-bone/80 transition-colors">{highlight.id}</span>
                       </div>
                   );
               })}
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
       <div className="grid grid-cols-3 gap-1 md:gap-4 relative min-h-[300px]">
         {loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-abyss/50 z-10 pointer-events-none">
                 <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
             </div>
         )}
         
         {displayPosts.map((post, idx) => (
           <motion.div 
             key={post.id}
             layoutId={`post-${post.id}`}
             onClick={() => setSelectedPost(post)}
             className="aspect-square cursor-pointer relative group overflow-hidden bg-abyss-deep"
             whileHover={{ scale: 0.98 }}
             transition={{ duration: 0.2 }}
           >
             {/* Main Visual */}
             {post.imageUrl ? (
                 <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
             ) : (
                 <PostVisual type={post.type} index={idx} />
             )}

             {/* Interact Overlay (Edit/Upload/Delete) */}
             <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <button 
                  onClick={(e) => handleUploadClick(e, idx)} 
                  className="p-2 bg-black/50 hover:bg-gold text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                  title={post.isPlaceholder ? "Upload Image" : "Replace Image"}
                >
                   {uploadingSlot === idx ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                   ) : post.isPlaceholder ? (
                      <Plus className="w-4 h-4" />
                   ) : (
                      <Edit2 className="w-4 h-4" />
                   )}
                </button>
                
                {/* Delete Button (Only for uploaded images) */}
                {!post.isPlaceholder && post.fileName && (
                    <button 
                      onClick={(e) => handleDeleteClick(e, post.fileName!)}
                      className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                      title="Remove Image"
                    >
                       <Trash className="w-4 h-4" />
                    </button>
                )}
             </div>
             
             {/* Hover info overlay */}
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-bone pointer-events-none">
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
            {/* Modal Overlay / Backdrop */}
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
                 {selectedPost.imageUrl ? (
                    <img src={selectedPost.imageUrl} className="w-full h-full object-cover" />
                 ) : (
                    <PostVisual type={selectedPost.type} index={selectedPost.id} />
                 )}
              </div>
              
              <div className="w-full md:w-[40%] flex flex-col h-1/2 md:h-full bg-abyss-panel border-l border-white/5">
                 {/* ... Modal Sidebar Content ... */}
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

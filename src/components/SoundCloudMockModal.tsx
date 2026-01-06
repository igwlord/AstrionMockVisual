import { 
  X, Play, Heart, MessageCircle, RefreshCw, Link as LinkIcon, 
  MoreHorizontal, Pencil, Upload, User, Search, Bell, Mail, Trash 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageSystem } from '../hooks/useImageSystem';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

function WaveformBars() {
  const [bars] = useState(() => Array.from({ length: 120 }).map(() => Math.max(20, (Math.random() * 100))));
  
  return (
    <>
      {bars.map((height, i) => (
        <div 
           key={i} 
           className="flex-1 bg-white" 
           style={{height: `${height}%`}}
        />
      ))}
    </>
  );
}

// Interface matching the logic in parent
export interface SoundCloudMockData {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  soundCloudUrl: string;
  duration: string;
  timeAgo: string;
  genre: string;
  waveformUrl?: string; // Visual only
  fileName?: string; // For deletion
  description?: string;
}

interface SoundCloudMockModalProps {
  isOpen: boolean;
  onClose: () => void;
  mockData: SoundCloudMockData | null;
  onUpdate: (updatedMock: SoundCloudMockData) => void;
  onDelete: () => void;
}

export function SoundCloudMockModal({ isOpen, onClose, mockData, onUpdate, onDelete }: SoundCloudMockModalProps) {
  const [data, setData] = useState<SoundCloudMockData | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const { uploadImage } = useImageSystem('soundcloud');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(mockData);
  }, [mockData]);

  if (!isOpen || !data) return null;

  const handleTitleSave = (newTitle: string) => {
    const updated = { ...data, title: newTitle };
    setData(updated);
    onUpdate(updated);
    setIsEditingTitle(false);
  };

  const handleLinkSave = (newLink: string) => {
    const updated = { ...data, soundCloudUrl: newLink };
    setData(updated);
    onUpdate(updated);
    setIsEditingLink(false);
  };

  const handleDescriptionSave = (newDesc: string) => {
    const updated = { ...data, description: newDesc };
    setData(updated);
    onUpdate(updated);
    setIsEditingDescription(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       try {
          const file = e.target.files[0];
          // Use a timestamp to ensure unique filenames for rewrites specific to this mock ID if needed, 
          // or just generic naming. For this mock system, let's try to keep it simple.
          // We'll rename it to something unique like `sc_mock_${data.id}_${Date.now()}`
          const uniqueName = `sc_mock_${data.id}_${Date.now()}`;
          const url = await uploadImage(file, uniqueName);
          
          if (typeof url === 'string') {
             const updated = { ...data, coverImage: url, fileName: uniqueName };
             setData(updated);
             onUpdate(updated);
          }
       } catch (error) {
          console.error("Upload failed", error);
          alert("Failed to upload image.");
       }
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(data.soundCloudUrl);
    alert(`Link copied: ${data.soundCloudUrl}`);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-[1080px] bg-[#f2f2f2] min-h-[600px] shadow-2xl relative overflow-hidden text-[#333] font-sans group"
          onClick={(e) => e.stopPropagation()}
        >
          {/* FAKE TOP BAR */}
          <div className="bg-[#333] h-12 flex items-center px-4 justify-between text-[#ccc] text-sm">
             <div className="flex items-center gap-6">
                 {/* SC Cloud Logo Mock */}
                 <div className="w-8 h-5 bg-gradient-to-b from-[#f50] to-[#f30] rounded-sm relative mask-image-cloud">
                    <span className="sr-only">SoundCloud</span>
                 </div>
                 <div className="flex gap-4 font-medium">
                    <span className="text-white cursor-pointer">Home</span>
                    <span className="hover:text-white cursor-pointer">Feed</span>
                    <span className="hover:text-white cursor-pointer">Library</span>
                 </div>
             </div>
             <div className="flex-1 max-w-md mx-4">
                 <div className="relative">
                    <input className="w-full bg-[#e5e5e5] rounded px-3 py-1 text-black text-sm outline-none focus:bg-white" placeholder="Search" />
                    <Search className="absolute right-2 top-1.5 w-4 h-4 text-[#666]" />
                 </div>
             </div>
             <div className="flex items-center gap-4">
                 <span className="text-[#999] text-xs font-semibold cursor-pointer hover:text-white">For Artists</span>
                 <span className="text-[#999] text-xs font-semibold cursor-pointer hover:text-white">Upload</span>
                 <div className="flex items-center gap-3 text-[#ccc]">
                    <User className="w-5 h-5 cursor-pointer hover:text-white" />
                    <Bell className="w-5 h-5 cursor-pointer hover:text-white" />
                    <Mail className="w-5 h-5 cursor-pointer hover:text-white" />
                    <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-white" />
                 </div>
             </div>
          </div>

          {/* MAIN HERO CONTENT */}
          <div className="flex gap-5 p-5 bg-gradient-to-r from-[#7a6f8f] to-[#5b4a8a] relative min-h-[380px]">
             {/* Left Content */}
             <div className="flex-1 flex flex-col justify-between z-10">
                 <div className="flex gap-4 pt-4">
                     {/* Big Play Button */}
                     <div className="w-16 h-16 rounded-full bg-[#f50] flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1 fill-white" />
                     </div>
                     
                     <div className="flex-1 pt-1 text-white">
                        <div className="flex justify-between items-start">
                           <div className="flex-1">
                              {isEditingTitle ? (
                                 <input 
                                   autoFocus
                                   className="text-2xl bg-black/20 border border-white/30 text-white px-1 py-0.5 w-full mb-1"
                                   defaultValue={data.title}
                                   onBlur={(e) => handleTitleSave(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && handleTitleSave(e.currentTarget.value)}
                                 />
                              ) : (
                                 <div className="flex items-center gap-2 group/title">
                                    <h1 className="text-2xl font-normal bg-black/40 px-2 py-0.5 inline-block cursor-pointer hover:bg-black/60 transition-colors" onClick={() => setIsEditingTitle(true)}>
                                       {data.title}
                                    </h1>
                                    <Pencil className="w-4 h-4 opacity-0 group-hover/title:opacity-100 cursor-pointer" onClick={() => setIsEditingTitle(true)} />
                                 </div>
                              )}
                              
                              <h2 className="text-[#ddd] text-lg bg-black/20 px-2 py-0.5 inline-block mt-1 font-light">{data.artist}</h2>
                           </div>
                           <div className="text-right">
                              <span className="text-xs text-[#ddd] font-light">{data.timeAgo}</span>
                              <div className="mt-2">
                                 <span className="bg-[#999]/30 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">#{data.genre}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                 </div>

                 {/* Waveform Mock */}
                 <div className="mt-auto mb-2 h-24 flex items-end gap-[2px] opacity-80">
                      <WaveformBars />
                 </div>
             </div>

             {/* Right Cover Art */}
             <div className="w-[340px] h-[340px] bg-[#333] shadow-2xl relative group/cover flex-shrink-0">
                 <img src={data.coverImage} className="w-full h-full object-cover" alt="Cover" />
                 
                 {/* Replace Image Overlay */}
                 <div className="absolute bottom-4 right-4 opacity-0 group-hover/cover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="bg-[#333] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-2 shadow-lg hover:bg-[#111]"
                     >
                        <Upload className="w-3 h-3" /> Replace image
                     </button>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload} 
                     />
                 </div>
             </div>
          </div>

          {/* ACTION BAR & INFO */}
          <div className="px-5 py-4 border-b border-[#e5e5e5] bg-white text-[#333]">
              {/* Write Comment Mock */}
              <div className="flex gap-0 mb-4 h-10 border border-[#e5e5e5] bg-[#f2f2f2]">
                 <div className="w-10 h-full bg-[#f50] flex items-center justify-center">
                    <img src="/images/Logo IG.png" className="w-full h-full object-cover p-0.5" alt="me" />
                 </div>
                 <input className="flex-1 bg-transparent px-3 text-sm text-[#333] outline-none" placeholder="Write a comment..." />
              </div>

              <div className="flex justify-between items-center">
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                      <button className="px-2.5 py-1 border border-[#e5e5e5] rounded-sm text-xs font-semibold flex items-center gap-1.5 hover:border-[#ccc]">
                         <Heart className="w-3.5 h-3.5" /> Like
                      </button>
                      <button className="px-2.5 py-1 border border-[#e5e5e5] rounded-sm text-xs font-semibold flex items-center gap-1.5 hover:border-[#ccc]">
                         <RefreshCw className="w-3.5 h-3.5" /> Repost
                      </button>
                      <button 
                        onClick={() => setIsEditingLink(!isEditingLink)}
                        className={clsx(
                             "px-2.5 py-1 border border-[#e5e5e5] rounded-sm text-xs font-semibold flex items-center gap-1.5 hover:border-[#ccc]",
                             isEditingLink && "bg-[#f2f2f2] border-[#ccc]"
                        )}
                      >
                         <Pencil className="w-3.5 h-3.5" /> Edit Link
                      </button>
                      
                      <button 
                        onClick={copyLinkToClipboard}
                        className="px-2.5 py-1 border border-[#e5e5e5] rounded-sm text-xs font-semibold flex items-center gap-1.5 hover:border-[#ccc]"
                      >
                         <LinkIcon className="w-3.5 h-3.5" /> Copy Link
                      </button>

                      <button className="px-2.5 py-1 border border-[#e5e5e5] rounded-sm text-xs font-semibold flex items-center gap-1.5 hover:border-[#ccc]">
                         <MoreHorizontal className="w-3.5 h-3.5" /> More
                      </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-[#999] text-xs">
                     <span className="flex items-center gap-1"><Play className="w-3 h-3 fill-[#999]" /> 14.2K</span>
                     <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-[#999]" /> 342</span>
                     <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 28</span>
                  </div>
              </div>

              {/* Editable Link Input (Conditional) */}
              <AnimatePresence>
                 {isEditingLink && (
                    <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden mt-3"
                    >
                       <div className="flex gap-2 items-center bg-orange-50 p-2 rounded border border-orange-100">
                          <LinkIcon className="w-4 h-4 text-[#f50]" />
                          <input 
                             className="flex-1 bg-white border border-[#ccc] px-2 py-1 text-xs text-[#555] rounded"
                             defaultValue={data.soundCloudUrl}
                             placeholder="https://soundcloud.com/..."
                             autoFocus
                             onKeyDown={(e) => e.key === 'Enter' && handleLinkSave(e.currentTarget.value)}
                          />
                          <button 
                             onClick={(e) => handleLinkSave((e.currentTarget.previousElementSibling as HTMLInputElement).value)}
                             className="bg-[#f50] text-white text-xs px-3 py-1 rounded hover:bg-[#d40] font-semibold"
                          >
                             Save
                          </button>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
          </div>

          <div className="bg-white min-h-[100px] flex px-5 py-6 gap-8 text-[#333]">
              <div className="w-[120px] flex-shrink-0 text-center">
                 <div className="w-28 h-28 rounded-full bg-[#333] overflow-hidden mb-2 mx-auto">
                    <img src="/images/Logo IG.png" className="w-full h-full object-cover" alt="Artist" />
                 </div>
                 <div className="font-medium text-sm">Astrion</div>
                 <div className="flex items-center justify-center gap-1 text-[#999] text-xs mt-1">
                    <User className="w-3 h-3" /> 15K
                    <span className="bg-[#f50] text-white text-[9px] px-1 rounded uppercase font-bold ml-1">Pro</span>
                 </div>
                 <button className="mt-3 w-full border border-[#ccc] rounded-sm text-xs font-semibold py-0.5 hover:border-[#999]">Follow</button>
              </div>

              <div className="flex-1">
                 <div className="text-sm leading-relaxed text-[#333]">
                    {isEditingDescription ? (
                        <textarea 
                           className="w-full h-32 p-2 border border-[#ccc] rounded bg-white text-[#333] mb-4 text-sm resize-none focus:outline-none focus:border-[#f50]"
                           defaultValue={data.description || "Astrion is a DJ and producer specializing in Progressive House, Melodic Techno, and sets with a strong sonic identity. I combine musical design, energy, and technology to create immersive experiences in clubs, festivals, and private events."}
                           onBlur={(e) => handleDescriptionSave(e.target.value)}
                           onKeyDown={(e) => {
                               if (e.key === 'Enter' && !e.shiftKey) {
                                   e.preventDefault();
                                   handleDescriptionSave(e.currentTarget.value);
                               }
                           }}
                           autoFocus
                        />
                    ) : (
                        <div className="group/desc relative mb-4">
                             <p 
                               className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                               onClick={() => setIsEditingDescription(true)}
                             >
                                {data.description || "Astrion is a DJ and producer specializing in Progressive House, Melodic Techno, and sets with a strong sonic identity. I combine musical design, energy, and technology to create immersive experiences in clubs, festivals, and private events."}
                             </p>
                             <button 
                                onClick={() => setIsEditingDescription(true)}
                                className="absolute top-0 right-0 p-1 bg-white shadow rounded-full opacity-0 group-hover/desc:opacity-100 transition-opacity text-[#999] hover:text-[#f50]"
                             >
                                <Pencil className="w-3 h-3" />
                             </button>
                        </div>
                    )}
                    <p className="text-[#f50] cursor-pointer hover:underline text-xs font-medium">Show more</p>
                 </div>
                 
                 <div className="mt-8 border-t border-[#f2f2f2] pt-4">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-4 h-4 text-[#999]" />
                        <span className="text-sm font-semibold text-[#333]">2 comments</span>
                        <div className="ml-auto flex bg-[#f2f2f2] border border-[#e5e5e5] rounded px-2 py-0.5 text-xs text-[#333] cursor-pointer">
                           Sorted by: <span className="font-semibold ml-1">Newest</span>
                        </div>
                    </div>
                 </div>
              </div>

              <div className="w-[280px] flex-shrink-0 border-l border-[#f2f2f2] pl-8">
                  <div className="flex items-center gap-2 text-[#999] text-xs mb-4 uppercase font-semibold">
                      <span>In playlists</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#999] text-xs mb-4 uppercase font-semibold border-t border-[#f2f2f2] pt-4">
                      <span>Related tracks</span>
                  </div>
              </div>
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2 z-50">
              <button 
                 onClick={(e) => {
                     e.stopPropagation();
                     if(window.confirm('Delete this mock set permanently?')) {
                         onDelete();
                     }
                 }}
                 className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-500 bg-black/50 hover:bg-black/80 rounded-full p-1 transition-all duration-200 backdrop-blur-sm"
                 title="Delete Mock"
              >
                 <Trash className="w-6 h-6" />
              </button>
              <button 
                 onClick={onClose}
                 className="text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-1 transition-colors backdrop-blur-sm"
              >
                 <X className="w-6 h-6" />
              </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

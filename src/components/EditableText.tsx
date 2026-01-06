import { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTextProps {
  storageKey: string;
  defaultText: string;
  className?: string;
  multiline?: boolean;
  link?: boolean;
}

export function EditableText({ storageKey, defaultText, className = "", multiline = false, link = false }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved : defaultText;
  });
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    localStorage.setItem(storageKey, text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const saved = localStorage.getItem(storageKey);
    setText(saved !== null ? saved : defaultText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
    if (e.key === 'Escape') {
        handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 group relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-white/10 text-bone p-2 rounded border border-white/20 outline-none focus:border-gold/50 w-full min-h-[100px] resize-none ${className}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-white/10 text-bone px-2 py-1 rounded border border-white/20 outline-none focus:border-gold/50 min-w-[200px] ${className}`}
          />
        )}
        <div className="flex gap-1 absolute -right-16 top-0 bg-black/50 backdrop-blur rounded p-1">
           <button onClick={handleSave} className="p-1 hover:text-green-400 text-white transition-colors">
             <Check className="w-4 h-4" />
           </button>
           <button onClick={handleCancel} className="p-1 hover:text-red-400 text-white transition-colors">
             <X className="w-4 h-4" />
           </button>
        </div>
      </div>
    );
  }

  // Parse links if enabled
  const renderContent = () => {
     if (link && (text.startsWith('http') || text.includes('.'))) { // Simple heuristic
         const href = text.startsWith('http') ? text : `https://${text}`;
         return (
             <a 
               href={href} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:underline hover:text-gold transition-colors"
               onClick={(e) => e.stopPropagation()}
             >
                 {text}
             </a>
         );
     }
     return text;
  };

  return (
    <div 
       className={`group relative cursor-pointer hover:bg-white/5 rounded px-1 transition-colors ${className} ${multiline ? 'whitespace-pre-wrap' : ''}`}
       onClick={() => setIsEditing(true)}
       title="Click to edit"
    >
      {renderContent()}
      <Pencil className="w-3 h-3 text-bone/30 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
  }>;
}

export function ContextMenu({ x, y, onClose, actions }: ContextMenuProps) {
  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('contextmenu', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[200] bg-abyss-panel border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl py-1 min-w-[160px]"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            disabled={action.disabled}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors",
              action.danger 
                ? "text-red-400 hover:bg-red-500/10" 
                : "text-bone hover:bg-white/5",
              action.disabled && "opacity-30 cursor-not-allowed"
            )}
            aria-label={action.label}
          >
            {action.icon && <span className="w-4 h-4 shrink-0">{action.icon}</span>}
            <span>{action.label}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}


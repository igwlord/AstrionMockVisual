import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemWidth?: number; // Approximate width of item for scroll step
}

export function SimpleCarousel({ children, className = "", itemWidth = 300 }: SimpleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative group/carousel ${className}`}>
        {/* Left Button */}
        <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-abyss-panel border border-white/10 rounded-full flex items-center justify-center text-bone/60 hover:text-gold hover:border-gold/50 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
            <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scroll Container */}
        <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth snap-x snap-mandatory"
        >
            {children}
        </div>

        {/* Right Button */}
        <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-abyss-panel border border-white/10 rounded-full flex items-center justify-center text-bone/60 hover:text-gold hover:border-gold/50 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all"
        >
            <ChevronRight className="w-4 h-4" />
        </button>
    </div>
  );
}

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string | ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({ 
  content, 
  children, 
  side = 'right', 
  delay = 300,
  disabled = false,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top?: number; left?: number; right?: number; bottom?: number }>({});
  const [actualSide, setActualSide] = useState(side);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newSide = side;
    let top = 0;
    let left = 0;
    let right = 0;
    let bottom = 0;

    // Calculate initial position based on side
    switch (side) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        if (top < 0) {
          newSide = 'bottom';
          top = rect.bottom + 8;
        }
        if (left < 0) left = 8;
        if (left + tooltipRect.width > viewport.width) {
          left = viewport.width - tooltipRect.width - 8;
        }
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        if (top + tooltipRect.height > viewport.height) {
          newSide = 'top';
          top = rect.top - tooltipRect.height - 8;
        }
        if (left < 0) left = 8;
        if (left + tooltipRect.width > viewport.width) {
          left = viewport.width - tooltipRect.width - 8;
        }
        break;
      case 'left':
        left = rect.left - tooltipRect.width - 8;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        if (left < 0) {
          newSide = 'right';
          left = rect.right + 8;
        }
        if (top < 0) top = 8;
        if (top + tooltipRect.height > viewport.height) {
          top = viewport.height - tooltipRect.height - 8;
        }
        break;
      case 'right':
        left = rect.right + 8;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        if (left + tooltipRect.width > viewport.width) {
          newSide = 'left';
          left = rect.left - tooltipRect.width - 8;
        }
        if (top < 0) top = 8;
        if (top + tooltipRect.height > viewport.height) {
          top = viewport.height - tooltipRect.height - 8;
        }
        break;
    }

    setActualSide(newSide);
    setPosition({ top, left, right, bottom });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible]);

  // Mobile support: long press
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout>();
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const timer = setTimeout(() => {
      showTooltip();
    }, 500); // 500ms for long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(undefined);
    }
    hideTooltip();
  };

  const child = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      if (typeof children.ref === 'function') {
        children.ref(node);
      } else if (children.ref) {
        (children.ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  });

  return (
    <>
      {child}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`fixed z-[200] pointer-events-none ${className}`}
            style={position}
          >
            <div className="bg-abyss-panel border border-white/20 rounded-lg px-3 py-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
              {typeof content === 'string' ? (
                <div className="text-[10px] font-bold text-white uppercase whitespace-nowrap leading-tight">
                  {content}
                </div>
              ) : (
                <div className="text-[10px] text-white">
                  {content}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


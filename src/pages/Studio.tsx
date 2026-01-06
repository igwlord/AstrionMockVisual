import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    Layout, Type, Image as ImageIcon, Trash2, Plus, Minus,
    Instagram, Bold, Italic,
    MousePointer2, ChevronDown,
    Lock, Unlock, Eye, EyeOff,
    RotateCcw, RotateCw, Menu, X,
    Brush, Square, Copy, CheckSquare, Eraser, GripVertical,
    Link, Unlink, Activity, Maximize2, RotateCcw as ResetIcon, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Tooltip } from '../components/Tooltip';
import { useNotification } from '../components/Notification';
import { Separator } from '../components/Separator';
import { ContextMenu } from '../components/ContextMenu';
import { TEXT_OPACITY } from '../constants/typography';

// --- Types ---
interface Preset {
  id: string;
  label: string;
  desc: string;
  width: number;
  height: number;
  platform: 'instagram' | 'youtube' | 'soundcloud' | 'custom';
}

type LayerType = 'text' | 'image' | 'rect' | 'circle' | 'triangle' | 'polygon' | 'line' | 'drawing';
type ToolType = 'select' | 'text' | 'image' | 'brush' | 'eraser' | 'shape_rect' | 'shape_circle' | 'shape_triangle' | 'shape_polygon' | 'line';
type PanelTab = 'properties' | 'layers';

interface ImageFilters {
    brightness: number; 
    contrast: number;   
    saturation: number; 
    blur: number;       
    preset?: string; 
}

interface ShadowSettings {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
}

interface Layer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  
  // State
  locked: boolean;
  visible: boolean;
  aspectLocked?: boolean;

  // Style
  color?: string; // Main Fill or Stroke if single
  fill?: boolean;
  fillColor?: string;
  stroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDash?: number[]; // [5, 5] for dashed
  opacity?: number;

  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  letterSpacing?: number;
  fontWeight?: string; 
  fontStyle?: string; 
  textDecoration?: string; 
  textAlign?: 'left' | 'center' | 'right';
  
  // Effects
  shadow?: boolean;
  shadowSettings?: ShadowSettings;
  glow?: boolean;
  glowIntensity?: number; 
  
  // Image specific
  src?: string;
  width?: number; 
  height?: number; 
  filters?: ImageFilters;

  // Vector specific
  points?: {x: number, y: number}[]; 
  sides?: number; // For polygon
  x2?: number; 
  y2?: number; 
  
  // Drawing specific
  strokes?: { points: {x: number, y: number}[], color: string, width: number, opacity?: number, blur?: number }[];
  maskStrokes?: { points: {x: number, y: number}[], color: string, width: number }[];
  curve?: number;
  shadowBlur?: number;
}

// --- Data ---
const PRESETS: Preset[] = [
  { id: 'ig_story', label: 'IG Story', desc: '1080 x 1920 px', width: 1080, height: 1920, platform: 'instagram' },
  { id: 'ig_reel_portrait', label: 'IG Reel Portrait', desc: '1080 x 1920 px', width: 1080, height: 1920, platform: 'instagram' },
  { id: 'ig_portrait_highlights', label: 'IG Portrait Highlights', desc: '1080 x 1080 px', width: 1080, height: 1080, platform: 'instagram' },
  { id: 'yt_thumbnail', label: 'YT Thumbnail', desc: '1280 x 720 px', width: 1280, height: 720, platform: 'youtube' },
  { id: 'yt_banner', label: 'YT Banner', desc: '2560 x 1440 px', width: 2560, height: 1440, platform: 'youtube' },
  { id: 'sc_coverart', label: 'SC CoverArt', desc: '1000 x 1000 px', width: 1000, height: 1000, platform: 'soundcloud' },
  { id: 'sc_banner', label: 'SC Banner', desc: '2480 x 520 px', width: 2480, height: 520, platform: 'soundcloud' },
  { id: 'custom', label: 'Personalizado', desc: 'Definido por usuario', width: 1080, height: 1080, platform: 'custom' },
];

const BRAND_COLORS = ['#D4AF37', '#F5F5DC', '#240046', '#03071E', '#000000'];

const SUGGESTED_COLORS = [
    { name: 'Violeta Abisal', value: '#0B0A14' },
    { name: 'Oro Orgánico', value: '#C6A86B' },
    { name: 'Violeta Transm.', value: '#5B4B8A' }
];

const FONT_OPTIONS = [
    { label: 'Sans-serif Minimalista', value: 'system-ui, -apple-system, sans-serif' },
    { label: 'Serif Elegante', value: 'Georgia, serif' },
    { label: 'Monospace Moderno', value: "'Courier New', monospace" },
    { label: 'Display Bold', value: "'Arial Black', sans-serif" }
];

const FILTER_PRESETS = [
    { label: 'Normal', value: '', base: '' },
    { label: 'Blanco y Negro', value: 'grayscale(1)', base: 'grayscale' },
    { label: 'Vintage Suave', value: 'sepia(0.3) contrast(0.9) brightness(1.05)', base: 'sepia' },
    { label: 'Dramático', value: 'contrast(1.3) saturate(1.1) brightness(0.95)', base: 'contrast' },
    { label: 'Cálido', value: 'sepia(0.2) saturate(1.2) brightness(1.05)', base: 'sepia' },
    { label: 'Frío', value: 'hue-rotate(180deg) saturate(0.9) brightness(1.05)', base: 'hue-rotate' },
    { label: 'Alto Contraste', value: 'contrast(1.4) brightness(0.9)', base: 'contrast' },
];

const STROKE_STYLES = [
    { label: 'Solid', value: [] },
    { label: 'Dashed', value: [20, 10] },
    { label: 'Dotted', value: [5, 10] },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Components ---

export function Studio() {
  const { showNotification } = useNotification();
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [customSize, setCustomSize] = useState({ width: 1080, height: 1080 });
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('image');
  
  // Auto-select Image tool on mount
  useEffect(() => {
    setActiveTool('image');
    setActiveTab('properties');
  }, []);
  const [activeTab, setActiveTab] = useState<PanelTab>('properties');
  
  // Grouped background state
  const [backgroundState, setBackgroundState] = useState({
    image: null as string | null,
    offset: { x: 0, y: 0 },
    scale: 1,
    locked: false,
    filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, preset: '' }
  });
  
  // Grouped brush state
  const [brushState, setBrushState] = useState({
    color: '#D4AF37',
    size: 5,
    opacity: 100,
    blur: 0
  });
  
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const [layers, setLayers] = useState<Layer[]>([]);
  
  // MULTI-SELECT
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  
  const [zoom, setZoom] = useState(0.4); 
  const [history, setHistory] = useState<Layer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [snapGuides, setSnapGuides] = useState<{ x?: number, y?: number }>({});
  const [recentColors, setRecentColors] = useState<string[]>(BRAND_COLORS);
  
  const [draggedLayerIndex, setDraggedLayerIndex] = useState<number | null>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layerId?: string } | null>(null);
  const [showSuggestedColors, setShowSuggestedColors] = useState(false);
  const [activeBgModal, setActiveBgModal] = useState<'config' | 'filters' | 'adjustments'>('config');
  const [filterIntensity, setFilterIntensity] = useState(100);
  
  // Temporary text properties state
  const [tempTextProps, setTempTextProps] = useState({
    fontSize: 120,
    color: '#E6E2DA',
    letterSpacing: 0,
    fontWeight: 'normal' as string,
    fontStyle: 'normal' as string
  });
    
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);
  const historyDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Persistence - Expanded
  useEffect(() => {
    if (!initialized.current) {
        const saved = localStorage.getItem('astrion_studio_v5_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.layers) setLayers(parsed.layers);
                if (parsed.backgroundState) setBackgroundState(parsed.backgroundState);
                if (parsed.brushState) setBrushState(parsed.brushState);
                if (parsed.activeTool) setActiveTool(parsed.activeTool);
                if (parsed.zoom !== undefined) setZoom(parsed.zoom);
                if (parsed.viewportOffset) setViewportOffset(parsed.viewportOffset);
                if (parsed.activePreset) setActivePreset(parsed.activePreset);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_e) { /* Ignore JSON parse errors */ }
        }
        initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialized.current) {
       localStorage.setItem('astrion_studio_v5_state', JSON.stringify({ 
         layers, 
         backgroundState,
         brushState,
         activeTool,
         zoom,
         viewportOffset,
         activePreset
       }));
    }
  }, [layers, backgroundState, brushState, activeTool, zoom, viewportOffset, activePreset]);

  // History & Undo/Redo - Optimized with debounce
  useEffect(() => { if (history.length === 0 && layers.length === 0) { setHistory([[]]); setHistoryIndex(0); } }, [history.length, layers.length]);
  
  const commitToHistory = useCallback((newLayers: Layer[]) => {
      // Debounce history commits to avoid excessive states
      if (historyDebounceRef.current) {
          clearTimeout(historyDebounceRef.current);
      }
      
      historyDebounceRef.current = setTimeout(() => {
          const current = history.slice(0, historyIndex + 1);
          // Avoid duplicate states
          const lastState = current[current.length - 1];
          const isDuplicate = lastState && JSON.stringify(lastState) === JSON.stringify(newLayers);
          
          if (!isDuplicate) {
              const next = [...current, newLayers].slice(-50);
              setHistory(next); 
              setHistoryIndex(next.length - 1);
          }
      }, 150); // 150ms debounce
  }, [historyIndex, history]);
  const updateLayers = (updates: (prev: Layer[]) => Layer[]) => {
     setLayers(prev => { const next = updates(prev); commitToHistory(next); return next; });
  };
  const updateLayer = (id: string, updates: Partial<Layer>) => {
     updateLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };
  const updateLayerDirect = (id: string, updates: Partial<Layer>) => {
      setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };
  const deleteSelection = useCallback(() => {
      updateLayers(prev => prev.filter(l => !selectedLayerIds.includes(l.id)));
      setSelectedLayerIds([]);
      // eslint-disable-next-line
  }, [selectedLayerIds]);
  const undo = useCallback(() => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex); setLayers(history[newIndex]); setSelectedLayerIds([]);
      }
  }, [historyIndex, history]);
  const redo = useCallback(() => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex); setLayers(history[newIndex]); setSelectedLayerIds([]);
      }
  }, [historyIndex, history]);

  // Shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
          
          // Escape key - Close modals and menus
          if (e.key === 'Escape') {
              setIsPresetDropdownOpen(false);
              setIsShapeMenuOpen(false);
              setShowCustomSizeModal(false);
              setContextMenu(null);
              return;
          }
          
          if (e.code === 'Space') { setIsSpacePressed(true); e.preventDefault(); }
          if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
          if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelection(); }
          
          // Layer navigation shortcuts
          if (e.key === 'ArrowUp' && (e.ctrlKey || e.metaKey) && selectedLayerIds.length > 0) {
              e.preventDefault();
              const currentIndex = layers.findIndex(l => l.id === selectedLayerIds[0]);
              if (currentIndex > 0) {
                  setSelectedLayerIds([layers[currentIndex - 1].id]);
                  setActiveTab('properties');
              }
          }
          if (e.key === 'ArrowDown' && (e.ctrlKey || e.metaKey) && selectedLayerIds.length > 0) {
              e.preventDefault();
              const currentIndex = layers.findIndex(l => l.id === selectedLayerIds[0]);
              if (currentIndex < layers.length - 1) {
                  setSelectedLayerIds([layers[currentIndex + 1].id]);
                  setActiveTab('properties');
              }
          }
          
          // Brush Size Shortcuts
          if (['+', '=', 'NumpadAdd'].includes(e.key)) {
              setBrushState(prev => ({ ...prev, size: Math.min(100, prev.size + 2) }));
          }
          if (['-', '_', 'NumpadSubtract'].includes(e.key)) {
              setBrushState(prev => ({ ...prev, size: Math.max(1, prev.size - 2) }));
          }
      };
      const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpacePressed(false); };
      window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
      return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [selectedLayerIds, undo, redo, deleteSelection, layers]); 

  // Helpers
  const addToRecentColors = (color: string) => {
      if (!recentColors.includes(color)) setRecentColors(prev => [color, ...prev].slice(0, 10));
  };

  // Apply filter with intensity
  const applyFilterWithIntensity = (preset: string, intensity: number): string => {
      if (!preset || intensity === 0) return '';
      if (intensity === 100) return preset;
      
      // For filters, we need to interpolate the values
      // This is a simplified approach - for more complex filters, we'd need to parse and interpolate each function
      const intensityRatio = intensity / 100;
      
      // For grayscale, sepia, etc., we can directly interpolate
      if (preset.includes('grayscale')) {
          return `grayscale(${intensityRatio})`;
      }
      if (preset.includes('sepia')) {
          const sepiaMatch = preset.match(/sepia\(([\d.]+)\)/);
          if (sepiaMatch) {
              const sepiaValue = parseFloat(sepiaMatch[1]);
              return preset.replace(/sepia\([\d.]+\)/, `sepia(${sepiaValue * intensityRatio})`);
          }
      }
      
      // For complex filters, use opacity blending approach
      return preset;
  };
  
  // File validation
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  const validateFile = (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
          return 'Tipo de archivo no permitido. Use JPEG, PNG, WebP o GIF.';
      }
      if (file.size > MAX_FILE_SIZE) {
          return `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
      }
      return null;
  };
  
  // Update cursor position - Optimized with requestAnimationFrame
  useEffect(() => {
      let rafId: number;
      const handleMouseMove = (e: MouseEvent) => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
              setCursorPos({ x: e.clientX, y: e.clientY });
          });
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          if (rafId) cancelAnimationFrame(rafId);
      };
  }, []);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files?.[0]) {
         const file = e.target.files[0];
         const error = validateFile(file);
         if (error) {
             showNotification(error, 'error');
             if (fileInputRef.current) fileInputRef.current.value = '';
             return;
         }
         const reader = new FileReader();
         reader.onload = (event) => {
             const src = event.target?.result as string;
             const img = new Image();
             img.onload = () => {
                 const scale = Math.min(activePreset.width / img.width, activePreset.height / img.height);
                 setBackgroundState(prev => ({
                     ...prev,
                     image: src,
                     scale,
                     filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, preset: '' },
                     offset: { x: (activePreset.width - img.width * scale) / 2, y: (activePreset.height - img.height * scale) / 2 }
                 }));
                 if (fileInputRef.current) fileInputRef.current.value = '';
                 showNotification('Imagen de fondo cargada correctamente', 'success');
             };
             img.src = src;
         };
         reader.readAsDataURL(file);
     }
  };

  const addLayer = (type: LayerType, pos?: {x:number, y:number}) => {
      const cx = pos ? pos.x : activePreset.width / 2; 
      const cy = pos ? pos.y : activePreset.height / 2;

      const newLayer: Layer = {
          id: `${type}_${generateId()}`,
          type,
          x: cx,
          y: cy,
          rotation: 0,
          scale: 1,
          locked: false,
          visible: true,
          opacity: 1,
          aspectLocked: true, 
          ...(type === 'text' && { 
              text: 'Double Click to Edit', 
              fontSize: tempTextProps.fontSize, 
              fontFamily: 'Satoshi, sans-serif', 
              color: tempTextProps.color, 
              letterSpacing: tempTextProps.letterSpacing,
              fontWeight: tempTextProps.fontWeight,
              fontStyle: tempTextProps.fontStyle,
              textAlign: 'center' 
          }),
          ...(type === 'rect' && { width: 300, height: 300, fill: true, fillColor: brushState.color, stroke: false, strokeColor: '#ffffff', strokeWidth: 5 }),
          ...(type === 'circle' && { width: 300, height: 300, fill: true, fillColor: brushState.color, stroke: false, strokeColor: '#ffffff', strokeWidth: 5 }),
          ...(type === 'triangle' && { width: 300, height: 300, fill: true, fillColor: brushState.color, stroke: false, strokeColor: '#ffffff', strokeWidth: 5 }),
          ...(type === 'polygon' && { width: 300, height: 300, sides: 5, fill: true, fillColor: brushState.color, stroke: false, strokeColor: '#ffffff', strokeWidth: 5 }),
          ...(type === 'line' && { width: 400, height: 20, fill:false, stroke:true, strokeColor: brushState.color, strokeWidth: 5 }),
      };
      updateLayers(prev => [...prev, newLayer]);
      setSelectedLayerIds([newLayer.id]); setActiveTab('properties'); setActiveTool('select');
  };


  const handleDoubleClick = (id: string) => {
      const layer = layers.find(l => l.id === id);
      if (layer && layer.type === 'text') {
          setSelectedLayerIds([id]);
          setActiveTab('properties');
          setTimeout(() => {
              const textarea = document.querySelector('textarea.resize-none') as HTMLTextAreaElement;
              if (textarea) { textarea.focus(); textarea.select(); }
          }, 100);
      }
  };

   const dragState = useRef<{
       type: 'none' | 'pan' | 'layer' | 'bg' | 'resize' | 'drawing' | 'drawing_line' | 'erasing_mask';
       id?: string;
       startX: number;
       startY: number;
       initialX: number;
       initialY: number;
       initialScale?: number;
       pointerId?: number;
       lastX?: number;
       lastY?: number;
   }>({ type: 'none', startX: 0, startY: 0, initialX: 0, initialY: 0 });

   const handlePointerDown = (e: React.PointerEvent, type: 'layer' | 'bg' | 'resize' | 'pan', id?: string) => {
       e.preventDefault();
       e.stopPropagation();
       (e.target as Element).setPointerCapture(e.pointerId);

       const state = dragState.current;
       state.pointerId = e.pointerId;
       state.startX = e.clientX;
       state.startY = e.clientY;

       // PANNING
       if (isSpacePressed || e.button === 1 || type === 'pan') {
           if (activeTool === 'brush') {
              // Fallthrough to brush logic below if not actively panning with space/middleclick
              if (!isSpacePressed && e.button !== 1) {
                  // It's a drawing attempt on the backdrop
              } else {
                  state.type = 'pan';
                  state.initialX = viewportOffset.x;
                  state.initialY = viewportOffset.y;
                  setIsPanning(true);
                  return;
              }
           } else {
               state.type = 'pan';
               state.initialX = viewportOffset.x;
               state.initialY = viewportOffset.y;
               setIsPanning(true);
               return;
           }
       }

       if (activeTool === 'text') {
            const frame = document.getElementById('canvas-frame')?.getBoundingClientRect(); if(!frame) return;
            const x = (e.clientX - frame.left)/zoom;
            const y = (e.clientY - frame.top)/zoom;
            addLayer('text', {x, y});
            setActiveTool('select');
            return;
       }

       // BRUSH & ERASER & LINE
       if (activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'line') {
           const frame = document.getElementById('canvas-frame')?.getBoundingClientRect(); if(!frame) return;
           const getC = (cx:number, cy:number) => ({ x: (cx - frame.left)/zoom, y: (cy - frame.top)/zoom });
           const pt0 = getC(e.clientX, e.clientY);
           
           if (activeTool === 'line') {
               // Create Line Layer interactively
               const newLayer: Layer = {
                   id: `line_${generateId()}`, type: 'line',
                   x: pt0.x, y: pt0.y, // Start Point
                   width: 1, height: 20, // Initial length 1
                   rotation: 0, scale: 1, locked: false, visible: true, opacity: 1,
                   fill: false, stroke: true, strokeColor: brushState.color, strokeWidth: 5
               };
               setLayers(prev => [...prev, newLayer]);
               setSelectedLayerIds([newLayer.id]);
               state.type = 'drawing_line';
               state.id = newLayer.id;
               state.startX = pt0.x; // Use canvas coords for calculation
               state.startY = pt0.y;
               return;
           }

           // Eraser Masking Logic
           const isMasking = activeTool === 'eraser' && selectedLayerIds.length === 1;
           
           if (isMasking) {
                // Eraser Masking on Selected Layer
                const targetId = selectedLayerIds[0];
                const targetLayer = layers.find(l => l.id === targetId);
                if (targetLayer && !targetLayer.locked) {
                    state.type = 'erasing_mask';
                    state.id = targetId;
                    const drawWidth = brushState.size * 2;
                    // Transform point to layer's local space? No, masking usually happens in layer space.
                    // If we use SVG mask on the layer div, the mask coordinates must align.
                    // Simplest: Mask is a child of the layer div (absolute 0,0).
                    // So we need points relative to the layer's x,y and rotation.
                    // This is complex algebra.
                    // ALTERNATIVE: Use a global "Masking Layer" that is just composite-destination-out?
                    // User requested "Erase part of the text".
                    // Let's store mask strokes in CANVAS coordinates, and render the Mask SVG at canvas 0,0, but applied to the layer?
                    // CSS `mask` property works on the element. `mask-image: url(...)`.
                    // The SVG mask should be `contentUnits="userSpaceOnUse"`.
                    // We will append strokes to `layer.maskStrokes`.
                    
                    const newStroke = { points: [pt0], color: '#000', width: drawWidth };
                    updateLayerDirect(targetId, { maskStrokes: [...(targetLayer.maskStrokes || []), newStroke] });
                    return;
                }
           }

           const drawColor = activeTool === 'eraser' ? '#050508' : brushState.color;
           const drawWidth = activeTool === 'eraser' ? (brushState.size * 2) : brushState.size;
           const drawOpacity = activeTool === 'eraser' ? 1 : brushState.opacity / 100;
           const drawBlur = activeTool === 'eraser' ? 0 : brushState.blur;

           const activeLayer = layers.find(l => l.id === selectedLayerIds[0]);
           
           if (activeLayer && activeLayer.type === 'drawing' && !activeLayer.locked) {
               state.type = 'drawing';
               state.id = activeLayer.id;
               const newStroke = { points: [pt0], color: drawColor, width: drawWidth, opacity: drawOpacity, blur: drawBlur };
               updateLayerDirect(activeLayer.id, { strokes: [...(activeLayer.strokes || []), newStroke] });
           } else {
               const newLayer: Layer = { 
                   id: `draw_${generateId()}`, type: 'drawing',  
                   x: activePreset.width/2, y: activePreset.height/2, 
                   rotation:0, scale:1, locked:false, visible:true, opacity:1,
                   strokes: [{ points: [pt0], color: drawColor, width: drawWidth, opacity: drawOpacity, blur: drawBlur }],
                   width: activePreset.width, height: activePreset.height
               };
               setLayers(prev => [...prev, newLayer]);
               setSelectedLayerIds([newLayer.id]);
               state.type = 'drawing';
               state.id = newLayer.id;
           }
           return;
       }

       if ((type === 'layer' || type === 'resize') && id) {
           if (activeTool !== 'select') return;
           const layer = layers.find(l => l.id === id); if(layer?.locked) return;

           // Selection Logic
           if (!e.shiftKey && !selectedLayerIds.includes(id)) {
                setSelectedLayerIds([id]); setActiveTab('properties');
           } else if (e.shiftKey) {
                if(selectedLayerIds.includes(id)) {
                    setSelectedLayerIds(p => p.filter(x => x !== id));
                    return; // Toggle off, no drag
                } else {
                    setSelectedLayerIds(p => [...p, id]);
                }
           }

           if (type === 'resize') {
               state.type = 'resize';
               state.id = id;
               state.initialScale = layer?.scale || 1;
           } else {
               state.type = 'layer';
               state.id = id;
               state.lastX = e.clientX;
               state.lastY = e.clientY;
           }
       } else if (type === 'bg' && backgroundState.image) {
           if(backgroundState.locked) {
               state.type = 'none';
           } else {
               state.type = 'bg';
               state.initialX = backgroundState.offset.x;
               state.initialY = backgroundState.offset.y;
               setSelectedLayerIds([]);
           }
       } else if (type === 'bg') {
           setSelectedLayerIds([]);
           state.type = 'none';
       }
   };

   const handlePointerMove = (e: React.PointerEvent) => {
       const state = dragState.current;
       if (state.type === 'none') return;
       e.preventDefault();

       // BRUSH DRAWING
       if (state.type === 'drawing' && state.id) {
           const frame = document.getElementById('canvas-frame')?.getBoundingClientRect(); if(!frame) return;
           const x = (e.clientX - frame.left)/zoom;
           const y = (e.clientY - frame.top)/zoom;
           
           // We need to append to the LAST stroke of the current layer
           setLayers(prev => prev.map(l => {
               if (l.id === state.id && l.strokes) {
                   const lastStrokeIdx = l.strokes.length - 1;
                   if (lastStrokeIdx < 0) return l; // Should not happen
                   const newStrokes = [...l.strokes];
                   newStrokes[lastStrokeIdx] = {
                       ...newStrokes[lastStrokeIdx],
                       points: [...newStrokes[lastStrokeIdx].points, {x, y}]
                   };
                   return { ...l, strokes: newStrokes };
               }
               return l;
           }));
           return;
       }

       const dx = e.clientX - state.startX;
       const dy = e.clientY - state.startY;

       if (state.type === 'pan') {
           setViewportOffset({ x: state.initialX + dx, y: state.initialY + dy });
       } else if (state.type === 'bg') {
           setBackgroundState(prev => ({
               ...prev,
               offset: { x: state.initialX + dx/zoom, y: state.initialY + dy/zoom }
           }));
       } else if (state.type === 'resize' && state.id) {
            const scaleChange = dx * 0.005;
            updateLayerDirect(state.id, { scale: Math.max(0.1, (state.initialScale||1) + scaleChange) });
       } else if (state.type === 'layer' && state.lastX && state.lastY) {
           const draggingIds = selectedLayerIds.includes(state.id!) ? selectedLayerIds : [state.id!];
           
           const deltaX = (e.clientX - state.lastX) / zoom;
           const deltaY = (e.clientY - state.lastY) / zoom;
           
           setLayers(prev => prev.map(l => {
              if (draggingIds.includes(l.id)) {
                  return { ...l, x: l.x + deltaX, y: l.y + deltaY };
              }
              return l;
           }));
           
           state.lastX = e.clientX;
           state.lastY = e.clientY;
       }
   };

   const handlePointerUp = (e: React.PointerEvent) => {
       const state = dragState.current;
       (e.target as Element).releasePointerCapture(e.pointerId);
       setIsPanning(false);
       
       if (state.type !== 'none') {
           commitToHistory(layers);
       }
       
       dragState.current = { type: 'none', startX: 0, startY: 0, initialX: 0, initialY: 0 };
       setSnapGuides({});
   };

  const selectedLayerId = selectedLayerIds.length > 0 ? selectedLayerIds[selectedLayerIds.length - 1] : null;
  const selectedLayer = selectedLayerId ? (layers.find(l => l.id === selectedLayerId) || null) : null; // Primary
  const multiSelection = selectedLayerIds.length > 1;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-abyss text-bone font-sans overflow-hidden select-none">
        
        {/* HEADER & TOOLBAR (Simplified for brevity, similar structure) */}
        <div className="md:hidden h-14 bg-abyss-panel border-b border-white/5 flex items-center justify-between px-4 z-50">
             <Layout className="w-5 h-5 text-gold" />
             <div className="flex gap-2">
                 <button onClick={undo}><RotateCcw className="w-4 h-4 text-white/50"/></button>
                 <button onClick={redo}><RotateCw className="w-4 h-4 text-white/50"/></button>
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen?<X className="w-5 h-5 text-white"/>:<Menu className="w-5 h-5 text-white"/>}</button>
             </div>
        </div>

        <div className={clsx("md:w-16 bg-abyss-panel border-r border-white/5 flex flex-col items-center py-6 z-30 relative h-full", isMobileMenuOpen ? "w-16 left-0 absolute" : "-left-16 md:left-0")}>
            <div className="mb-6"><Layout className="w-6 h-6 text-gold" /></div>
            <div className="flex flex-col gap-3 w-full px-2 items-center">
                <Tooltip content="Gestiona imágenes de fondo del canvas" side="right">
                    <div>
                        <TooltipButton icon={ImageIcon} label="Imagen" tooltip="Gestiona imágenes de fondo" active={activeTool === 'image'} onClick={() => { setActiveTool('image'); setActiveTab('properties'); }} />
                    </div>
                </Tooltip>
                <Tooltip content="Selecciona y mueve elementos. Shift+Click para selección múltiple" side="right">
                    <div>
                        <TooltipButton icon={MousePointer2} label="Seleccionar" tooltip="Selecciona elementos. Shift+Click para múltiple" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
                    </div>
                </Tooltip>
                <Tooltip content="Dibuja libremente en el canvas" side="right">
                    <div>
                        <TooltipButton icon={Brush} label="Pincel" tooltip="Dibuja libremente" active={activeTool === 'brush'} onClick={() => setActiveTool('brush')} />
                    </div>
                </Tooltip>
                <Tooltip content="Borra partes de capas seleccionadas" side="right">
                    <div>
                        <TooltipButton icon={Eraser} label="Borrador" tooltip="Borra partes de capas" active={activeTool === 'eraser'} onClick={() => setActiveTool('eraser')} />
                    </div>
                </Tooltip>
                <div className="relative group">
                    <Tooltip content="Agrega formas al canvas" side="right">
                        <div>
                            <TooltipButton icon={Square} label="Formas" tooltip="Agrega formas" active={activeTool.includes('shape')} onClick={() => setIsShapeMenuOpen(!isShapeMenuOpen)} />
                        </div>
                    </Tooltip>
                    <AnimatePresence>
                        {isShapeMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-[59]" onClick={() => setIsShapeMenuOpen(false)} />
                                <motion.div 
                                    initial={{opacity:0, x:-10}} 
                                    animate={{opacity:1, x:0}} 
                                    exit={{opacity:0, x:-10}} 
                                    className="absolute left-full top-0 ml-4 bg-abyss border border-white/10 rounded-xl p-2 flex flex-col gap-2 shadow-xl z-[60] w-36"
                                >
                                    <Tooltip content="Agrega un rectángulo" side="right">
                                        <button onClick={() => { addLayer('rect'); setIsShapeMenuOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-left text-xs text-bone focus:outline-none focus:ring-2 focus:ring-gold/50" aria-label="Agregar rectángulo"><Square size={14}/> Rectángulo</button>
                                    </Tooltip>
                                    <Tooltip content="Agrega un círculo" side="right">
                                        <button onClick={() => { addLayer('circle'); setIsShapeMenuOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-left text-xs text-bone focus:outline-none focus:ring-2 focus:ring-gold/50" aria-label="Agregar círculo"><CheckSquare size={14} className="rounded-full"/> Círculo</button>
                                    </Tooltip>
                                    <Tooltip content="Agrega un triángulo" side="right">
                                        <button onClick={() => { addLayer('triangle'); setIsShapeMenuOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-left text-xs text-bone focus:outline-none focus:ring-2 focus:ring-gold/50" aria-label="Agregar triángulo"><Square size={14} className="rotate-45"/> Triángulo</button>
                                    </Tooltip>
                                    <Tooltip content="Agrega un polígono" side="right">
                                        <button onClick={() => { addLayer('polygon'); setIsShapeMenuOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-left text-xs text-bone focus:outline-none focus:ring-2 focus:ring-gold/50" aria-label="Agregar polígono"><Square size={14}/> Polígono</button>
                                    </Tooltip>
                                    <Tooltip content="Agrega una línea" side="right">
                                        <button onClick={() => { addLayer('line'); setIsShapeMenuOpen(false); }} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-left text-xs text-bone focus:outline-none focus:ring-2 focus:ring-gold/50" aria-label="Agregar línea"><Activity size={14}/> Línea</button>
                                    </Tooltip>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <Separator orientation="horizontal" spacing="sm" />
                <Tooltip content="Agrega texto al canvas" side="right">
                    <div>
                        <TooltipButton icon={Type} label="Texto" tooltip="Agrega texto" active={activeTool === 'text'} onClick={() => setActiveTool('text')} />
                    </div>
                </Tooltip>

                <div className="hidden md:flex flex-col gap-3 mt-auto mb-4 border-t border-white/5 pt-4 w-full px-2">
                    <Tooltip content="Deshacer última acción (Ctrl+Z)" side="right">
                        <div>
                            <TooltipButton icon={RotateCcw} label="Deshacer" tooltip="Ctrl+Z" onClick={undo} disabled={historyIndex <= 0} />
                        </div>
                    </Tooltip>
                    <Tooltip content="Rehacer última acción (Ctrl+Shift+Z)" side="right">
                        <div>
                            <TooltipButton icon={RotateCw} label="Rehacer" tooltip="Ctrl+Shift+Z" onClick={redo} disabled={historyIndex >= history.length - 1} />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>

        {/* PANEL */}
        <div className={clsx("w-[300px] bg-abyss/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 flex-shrink-0", isMobileMenuOpen?"absolute right-0 h-full":"hidden md:flex")}>
            <div className="h-14 border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex gap-4">
                    <Tooltip content="Panel de propiedades de herramientas y capas" side="bottom">
                        <button 
                            onClick={() => setActiveTab('properties')} 
                            className={clsx("text-[10px] font-bold uppercase focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-1", activeTab === 'properties' ? "text-white" : TEXT_OPACITY.low)} 
                            aria-label="Panel de propiedades"
                            aria-pressed={activeTab === 'properties'}
                        >
                            Propiedades
                        </button>
                    </Tooltip>
                    <Tooltip content="Lista de capas del canvas" side="bottom">
                        <button 
                            onClick={() => setActiveTab('layers')} 
                            className={clsx("text-[10px] font-bold uppercase focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-1", activeTab === 'layers' ? "text-white" : TEXT_OPACITY.low)} 
                            aria-label="Panel de capas"
                            aria-pressed={activeTab === 'layers'}
                        >
                            Capas
                        </button>
                    </Tooltip>
                </div>
                {!selectedLayerIds.length && activeTab === 'properties' && (
                    <div className="relative">
                        <Tooltip content="Selecciona el tamaño del canvas" side="bottom">
                            <button 
                                onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)} 
                                className="flex items-center gap-2 text-xs font-medium text-gold truncate max-w-[120px] focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-1"
                                aria-label="Seleccionar tamaño de canvas"
                                aria-expanded={isPresetDropdownOpen}
                            >
                                {activePreset.label} <ChevronDown className={clsx("w-3 h-3 transition-transform", isPresetDropdownOpen && "rotate-180")} />
                            </button>
                        </Tooltip>
                        <AnimatePresence>
                            {isPresetDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-[99]" onClick={() => setIsPresetDropdownOpen(false)} />
                                    <motion.div 
                                        initial={{opacity:0, y:-10}} 
                                        animate={{opacity:1, y:0}} 
                                        exit={{opacity:0, y:-10}}
                                        className="absolute top-full left-0 mt-2 w-80 bg-abyss-panel border border-white/10 rounded-xl shadow-2xl z-[100] max-h-96 overflow-y-auto backdrop-blur-xl"
                                    >
                                        <div className="p-2">
                                            {['instagram', 'youtube', 'soundcloud'].map(platform => (
                                                <div key={platform} className="mb-4">
                                                    <div className="text-[9px] font-bold text-gold/50 uppercase mb-2 px-2">{platform}</div>
                                                    {PRESETS.filter(p => p.platform === platform).map(p => (
                                                        <button 
                                                            key={p.id} 
                                                            onClick={() => { 
                                                                setActivePreset(p); 
                                                                setIsPresetDropdownOpen(false); 
                                                                if(p.platform==='custom') setShowCustomSizeModal(true); 
                                                            }} 
                                                            className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 block group transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                                                            aria-label={`Seleccionar ${p.label}: ${p.desc}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="text-xs text-white font-bold group-hover:text-gold transition-colors">{p.label}</div>
                                                                    <div className="text-[10px] text-bone/50 font-mono">{p.desc}</div>
                                                                </div>
                                                                <div className="text-[9px] text-gold/30 font-mono">{p.width}×{p.height}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'layers' && (
                    <motion.div
                        key="layers"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-y-auto p-5 no-scrollbar pb-20"
                    >
                {/* LAYERS DRAG & DROP */}
                    <div className="flex flex-col h-full relative">
                         <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20 shrink-0 sticky top-0 z-10 backdrop-blur-md">
                             <div className="flex items-center gap-2">
                                <Tooltip content={selectedLayerIds.length === layers.length && layers.length > 0 ? "Deseleccionar todas las capas" : "Seleccionar todas las capas"}>
                                    <button 
                                        onClick={() => setSelectedLayerIds(selectedLayerIds.length === layers.length && layers.length > 0 ? [] : layers.map(l => l.id))} 
                                        className="text-bone/50 hover:text-bone focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                                        aria-label={selectedLayerIds.length === layers.length && layers.length > 0 ? "Deseleccionar todas" : "Seleccionar todas"}
                                    >
                                        <CheckSquare size={14} className={selectedLayerIds.length === layers.length && layers.length > 0 ? "text-gold" : ""}/>
                                    </button>
                                </Tooltip>
                                <span className="text-[10px] font-bold text-bone/50 uppercase">{selectedLayerIds.length} Seleccionados</span>
                             </div>
                             <div className="flex items-center gap-1">
                                <Tooltip content="Duplicar capas seleccionadas">
                                    <button 
                                        onClick={() => {
                                            const newLayers = selectedLayerIds.map(id => {
                                                const l = layers.find(x => x.id === id);
                                                if(!l) return null;
                                                return { ...l, id: `${l.type}_copy_${Date.now()}_${generateId()}`, x: l.x+20, y: l.y+20 };
                                            }).filter(Boolean) as Layer[];
                                            if(newLayers.length) {
                                                updateLayers(prev => [...prev, ...newLayers]);
                                                setSelectedLayerIds(newLayers.map(l => l.id));
                                                showNotification(`${newLayers.length} capa(s) duplicada(s)`, 'success');
                                            }
                                        }} 
                                        className="p-1.5 hover:bg-white/10 rounded text-bone transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50" 
                                        aria-label="Duplicar selección"
                                        disabled={selectedLayerIds.length === 0}
                                    >
                                        <Copy size={14}/>
                                    </button>
                                </Tooltip>
                                <Tooltip content="Eliminar capas seleccionadas">
                                    <button 
                                        onClick={deleteSelection} 
                                        className="p-1.5 hover:bg-red-500/20 rounded text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50" 
                                        aria-label="Eliminar selección"
                                        disabled={selectedLayerIds.length === 0}
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </Tooltip>
                             </div>
                         </div>

                         <div className="flex-1 overflow-y-auto space-y-1 p-2">
                             {[...layers].reverse().map((l, index) => {
                                 // Reverse index logic: UI list is reversed, so drag index must map correctly.
                                 // Standard map index 0 = Topmost Layer (End of Array).
                                 // Let's use simple HTML5 DnD.
                                 const isSelected = selectedLayerIds.includes(l.id);
                                 return (
                                     <div key={l.id} 
                                          draggable
                                          onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(index)); setDraggedLayerIndex(index); }}
                                          onDragOver={(e) => { e.preventDefault(); }}
                                          onDrop={(e) => {
                                              e.preventDefault();
                                              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                              const toIndex = index;
                                              if (fromIndex !== toIndex) {
                                                  // Because we are mapping reversed array, indices are inverted relative to 'layers' state
                                                  const realFrom = layers.length - 1 - fromIndex;
                                                  const realTo = layers.length - 1 - toIndex;
                                                  
                                                  const newLayers = [...layers];
                                                  const [removed] = newLayers.splice(realFrom, 1);
                                                  newLayers.splice(realTo, 0, removed);
                                                  updateLayers(() => newLayers);
                                              }
                                              setDraggedLayerIndex(null);
                                          }}
                                          className={clsx("flex items-center justify-between p-2 rounded border group select-none transition-all cursor-grab active:cursor-grabbing", isSelected ? "bg-gold/10 border-gold/30" : "bg-black/20 border-transparent hover:bg-white/5", draggedLayerIndex === index && "opacity-50")}
                                          onClick={() => { setSelectedLayerIds([l.id]); setActiveTab('properties'); }}
                                     >
                                         <div className="flex items-center gap-3 overflow-hidden">
                                             <Tooltip content="Arrastra para reordenar">
                                                 <div className="cursor-grab text-bone/20 hover:text-white" aria-label="Arrastrar capa"><GripVertical size={12}/></div>
                                             </Tooltip>
                                             <Tooltip content={isSelected ? "Deseleccionar capa" : "Seleccionar capa"}>
                                                 <button 
                                                     onClick={(e) => { e.stopPropagation(); setSelectedLayerIds(prev => prev.includes(l.id) ? prev.filter(id => id !== l.id) : [...prev, l.id]); }} 
                                                     className="text-bone/20 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                                                     aria-label={isSelected ? "Deseleccionar capa" : "Seleccionar capa"}
                                                     aria-pressed={isSelected}
                                                 >
                                                     {isSelected ? <CheckSquare size={14} className="text-gold"/> : <Square size={14}/>}
                                                 </button>
                                             </Tooltip>
                                             {l.type === 'text' ? <Type className="w-3 h-3 text-bone/50 shrink-0" aria-hidden="true"/> : l.type.includes('shape') || l.type==='rect' ? <Square className="w-3 h-3 text-bone/50 shrink-0" aria-hidden="true"/> : l.type==='drawing' ? <Brush className="w-3 h-3 text-bone/50 shrink-0" aria-hidden="true"/> : <ImageIcon className="w-3 h-3 text-bone/50 shrink-0" aria-hidden="true"/>}
                                             <span className={clsx("text-xs truncate transition-colors", isSelected ? "text-white font-medium" : TEXT_OPACITY.medium)}>{l.text || l.id}</span>
                                         </div>
                                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Tooltip content={l.locked ? "Desbloquear capa" : "Bloquear capa"}>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { locked: !l.locked }); }} 
                                                    className={clsx("p-1 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 rounded", l.locked ? "text-gold opacity-100" : "text-bone/20")}
                                                    aria-label={l.locked ? "Desbloquear capa" : "Bloquear capa"}
                                                    aria-pressed={l.locked}
                                                >
                                                    <Lock className="w-3 h-3"/>
                                                </button>
                                            </Tooltip>
                                            <Tooltip content={l.visible ? "Ocultar capa" : "Mostrar capa"}>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { visible: !l.visible }); }} 
                                                    className={clsx("p-1 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 rounded", !l.visible ? "text-bone/20 opacity-100" : "text-bone/50")}
                                                    aria-label={l.visible ? "Ocultar capa" : "Mostrar capa"}
                                                    aria-pressed={l.visible}
                                                >
                                                    <Eye className="w-3 h-3"/>
                                                </button>
                                            </Tooltip>
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                    </div>
                    </motion.div>
                )}
                
                {activeTab === 'properties' && (
                    <motion.div
                        key="properties"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 overflow-y-auto p-5 no-scrollbar pb-20"
                    >
                    {['brush', 'eraser', 'line'].includes(activeTool) ? (
                         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                 <span className="text-[10px] text-bone/30 font-bold uppercase">{activeTool === 'eraser' ? 'Borrador' : activeTool === 'image' ? 'Imagen' : 'Pincel'} Configuración</span>
                             </div>
                             <div className="space-y-4">
                                  {activeTool === 'brush' && (
                                      <div className="space-y-2">
                                           <div className="flex justify-between"><label className="text-[10px] font-bold uppercase text-bone/50">Color</label></div>
                                           <div className="flex gap-2 items-center flex-wrap">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
                                                    <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer" value={brushState.color} 
                                                        onChange={e => setBrushState(prev => ({ ...prev, color: e.target.value }))} 
                                                        onBlur={e => addToRecentColors(e.target.value)}
                                                        aria-label="Color del pincel"
                                                    />
                                                </div>
                                                <div className="flex gap-1">
                                                    {recentColors.slice(0, 5).map(c => (
                                                        <button 
                                                            key={c} 
                                                            onClick={() => setBrushState(prev => ({ ...prev, color: c }))} 
                                                            className="w-4 h-4 rounded-full border border-white/10 hover:scale-110 transition-transform" 
                                                            style={{backgroundColor:c}} 
                                                            aria-label={`Seleccionar color ${c}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setShowSuggestedColors(!showSuggestedColors)} 
                                                        className="text-[10px] px-2 py-1 border border-white/10 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                                        aria-label="Mostrar colores sugeridos"
                                                    >
                                                        Sugeridos
                                                    </button>
                                                    {showSuggestedColors && (
                                                        <div className="absolute top-full left-0 mt-2 bg-abyss-panel border border-white/10 rounded-lg p-2 shadow-xl z-50 flex gap-2">
                                                            {SUGGESTED_COLORS.map(c => (
                                                                <Tooltip key={c.value} content={c.name} side="top">
                                                                    <button
                                                                        onClick={() => {
                                                                            setBrushState(prev => ({ ...prev, color: c.value }));
                                                                            addToRecentColors(c.value);
                                                                            setShowSuggestedColors(false);
                                                                        }}
                                                                        className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                                                                        style={{backgroundColor: c.value}}
                                                                        aria-label={c.name}
                                                                    />
                                                                </Tooltip>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                           </div>
                                      </div>
                                  )}
                                  
                                   {/* BRUSH & ERASER CONTROLS */}
                                   <div className="space-y-4">
                                       <RangeControl label="Tamaño" value={brushState.size} min={1} max={100} onChange={(v: number) => setBrushState(prev => ({ ...prev, size: v }))} />
                                       {(activeTool === 'brush' || activeTool === 'eraser') && (
                                           <>
                                                <RangeControl label="Dureza" value={100 - (brushState.blur * 5)} min={0} max={100} onChange={(v: number) => setBrushState(prev => ({ ...prev, blur: (100 - v)/5 }))} />
                                                <RangeControl label="Opacidad" value={brushState.opacity} min={1} max={100} onChange={(v: number) => setBrushState(prev => ({ ...prev, opacity: v }))} />
                                           </>
                                       )}
                                       <div className="p-3 bg-white/5 rounded text-[10px] text-bone/50">
                                           Consejo: {activeTool==='eraser' ? 'Usa el borrador para pintar sobre contenido.' : 'Dibuja libremente.'}
                                       </div>
                                   </div>
                             </div>
                         </div>
                    ) : selectedLayer ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[10px] text-bone/30 font-bold uppercase">{multiSelection ? `${selectedLayerIds.length} Elementos Seleccionados` : `Propiedades de ${selectedLayer?.type ?? 'capa'}`}</span>
                            {multiSelection && <span className="text-[9px] text-gold">Las acciones se aplican a la selección principal</span>}
                        </div>
                        
                        {/* TEXT PROPS */}
                        {selectedLayer?.type === 'text' && (
                             <div className="space-y-4">
                                 <textarea value={selectedLayer.text} onChange={e => updateLayer(selectedLayer.id, { text: e.target.value })} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-bone focus:border-gold outline-none resize-none" rows={2}/>
                                 
                                 <div className="space-y-2">
                                     <div className="flex justify-between"><label className="text-[10px] font-bold uppercase text-bone/50">Color</label></div>
                                     <div className="flex gap-2 items-center">
                                          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
                                              <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer" value={selectedLayer.color || '#ffffff'} 
                                                  onChange={e => updateLayer(selectedLayer.id, { color: e.target.value })} 
                                              />
                                          </div>
                                     </div>
                                 </div>

                                 <div className="space-y-2">
                                     <label className="text-[10px] font-bold uppercase text-bone/50">Fuente</label>
                                     <select 
                                         value={selectedLayer.fontFamily || FONT_OPTIONS[0].value}
                                         onChange={e => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                                         className="w-full bg-black/30 border border-white/10 rounded p-2 text-xs text-bone focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                                         aria-label="Seleccionar fuente"
                                     >
                                         {FONT_OPTIONS.map(f => (
                                             <option key={f.value} value={f.value}>{f.label}</option>
                                         ))}
                                     </select>
                                 </div>

                                 <RangeControl label="Tamaño" value={selectedLayer.fontSize||10} min={10} max={400} onChange={(v: number) => updateLayer(selectedLayer.id, {fontSize:v})} />
                                 <RangeControl label="Espaciado" value={selectedLayer.letterSpacing||0} min={-100} max={100} onChange={(v: number) => updateLayer(selectedLayer.id, {letterSpacing:v})} />
                                 <div className="flex items-center gap-2">
                                     <div className="flex-1">
                                         <RangeControl label="Curva" value={(selectedLayer as any).curve||0} min={-180} max={180} onChange={(v: number) => updateLayer(selectedLayer.id, {curve:v})} />
                                     </div>
                                     <button 
                                         onClick={() => updateLayer(selectedLayer.id, {curve: 0})} 
                                         className="px-2 py-1 text-[10px] border border-white/10 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                         aria-label="Resetear curva a 0"
                                     >
                                         Reset
                                     </button>
                                 </div>
                                 <RangeControl label="Sombra" value={(selectedLayer as any).shadowBlur||0} min={0} max={50} onChange={(v: number) => updateLayer(selectedLayer.id, {shadowBlur:v})} />
                                 <RangeControl label="Brillo" value={selectedLayer.glowIntensity||0} min={0} max={100} onChange={(v: number) => updateLayer(selectedLayer.id, {glowIntensity:v})} />

                                 <div className="grid grid-cols-2 gap-2">
                                     <button onClick={() => updateLayer(selectedLayer.id, { fontWeight: selectedLayer.fontWeight==='bold'?'normal':'bold' })} className={clsx("p-2 rounded border", selectedLayer.fontWeight==='bold' ? "border-gold text-gold" : "border-white/10 text-bone/50")}><Bold className="w-4 h-4 mx-auto"/></button>
                                     <button onClick={() => updateLayer(selectedLayer.id, { fontStyle: selectedLayer.fontStyle==='italic'?'normal':'italic' })} className={clsx("p-2 rounded border", selectedLayer.fontStyle==='italic' ? "border-gold text-gold" : "border-white/10 text-bone/50")}><Italic className="w-4 h-4 mx-auto"/></button>
                                 </div>
                             </div>
                        )}

                        {/* IMAGE FILTERS */}
                        {selectedLayer?.type === 'image' && (
                             <div className="space-y-4">
                                 <div className="flex justify-between items-center text-[10px] text-bone/50 font-bold uppercase">Filtros <button onClick={()=>updateLayer(selectedLayer.id, {filters:{brightness:100,contrast:100,saturation:100,blur:0,preset:''}})} className="text-gold hover:text-white">Restablecer</button></div>
                                 <div className="flex flex-wrap gap-2">
                                     {FILTER_PRESETS.map(f => (
                                         <button key={f.label} onClick={() => updateLayer(selectedLayer.id, { filters: { ...selectedLayer.filters!, preset: f.value } })} className={clsx("px-2 py-1 text-[10px] border rounded", selectedLayer.filters?.preset === f.value ? "border-gold text-gold" : "border-white/10 text-bone/40")}>{f.label}</button>
                                     ))}
                                 </div>
                                 <div className="h-px bg-white/5 my-2"/>
                                 <RangeControl label="Brillo" value={selectedLayer.filters?.brightness ?? 100} min={0} max={200} onChange={(v: number) => updateLayer(selectedLayer.id, { filters: { ...selectedLayer.filters!, brightness: v } })} />
                                 <RangeControl label="Contraste" value={selectedLayer.filters?.contrast ?? 100} min={0} max={200} onChange={(v: number) => updateLayer(selectedLayer.id, { filters: { ...selectedLayer.filters!, contrast: v } })} />
                                 <RangeControl label="Saturación" value={selectedLayer.filters?.saturation ?? 100} min={0} max={200} onChange={(v: number) => updateLayer(selectedLayer.id, { filters: { ...selectedLayer.filters!, saturation: v } })} />
                                 <RangeControl label="Desenfoque" value={selectedLayer.filters?.blur ?? 0} min={0} max={20} onChange={(v: number) => updateLayer(selectedLayer.id, { filters: { ...selectedLayer.filters!, blur: v } })} />
                             </div>
                        )}

                        {/* VECTOR (Rect, Circle, Triangle, Polygon, Line) PROPS */}
                        {selectedLayer && (['rect','circle','triangle','polygon','line'].includes(selectedLayer.type)) && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-bone/50">Tipo de Forma</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['rect','circle','triangle','polygon','line'] as LayerType[]).map(t => (
                                            <button key={t} onClick={() => selectedLayer && updateLayer(selectedLayer.id, { type: t })} className={clsx("p-2 rounded border text-xs capitalize", selectedLayer?.type === t ? "border-gold text-gold" : "border-white/10 text-bone/50 hover:bg-white/5")}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* POLYGON SIDES */}
                                {selectedLayer?.type === 'polygon' && (
                                    <RangeControl label="Lados" value={selectedLayer.sides||5} min={3} max={12} onChange={(v: number) => updateLayer(selectedLayer.id, {sides:v})} />
                                )}

                                {/* Dimensions */}
                                <div className="grid grid-cols-2 gap-2">
                                     <div className="space-y-1">
                                         <label className="text-[9px] text-bone/40 uppercase">Ancho</label>
                                         <input type="number" value={Math.round(selectedLayer?.width||0)} onChange={e => {
                                             if (!selectedLayer) return;
                                             const w = Number(e.target.value);
                                             const h = selectedLayer.aspectLocked ? w * ((selectedLayer.height||1)/(selectedLayer.width||1)) : (selectedLayer.height||100);
                                              updateLayer(selectedLayer.id, {width:w, height:h});
                                         }} className="w-full bg-black/20 border border-white/10 rounded p-1 text-xs"/>
                                     </div>
                                     <div className="space-y-1 relative">
                                         <label className="text-[9px] text-bone/40 uppercase">Alto</label>
                                         <input type="number" value={Math.round(selectedLayer?.height||0)} onChange={e => selectedLayer && updateLayer(selectedLayer.id, {height: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 rounded p-1 text-xs"/>
                                         <button onClick={() => selectedLayer && updateLayer(selectedLayer.id, {aspectLocked: !selectedLayer.aspectLocked})} className={clsx("absolute -left-3 top-6", selectedLayer?.aspectLocked ? "text-gold" : "text-bone/20")} >{selectedLayer?.aspectLocked ? <Link className="w-3 h-3"/> : <Unlink className="w-3 h-3"/>}</button>
                                     </div>
                                </div>

                                {/* FILL */}
                                {selectedLayer?.type !== 'line' && (
                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase text-bone/50">Relleno</label>
                                            <button onClick={() => selectedLayer && updateLayer(selectedLayer.id, {fill: !selectedLayer.fill})} className={clsx("w-8 h-4 rounded-full relative transition-colors", selectedLayer?.fill ? "bg-gold" : "bg-white/10")}><div className={clsx("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-all", selectedLayer?.fill ? "left-4.5" : "left-0.5")}/></button>
                                        </div>
                                        {selectedLayer?.fill && (
                                            <div className="flex gap-2 items-center">
                                                 <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
                                                     <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer" value={selectedLayer.fillColor||'#fff'} 
                                                         onChange={e => updateLayer(selectedLayer.id, {fillColor:e.target.value})} 
                                                         onBlur={e => addToRecentColors(e.target.value)} 
                                                     />
                                                 </div>
                                                 <div className="flex flex-wrap gap-1">
                                                     {recentColors.slice(0,5).map(c => <button key={c} onClick={() => selectedLayer && updateLayer(selectedLayer.id, {fillColor: c})} className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor:c}}/>)}
                                                 </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STROKE */}
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase text-bone/50">Trazo</label>
                                        <button onClick={() => selectedLayer && updateLayer(selectedLayer.id, {stroke: !selectedLayer.stroke})} className={clsx("w-8 h-4 rounded-full relative transition-colors", selectedLayer?.stroke ? "bg-gold" : "bg-white/10")}><div className={clsx("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-all", selectedLayer?.stroke ? "left-4.5" : "left-0.5")}/></button>
                                    </div>
                                    {selectedLayer?.stroke && (
                                        <div className="space-y-2">
                                            <div className="flex gap-2 items-center">
                                                 <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
                                                     <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer" value={selectedLayer.strokeColor||'#fff'} 
                                                         onChange={e => updateLayer(selectedLayer.id, {strokeColor:e.target.value})} 
                                                         onBlur={e => addToRecentColors(e.target.value)}
                                                     />
                                                 </div>
                                                 <RangeControl label="" value={selectedLayer.strokeWidth||1} min={1} max={20} onChange={(v: number) => updateLayer(selectedLayer.id, {strokeWidth:v})} />
                                            </div>
                                            <div className="flex gap-1">
                                                {STROKE_STYLES.map(s => (
                                                    <button key={s.label} onClick={() => selectedLayer && updateLayer(selectedLayer.id, {strokeDash: s.value})} className={clsx("px-2 py-1 text-[9px] border rounded", selectedLayer?.strokeDash?.toString() === s.value.toString() ? "border-gold text-gold" : "border-white/10 text-bone/40")}>{s.label}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 mt-4">
                            <button onClick={() => {
                                const newLayers = selectedLayerIds.map(id => {
                                    const l = layers.find(x => x.id === id);
                                    if(!l) return null;
                                    return { ...l, id: `${l.type}_copy_${Date.now()}_${generateId()}`, x: l.x+20, y: l.y+20 };
                                }).filter(Boolean) as Layer[];
                                updateLayers(prev => [...prev, ...newLayers]);
                                setSelectedLayerIds(newLayers.map(l => l.id));
                            }} className="flex-1 py-3 bg-white/5 text-bone rounded-lg text-xs font-bold hover:bg-white/10 transition-colors uppercase flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4"/> Duplicar
                            </button>
                            <button onClick={deleteSelection} className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors uppercase flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4"/> Eliminar
                            </button>
                        </div>
                    </div>
                ) : activeTool === 'text' && !selectedLayer ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[10px] text-bone/30 font-bold uppercase">Nueva Capa de Texto</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-3 bg-white/5 rounded text-[10px] text-bone/50 mb-2">
                                Configura las propiedades antes de hacer clic en el canvas para crear texto.
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between"><label className="text-[10px] font-bold uppercase text-bone/50">Color</label></div>
                                <div className="flex gap-2 items-center flex-wrap">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
                                        <input 
                                            type="color" 
                                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer" 
                                            value={tempTextProps.color} 
                                            onChange={e => {
                                                setTempTextProps(prev => ({ ...prev, color: e.target.value }));
                                                addToRecentColors(e.target.value);
                                            }}
                                            aria-label="Color del texto"
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        {recentColors.slice(0, 5).map(c => (
                                            <button 
                                                key={c} 
                                                onClick={() => setTempTextProps(prev => ({ ...prev, color: c }))} 
                                                className="w-4 h-4 rounded-full border border-white/10 hover:scale-110 transition-transform" 
                                                style={{backgroundColor:c}} 
                                                aria-label={`Seleccionar color ${c}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowSuggestedColors(!showSuggestedColors)} 
                                            className="text-[10px] px-2 py-1 border border-white/10 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                            aria-label="Mostrar colores sugeridos"
                                        >
                                            Sugeridos
                                        </button>
                                        {showSuggestedColors && (
                                            <div className="absolute top-full left-0 mt-2 bg-abyss-panel border border-white/10 rounded-lg p-2 shadow-xl z-50 flex gap-2">
                                                {SUGGESTED_COLORS.map(c => (
                                                    <Tooltip key={c.value} content={c.name} side="top">
                                                        <button
                                                            onClick={() => {
                                                                setTempTextProps(prev => ({ ...prev, color: c.value }));
                                                                addToRecentColors(c.value);
                                                                setShowSuggestedColors(false);
                                                            }}
                                                            className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                                                            style={{backgroundColor: c.value}}
                                                            aria-label={c.name}
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <RangeControl 
                                label="Tamaño" 
                                value={tempTextProps.fontSize} 
                                min={10} 
                                max={400} 
                                onChange={(v: number) => setTempTextProps(prev => ({ ...prev, fontSize: v }))} 
                            />
                            <RangeControl 
                                label="Espaciado" 
                                value={tempTextProps.letterSpacing} 
                                min={-100} 
                                max={100} 
                                onChange={(v: number) => setTempTextProps(prev => ({ ...prev, letterSpacing: v }))} 
                            />
                            
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => setTempTextProps(prev => ({ ...prev, fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' }))} 
                                    className={clsx("p-2 rounded border", tempTextProps.fontWeight === 'bold' ? "border-gold text-gold" : "border-white/10 text-bone/50")}
                                >
                                    <Bold className="w-4 h-4 mx-auto"/>
                                </button>
                                <button 
                                    onClick={() => setTempTextProps(prev => ({ ...prev, fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' }))} 
                                    className={clsx("p-2 rounded border", tempTextProps.fontStyle === 'italic' ? "border-gold text-gold" : "border-white/10 text-bone/50")}
                                >
                                    <Italic className="w-4 h-4 mx-auto"/>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : activeTool === 'image' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                             <h4 className="text-sm font-medium text-white mb-2">Fondo del Canvas</h4>
                             <div onClick={() => fileInputRef.current?.click()} className="h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 bg-black/20 group relative overflow-hidden transition-all">
                                 {backgroundState.image ? (
                                     <img src={backgroundState.image} loading="lazy" className="h-full object-contain opacity-50" alt="Fondo del canvas"/>
                                 ) : (
                                     <div className="flex flex-col items-center gap-2 text-bone/30 group-hover:text-gold transition-colors">
                                         <Instagram className="w-8 h-8"/>
                                         <span className="text-[10px] uppercase font-bold tracking-widest">Clic para Subir</span>
                                     </div>
                                 )}
                                 <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 <input type="file" ref={fileInputRef} className="hidden" onChange={handleBgUpload} accept="image/*" aria-label="Subir imagen de fondo" />
                             </div>
                         </div>
                         
                         {backgroundState.image && (
                             <div className="p-4 bg-white/5 rounded-lg space-y-4">
                                 {/* Tabs Navigation */}
                                 <div className="flex gap-2 border-b border-white/5 pb-2">
                                     <button 
                                         onClick={() => setActiveBgModal('config')} 
                                         className={clsx("text-[10px] font-bold uppercase px-3 py-1.5 rounded-t transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50", activeBgModal === 'config' ? "text-white border-b-2 border-gold" : TEXT_OPACITY.low)}
                                         aria-label="Configuración de fondo"
                                         aria-pressed={activeBgModal === 'config'}
                                     >
                                         Fondo
                                     </button>
                                     <button 
                                         onClick={() => setActiveBgModal('filters')} 
                                         className={clsx("text-[10px] font-bold uppercase px-3 py-1.5 rounded-t transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50", activeBgModal === 'filters' ? "text-white border-b-2 border-gold" : TEXT_OPACITY.low)}
                                         aria-label="Filtros"
                                         aria-pressed={activeBgModal === 'filters'}
                                     >
                                         Filtros
                                     </button>
                                     <button 
                                         onClick={() => setActiveBgModal('adjustments')} 
                                         className={clsx("text-[10px] font-bold uppercase px-3 py-1.5 rounded-t transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50", activeBgModal === 'adjustments' ? "text-white border-b-2 border-gold" : TEXT_OPACITY.low)}
                                         aria-label="Ajustes de imagen"
                                         aria-pressed={activeBgModal === 'adjustments'}
                                     >
                                         Ajustes
                                     </button>
                                 </div>

                                 {/* Modal 1: Configuración de Fondo */}
                                 {activeBgModal === 'config' && (
                                     <div className="space-y-4">
                                         <div className="flex items-center justify-between">
                                             <span className="text-xs font-bold text-white">Fondo</span>
                                             <button 
                                                 onClick={() => setBackgroundState(prev => ({ ...prev, locked: !prev.locked }))} 
                                                 className={clsx("text-xs flex items-center gap-1 px-2 py-1 rounded", backgroundState.locked ? "text-gold bg-gold/10" : "text-bone/40 hover:text-bone")} 
                                                 aria-label={backgroundState.locked ? "Desbloquear fondo" : "Bloquear fondo"}
                                             >
                                                 {backgroundState.locked ? <><Lock className="w-3 h-3"/> Bloqueado</> : <><Unlock className="w-3 h-3"/> Desbloqueado</>}
                                             </button>
                                         </div>
                                         <RangeControl label="Escala" value={backgroundState.scale} min={0.1} max={3} onChange={(v: number) => setBackgroundState(prev => ({ ...prev, scale: v }))} />
                                     </div>
                                 )}

                                 {/* Modal 2: Filtros */}
                                 {activeBgModal === 'filters' && (
                                     <div className="space-y-4">
                                         <div className="flex justify-between items-center">
                                             <span className="text-[10px] text-bone/50 font-bold uppercase">Filtros</span>
                                             <button 
                                                 onClick={() => {
                                                     setBackgroundState(prev => ({ ...prev, filters: {brightness:100,contrast:100,saturation:100,blur:0,preset:''} }));
                                                     setFilterIntensity(100);
                                                 }} 
                                                 className="text-gold hover:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 rounded px-1 text-[10px]"
                                                 aria-label="Restablecer filtros"
                                             >
                                                 Reset
                                             </button>
                                         </div>
                                         <div className="grid grid-cols-2 gap-2">
                                             {FILTER_PRESETS.map(f => (
                                                 <button 
                                                     key={f.label} 
                                                     onClick={() => setBackgroundState(prev => ({ ...prev, filters: { ...prev.filters, preset: f.value } }))} 
                                                     className={clsx("px-2 py-1.5 text-[10px] border rounded focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors", backgroundState.filters.preset === f.value ? "border-gold text-gold bg-gold/10" : "border-white/10 text-bone/40 hover:bg-white/5")} 
                                                     aria-label={`Aplicar filtro ${f.label}`}
                                                 >
                                                     {f.label}
                                                 </button>
                                             ))}
                                         </div>
                                         {backgroundState.filters.preset && (
                                             <div className="space-y-2 pt-2 border-t border-white/5">
                                                 <RangeControl 
                                                     label="Intensidad" 
                                                     value={filterIntensity} 
                                                     min={0} 
                                                     max={100} 
                                                     onChange={(v: number) => setFilterIntensity(v)} 
                                                 />
                                             </div>
                                         )}
                                     </div>
                                 )}

                                 {/* Modal 3: Ajustes de Imagen */}
                                 {activeBgModal === 'adjustments' && (
                                     <div className="space-y-4">
                                         <div className="text-[10px] text-bone/50 font-bold uppercase">Ajustes de imagen</div>
                                         <div className="space-y-3">
                                             <RangeControl label="Brillo" value={backgroundState.filters.brightness} min={0} max={200} onChange={(v: number) => setBackgroundState(prev => ({ ...prev, filters: { ...prev.filters, brightness: v } }))} />
                                             <RangeControl label="Contraste" value={backgroundState.filters.contrast} min={0} max={200} onChange={(v: number) => setBackgroundState(prev => ({ ...prev, filters: { ...prev.filters, contrast: v } }))} />
                                             <RangeControl label="Saturación" value={backgroundState.filters.saturation} min={0} max={200} onChange={(v: number) => setBackgroundState(prev => ({ ...prev, filters: { ...prev.filters, saturation: v } }))} />
                                             <RangeControl label="Desenfoque" value={backgroundState.filters.blur} min={0} max={20} onChange={(v: number) => setBackgroundState(prev => ({ ...prev, filters: { ...prev.filters, blur: v } }))} />
                                         </div>
                                     </div>
                                 )}
                             </div>
                         )}
                    </div>
                ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* CANVAS */}
        <div className="flex-1 relative bg-[#050508] overflow-hidden flex flex-col items-center justify-center" onMouseDown={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-4 right-4 z-40 bg-abyss-panel border border-white/10 rounded-lg p-1 flex items-center gap-1 shadow-2xl">
                 <Tooltip content="Ajustar a pantalla" side="bottom">
                     <button 
                         onClick={() => {
                             const frame = document.getElementById('canvas-frame');
                             if (frame) {
                                 const container = frame.parentElement;
                                 if (container) {
                                     const containerRect = container.getBoundingClientRect();
                                     const scaleX = (containerRect.width * 0.9) / activePreset.width;
                                     const scaleY = (containerRect.height * 0.9) / activePreset.height;
                                     const newZoom = Math.min(scaleX, scaleY, 1);
                                     setZoom(newZoom);
                                     setViewportOffset({ x: 0, y: 0 });
                                 }
                             }
                         }} 
                         className="p-1.5 flex items-center justify-center text-bone/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                         aria-label="Ajustar a pantalla"
                     >
                         <Maximize2 className="w-3.5 h-3.5" />
                     </button>
                 </Tooltip>
                 <Tooltip content="Restablecer vista" side="bottom">
                     <button 
                         onClick={() => {
                             setZoom(0.4);
                             setViewportOffset({ x: 0, y: 0 });
                         }} 
                         className="p-1.5 flex items-center justify-center text-bone/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                         aria-label="Restablecer vista"
                     >
                         <ResetIcon className="w-3.5 h-3.5" />
                     </button>
                 </Tooltip>
                 <Separator orientation="vertical" spacing="sm" className="h-6" />
                 <Tooltip content="Mostrar/ocultar grid" side="bottom">
                     <button 
                         onClick={() => setShowGrid(!showGrid)} 
                         className={clsx("p-1.5 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-gold/50", showGrid ? "text-gold" : "text-bone/50 hover:text-bone")}
                         aria-label={showGrid ? "Ocultar grid" : "Mostrar grid"}
                         aria-pressed={showGrid}
                     >
                         <Grid className="w-3.5 h-3.5" />
                     </button>
                 </Tooltip>
                 <Separator orientation="vertical" spacing="sm" className="h-6" />
                 <Tooltip content="Alejar" side="bottom">
                     <button 
                         onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} 
                         className="w-6 h-6 flex items-center justify-center text-bone/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                         aria-label="Alejar"
                     >
                         <Minus className="w-3 h-3" />
                     </button>
                 </Tooltip>
                 <span className="text-[10px] font-mono text-white w-10 text-center" aria-label={`Zoom: ${Math.round(zoom * 100)}%`}>{Math.round(zoom * 100)}%</span>
                 <Tooltip content="Acercar" side="bottom">
                     <button 
                         onClick={() => setZoom(z => Math.min(2, z + 0.1))} 
                         className="w-6 h-6 flex items-center justify-center text-bone/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                         aria-label="Acercar"
                     >
                         <Plus className="w-3 h-3" />
                     </button>
                 </Tooltip>
            </div>
            
            <div 
                className={clsx("relative w-full h-full overflow-hidden touch-none", (isPanning||isSpacePressed) ? "cursor-grab active:cursor-grabbing" : activeTool==='brush' ? "cursor-none" : activeTool==='eraser' ? "cursor-none" : "cursor-default")} 
                onPointerDown={(e) => handlePointerDown(e, 'pan')}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onContextMenu={(e) => {
                    e.preventDefault();
                    const layerId = (e.target as HTMLElement).closest('[data-layer-id]')?.getAttribute('data-layer-id');
                    if (layerId) {
                        const layer = layers.find(l => l.id === layerId);
                        if (layer) {
                            setContextMenu({ x: e.clientX, y: e.clientY, layerId });
                        }
                    } else {
                        setContextMenu({ x: e.clientX, y: e.clientY });
                    }
                }}
            >
                {/* Custom Brush Cursor */}
                {(activeTool === 'brush' || activeTool === 'eraser') && (
                    <div 
                        className="fixed pointer-events-none rounded-full border border-white z-[100]"
                        style={{
                            left: cursorPos.x,
                            top: cursorPos.y,
                            width: Math.max(10, (activeTool === 'eraser' ? brushState.size * 2 : brushState.size) * zoom),
                            height: Math.max(10, (activeTool === 'eraser' ? brushState.size * 2 : brushState.size) * zoom),
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)'
                        }}
                    />
                )}

                {/* Grid & Guides */}
                {showGrid && (
                    <div 
                        className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                            backgroundSize: `${40 * zoom}px ${40 * zoom}px`, 
                            transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px)`,
                            willChange: 'transform'
                        }} 
                    />
                )}
                {snapGuides.x !== undefined && <div className="absolute top-0 bottom-0 w-px bg-fuchsia-500 z-50 transition-none" style={{ left: '50%', transform: `translate(${viewportOffset.x}px, 0)` }} />}
                {snapGuides.y !== undefined && <div className="absolute left-0 right-0 h-px bg-fuchsia-500 z-50 transition-none" style={{ top: '50%', transform: `translate(0, ${viewportOffset.y}px)` }} />}

                {/* ARTBOARD */}
                <div id="canvas-frame" className="absolute shadow-2xl bg-abyss overflow-hidden" onPointerDown={(e) => handlePointerDown(e, 'bg')}
                    style={{ left: '50%', top: '50%', width: activePreset.width, height: activePreset.height, transform: `translate(-50%, -50%) translate(${viewportOffset.x}px, ${viewportOffset.y}px) scale(${zoom})` }}
                >
                    {backgroundState.image && (() => {
                        const presetFilter = applyFilterWithIntensity(backgroundState.filters.preset || '', filterIntensity);
                        const adjustmentsFilter = `brightness(${backgroundState.filters.brightness / 100}) contrast(${backgroundState.filters.contrast / 100}) saturate(${backgroundState.filters.saturation / 100}) blur(${backgroundState.filters.blur}px)`;
                        const combinedFilter = [presetFilter, adjustmentsFilter].filter(Boolean).join(' ');
                        return (
                            <img 
                                src={backgroundState.image} 
                                loading="lazy" 
                                className="absolute inset-0 origin-top-left pointer-events-none select-none max-w-none" 
                                alt="Fondo" 
                                style={{ 
                                    transform: `translate(${backgroundState.offset.x}px, ${backgroundState.offset.y}px) scale(${backgroundState.scale})`, 
                                    filter: combinedFilter || 'none'
                                }} 
                            />
                        );
                    })()}
                    
                    {layers.map(l => l.visible && (
                        <div 
                            key={l.id} 
                            data-layer-id={l.id}
                            onPointerDown={(e) => handlePointerDown(e, 'layer', l.id)}
                            onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(l.id); }}
                            className={clsx("absolute group select-none", !l.locked && activeTool==='select' && "cursor-move", (activeTool==='brush' || activeTool==='eraser' || activeTool==='line') && "pointer-events-none")}
                            style={{ left: l.x, top: l.y, transform: `translate(-50%, -50%) rotate(${l.rotation}deg) scale(${l.scale})` }}
                            aria-label={`Capa ${l.type}${l.text ? `: ${l.text}` : ''}`}
                        >
                            {/* MASK DEFINITION */}
                            {l.maskStrokes && l.maskStrokes.length > 0 && (
                                <svg className="absolute w-0 h-0 pointer-events-none">
                                    <defs>
                                        <mask id={`mask_${l.id}`} maskUnits="userSpaceOnUse">
                                            <rect x="-5000" y="-5000" width="10000" height="10000" fill="white" />
                                            {l.maskStrokes.map((s, i) => (
                                                <polyline key={i} points={s.points.map(p => `${p.x},${p.y}`).join(' ')} stroke="black" strokeWidth={s.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            ))}
                                        </mask>
                                    </defs>
                                </svg>
                            )}

                            {/* TEXT WITH CURVE */}
                            {l.type === 'text' && (
                                l.curve ? (() => {
                                    const textLength = l.text?.length || 0;
                                    const fontSize = l.fontSize || 120;
                                    const estimatedWidth = Math.max(200, textLength * fontSize * 0.6);
                                    const curveHeight = Math.abs(l.curve || 0);
                                    const svgHeight = fontSize + curveHeight + fontSize * 0.5;
                                    const svgWidth = estimatedWidth;
                                    const midX = svgWidth / 2;
                                    const baseY = fontSize + curveHeight * 0.5;
                                    const curveY = baseY - (l.curve || 0);
                                    
                                    return (
                                        <svg 
                                            width={svgWidth} 
                                            height={svgHeight} 
                                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                            style={{ overflow: 'visible' }}
                                        >
                                            <defs>
                                                {l.shadowBlur && (
                                                    <filter id={`shadow_${l.id}`}>
                                                        <feGaussianBlur in="SourceAlpha" stdDeviation={l.shadowBlur / 2} />
                                                        <feOffset dx="0" dy="0" result="offsetblur" />
                                                        <feComponentTransfer>
                                                            <feFuncA type="linear" slope="0.5" />
                                                        </feComponentTransfer>
                                                        <feMerge>
                                                            <feMergeNode />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                )}
                                            </defs>
                                            <path 
                                                id={`curve_${l.id}`} 
                                                d={`M 0,${baseY} Q ${midX},${curveY} ${svgWidth},${baseY}`} 
                                                fill="none" 
                                                stroke="transparent"
                                            />
                                            <text 
                                                style={{ 
                                                    fontSize: fontSize, 
                                                    fontFamily: l.fontFamily || 'inherit', 
                                                    fill: l.color || '#ffffff', 
                                                    opacity: l.opacity || 1, 
                                                    fontWeight: l.fontWeight || 'normal', 
                                                    fontStyle: l.fontStyle || 'normal',
                                                    filter: l.shadowBlur ? `url(#shadow_${l.id})` : undefined
                                                }}
                                            >
                                                <textPath href={`#curve_${l.id}`} startOffset="50%" textAnchor="middle">
                                                    {l.text || ''}
                                                </textPath>
                                            </text>
                                        </svg>
                                    );
                                })() : (
                                    <div style={{ color:l.color, fontSize:l.fontSize, fontFamily:l.fontFamily, opacity:l.opacity, whiteSpace:'nowrap', letterSpacing:l.letterSpacing, textAlign:l.textAlign, fontWeight:l.fontWeight, fontStyle:l.fontStyle, textShadow: l.shadowBlur ? `0 0 ${l.shadowBlur}px ${l.color}` : undefined, filter: l.glowIntensity ? `drop-shadow(0 0 ${l.glowIntensity/5}px ${l.color})` : undefined, mask: l.maskStrokes?.length ? `url(#mask_${l.id})` : undefined }}>{l.text}</div>
                                )
                            )}
                            
                            {l.type === 'image' && l.src && (
                                <div style={{ mask: l.maskStrokes?.length ? `url(#mask_${l.id})` : undefined }}>
                                    <img 
                                        src={l.src} 
                                        loading="lazy"
                                        style={{
                                            width: l.width, 
                                            height: l.height,
                                            filter: l.filters ? `${l.filters.preset || ''} brightness(${(l.filters.brightness || 100) / 100}) contrast(${(l.filters.contrast || 100) / 100}) saturate(${(l.filters.saturation || 100) / 100}) blur(${l.filters.blur || 0}px)`.trim() : undefined
                                        }} 
                                        className="pointer-events-none block"
                                    />
                                </div>
                            )}
                            
                            {/* SHAPES */}
                            {(['rect','circle','triangle', 'polygon'].includes(l.type)) && (
                                <div style={{
                                    width: l.width, height: l.height,
                                    backgroundColor: l.fill ? l.fillColor : 'transparent',
                                    border: (l.stroke && l.type!=='triangle'&&l.type!=='polygon') ? `${l.strokeWidth}px ${l.strokeDash?.length?'dashed':'solid'} ${l.strokeColor}` : 'none',
                                    borderRadius: l.type === 'circle' ? '50%' : 0,
                                    // Masking for shapes
                                    mask: l.maskStrokes?.length ? `url(#mask_${l.id})` : undefined,
                                    clipPath: l.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : l.type === 'polygon' ? `polygon(${Array.from({length: l.sides||5}).map((_,i) => {
                                        const angle = (i * 2 * Math.PI) / (l.sides||5) - Math.PI/2;
                                        return `${50 + 50 * Math.cos(angle)}% ${50 + 50 * Math.sin(angle)}%`;
                                    }).join(',')})` : undefined,
                                }}>
                                    {/* SVG Overlay for Triangle & Polygon Stroke */}
                                    {(l.type === 'triangle' || l.type === 'polygon') && l.stroke && (
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{overflow:'visible'}} viewBox="0 0 100 100" preserveAspectRatio="none">
                                            {l.type === 'triangle' ? (
                                                <polygon points="50,0 0,100 100,100" fill="none" stroke={l.strokeColor} strokeWidth={(l.strokeWidth||1)*(100/(l.width||100))} strokeDasharray={l.strokeDash?.join(',')}/>
                                            ) : (
                                                <polygon points={Array.from({length: l.sides||5}).map((_,i) => {
                                                    const angle = (i * 2 * Math.PI) / (l.sides||5) - Math.PI/2;
                                                    return `${50 + 50 * Math.cos(angle)},${50 + 50 * Math.sin(angle)}`;
                                                }).join(' ')} fill="none" stroke={l.strokeColor} strokeWidth={(l.strokeWidth||1)*(100/(l.width||100))} vectorEffect="non-scaling-stroke" strokeDasharray={l.strokeDash?.join(',')}/>
                                            )}
                                        </svg>
                                    )}
                                </div>
                            )}

                            {/* Lines/Paths/Drawings */}
                            {(l.type === 'line' || l.type === 'drawing') && (
                                <svg width={l.type==='drawing'?activePreset.width:l.width} height={l.type==='drawing'?activePreset.height:l.height} style={{overflow:'visible', pointerEvents:'none', position: l.type==='drawing'?'absolute':'static', left:l.type==='drawing'?(-l.width!/2):0, top:l.type==='drawing'?(-l.height!/2):0 }}>
                                     {l.type==='line' && <line x1={0} y1={(l.height||20)/2} x2={l.width||100} y2={(l.height||20)/2} stroke={l.strokeColor} strokeWidth={l.strokeWidth} strokeDasharray={l.strokeDash?.join(',')} strokeLinecap="round"/>}
                                     {l.type==='drawing' && l.strokes?.map((s, i) => (
                                         <polyline key={i} points={s.points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: s.opacity ?? 1, filter: s.blur ? `blur(${s.blur}px)` : 'none' }}/>
                                     ))}
                                </svg>
                            )}
                            
                            {/* TRANSFORM CONTROLS (Multi-Select Aware) */}
                            {selectedLayerIds.includes(l.id) && activeTool === 'select' && (
                                <>
                                    {/* Bounding Box Border */}
                                    <div className="absolute inset-0 border border-gold pointer-events-none z-40" style={{margin:-1}} />
                                    
                                    {/* Handles (Only for Primary or Single Selection to avoid clutter, or all if robust) */}
                                    {/* Showing handles for all selected items for now to ensure specific resizing works */}
                                    {!l.locked && (
                                        <>
                                            {/* TL */}
                                            <div onPointerDown={(e) => handlePointerDown(e, 'resize', l.id)} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-gold rounded-sm cursor-nwse-resize z-50 pointer-events-auto shadow-sm hover:scale-125 transition-transform" />
                                            {/* TR */}
                                            <div onPointerDown={(e) => handlePointerDown(e, 'resize', l.id)} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-gold rounded-sm cursor-nesw-resize z-50 pointer-events-auto shadow-sm hover:scale-125 transition-transform" />
                                            {/* BL */}
                                            <div onPointerDown={(e) => handlePointerDown(e, 'resize', l.id)} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-gold rounded-sm cursor-nesw-resize z-50 pointer-events-auto shadow-sm hover:scale-125 transition-transform" />
                                            {/* BR */}
                                            <div onPointerDown={(e) => handlePointerDown(e, 'resize', l.id)} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-gold rounded-sm cursor-nwse-resize z-50 pointer-events-auto shadow-sm hover:scale-125 transition-transform" />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    actions={contextMenu.layerId ? [
                        {
                            label: 'Duplicar',
                            icon: <Copy className="w-4 h-4" />,
                            onClick: () => {
                                const layer = layers.find(l => l.id === contextMenu.layerId);
                                if (layer) {
                                    const newLayer = { ...layer, id: `${layer.type}_copy_${Date.now()}_${generateId()}`, x: layer.x+20, y: layer.y+20 };
                                    updateLayers(prev => [...prev, newLayer]);
                                    setSelectedLayerIds([newLayer.id]);
                                }
                            }
                        },
                        {
                            label: layers.find(l => l.id === contextMenu.layerId)?.locked ? 'Desbloquear' : 'Bloquear',
                            icon: layers.find(l => l.id === contextMenu.layerId)?.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
                            onClick: () => {
                                if (contextMenu.layerId) {
                                    const layer = layers.find(l => l.id === contextMenu.layerId);
                                    if (layer) updateLayer(contextMenu.layerId, { locked: !layer.locked });
                                }
                            }
                        },
                        {
                            label: layers.find(l => l.id === contextMenu.layerId)?.visible ? 'Ocultar' : 'Mostrar',
                            icon: layers.find(l => l.id === contextMenu.layerId)?.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />,
                            onClick: () => {
                                if (contextMenu.layerId) {
                                    const layer = layers.find(l => l.id === contextMenu.layerId);
                                    if (layer) updateLayer(contextMenu.layerId, { visible: !layer.visible });
                                }
                            }
                        },
                        {
                            label: 'Eliminar',
                            icon: <Trash2 className="w-4 h-4" />,
                            onClick: () => {
                                if (contextMenu.layerId) {
                                    updateLayers(prev => prev.filter(l => l.id !== contextMenu.layerId));
                                    setSelectedLayerIds(prev => prev.filter(id => id !== contextMenu.layerId));
                                }
                            },
                            danger: true
                        }
                    ] : [
                        {
                            label: 'Ajustar a pantalla',
                            onClick: () => {
                                const frame = document.getElementById('canvas-frame');
                                if (frame) {
                                    const container = frame.parentElement;
                                    if (container) {
                                        const containerRect = container.getBoundingClientRect();
                                        const scaleX = (containerRect.width * 0.9) / activePreset.width;
                                        const scaleY = (containerRect.height * 0.9) / activePreset.height;
                                        const newZoom = Math.min(scaleX, scaleY, 1);
                                        setZoom(newZoom);
                                        setViewportOffset({ x: 0, y: 0 });
                                    }
                                }
                            }
                        },
                        {
                            label: 'Restablecer vista',
                            onClick: () => {
                                setZoom(0.4);
                                setViewportOffset({ x: 0, y: 0 });
                            }
                        }
                    ]}
                />
            )}
        </div>

        {/* CUSTOM SIZE MODAL */}
        <AnimatePresence>
            {showCustomSizeModal && (
                <>
                    <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm" onClick={() => setShowCustomSizeModal(false)} />
                    <motion.div 
                        initial={{opacity:0, scale:0.95}} 
                        animate={{opacity:1, scale:1}} 
                        exit={{opacity:0, scale:0.95}}
                        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-abyss-panel p-6 rounded-lg border border-white/10 w-80 shadow-2xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-white font-bold mb-4">Tamaño Personalizado</h3>
                            <div className="flex gap-2 mb-6">
                                <label className="flex-1 text-xs text-bone">
                                    Ancho
                                    <input 
                                        type="number" 
                                        value={customSize.width} 
                                        onChange={e=>setCustomSize(p=>({...p,width:Math.max(1, Number(e.target.value))}))} 
                                        className="w-full bg-black/40 border border-white/10 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        min="1"
                                        aria-label="Ancho del canvas"
                                    />
                                </label>
                                <label className="flex-1 text-xs text-bone">
                                    Alto
                                    <input 
                                        type="number" 
                                        value={customSize.height} 
                                        onChange={e=>setCustomSize(p=>({...p,height:Math.max(1, Number(e.target.value))}))} 
                                        className="w-full bg-black/40 border border-white/10 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gold/50"
                                        min="1"
                                        aria-label="Alto del canvas"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={()=>setShowCustomSizeModal(false)} 
                                    className="px-3 py-2 text-xs text-bone/50 hover:text-bone focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                                    aria-label="Cancelar"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={() => { 
                                        if (customSize.width > 0 && customSize.height > 0) {
                                            setActivePreset({id:'custom',label:'Personalizado',desc:'Definido por usuario',width:customSize.width,height:customSize.height,platform:'custom'}); 
                                            setShowCustomSizeModal(false);
                                            showNotification('Tamaño personalizado establecido', 'success');
                                        } else {
                                            showNotification('Las dimensiones deben ser mayores a 0', 'error');
                                        }
                                    }} 
                                    className="px-4 py-2 bg-gold text-abyss text-xs font-bold rounded hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-colors"
                                    aria-label="Establecer tamaño"
                                >
                                    Establecer Tamaño
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    </div>
  );
}

const TooltipButton = React.memo(({ icon: Icon, label, tooltip, active, onClick, disabled }: {icon: React.ComponentType<{className?: string}>, label: string, tooltip?: string, active?: boolean, onClick: () => void, disabled?: boolean}) => {
    return (
        <div className="group relative flex justify-center w-full">
            <button onClick={onClick} disabled={disabled} className={clsx("p-3 rounded-xl transition-all relative", active ? "bg-gold text-abyss shadow-lg shadow-gold/50 ring-2 ring-gold/30" : "text-bone/40 hover:bg-white/5", disabled&&"opacity-20")}><Icon className="w-5 h-5"/></button>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 z-50 hidden md:block bg-abyss border border-white/10 rounded px-2 py-1 shadow-xl whitespace-nowrap pointer-events-none">
                 <div className="text-[10px] font-bold text-white uppercase">{label}</div><div className="text-[9px] text-bone/60">{tooltip}</div>
            </div>
        </div>
    );
});

const RangeControl = React.memo(({ label, value, min, max, onChange }: {label: string, value: number, min: number, max: number, onChange: (v: number) => void}) => {
    return (<div><div className="flex justify-between mb-1"><label className="text-[10px] uppercase text-bone/50 font-bold">{label}</label><span className="text-[10px] font-mono text-bone/50">{Math.round(value*10)/10}</span></div><input type="range" step="0.1" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"/></div>);
});

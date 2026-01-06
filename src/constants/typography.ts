/**
 * Sistema tipográfico consistente
 * Tamaños basados en escala de 8px para coherencia
 */
export const TYPOGRAPHY = {
  xs: '8px',      // 0.5rem - Labels muy pequeños, metadata
  sm: '10px',     // 0.625rem - Labels, tooltips
  base: '12px',   // 0.75rem - Texto base pequeño
  md: '14px',     // 0.875rem - Texto base
  lg: '16px',     // 1rem - Texto destacado
  xl: '20px',     // 1.25rem - Títulos pequeños
  '2xl': '24px',  // 1.5rem - Títulos
  '3xl': '32px',  // 2rem - Títulos grandes
} as const;

/**
 * Tailwind classes equivalentes
 */
export const TYPOGRAPHY_CLASSES = {
  xs: 'text-[8px]',
  sm: 'text-[10px]',
  base: 'text-xs',    // 12px
  md: 'text-sm',      // 14px
  lg: 'text-base',    // 16px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 32px
} as const;

/**
 * Pesos de fuente
 */
export const FONT_WEIGHTS = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

/**
 * Opacidades de texto para contraste mejorado
 */
export const TEXT_OPACITY = {
  full: 'text-white',        // 100% - Texto principal
  high: 'text-bone',         // ~90% - Texto importante
  medium: 'text-bone/70',    // 70% - Texto secundario
  low: 'text-bone/50',       // 50% - Texto terciario (mínimo recomendado)
  disabled: 'text-bone/30',  // 30% - Texto deshabilitado
} as const;


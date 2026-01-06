/**
 * Sistema de espaciado consistente
 * Basado en múltiplos de 4px para coherencia visual
 */
export const SPACING = {
  xs: '4px',    // 0.25rem
  sm: '8px',    // 0.5rem
  md: '12px',   // 0.75rem
  base: '16px', // 1rem
  lg: '24px',   // 1.5rem
  xl: '32px',   // 2rem
  '2xl': '48px', // 3rem
  '3xl': '64px', // 4rem
} as const;

/**
 * Tailwind classes equivalentes para uso directo
 */
export const SPACING_CLASSES = {
  xs: 'p-1',      // padding 4px
  sm: 'p-2',      // padding 8px
  md: 'p-3',      // padding 12px
  base: 'p-4',    // padding 16px
  lg: 'p-6',      // padding 24px
  xl: 'p-8',      // padding 32px
  gapXs: 'gap-1', // gap 4px
  gapSm: 'gap-2', // gap 8px
  gapMd: 'gap-3', // gap 12px
  gapBase: 'gap-4', // gap 16px
  gapLg: 'gap-6', // gap 24px
  gapXl: 'gap-8', // gap 32px
  spaceXs: 'space-y-1', // space-y 4px
  spaceSm: 'space-y-2', // space-y 8px
  spaceMd: 'space-y-3', // space-y 12px
  spaceBase: 'space-y-4', // space-y 16px
  spaceLg: 'space-y-6', // space-y 24px
  spaceXl: 'space-y-8', // space-y 32px
} as const;


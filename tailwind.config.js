/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          DEFAULT: '#0B0A14', // Abyss Violet 1
          deep: '#120E1F',    // Abyss Violet 2
          panel: '#0E1014',   // Deep Graphite
        },
        gold: {
          DEFAULT: '#C6A86B', // Organic Gold
        },
        nebula: {
          DEFAULT: '#5B4B8A', // Nebula Violet
        },
        night: {
          DEFAULT: '#0F1B2D', // Night Blue
        },
        bone: {
          DEFAULT: '#E6E2DA', // Bone White
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'], // Fallback strategy
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}

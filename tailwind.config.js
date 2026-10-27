/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          dark: '#080C16',
          midnight: '#0D1424',
          surface: '#131B2E',
          card: '#18223A',
          border: '#2A3654',
          cream: '#FDFBF7',
          warmWhite: '#FAF7F2',
          ivory: '#F3EDE2',
          gold: '#F59E0B',
          goldLight: '#FBBF24',
          goldDark: '#B45309',
          amber: '#F97316',
          amberLight: '#FB923C',
          diya: '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(245, 158, 11, 0.25)',
        'glow-md': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-lg': '0 0 35px rgba(245, 158, 11, 0.45)',
        'glow-diya': '0 0 25px rgba(234, 88, 12, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

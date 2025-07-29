/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        // Luxury Theme Colors
        'ivory-white': '#F8F5F0',
        'forest-green': '#2C3A34',
        'gold': {
          50: '#FFFDF7',
          100: '#FEF9E7',
          200: '#FDF2C4',
          300: '#FCE896',
          400: '#FADC5C',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#9A7A1A',
          800: '#7D6315',
          900: '#654F12',
        },
        'forest': {
          50: '#F0F4F1',
          100: '#DCE8DF',
          200: '#B9D1C0',
          300: '#8DB49C',
          400: '#5F9177',
          500: '#3F7257',
          600: '#2C3A34',
          700: '#1E2A21',
          800: '#141B16',
          900: '#0A0F0B',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'luxury': '0 15px 30px -5px rgba(139, 94, 60, 0.08)',
        'luxury-lg': '0 25px 50px -12px rgba(139, 94, 60, 0.12)',
        'desert-shadow': '0 8px 24px -6px rgba(193, 154, 107, 0.25)',
        'desert-glow': '0 0 24px rgba(193, 154, 107, 0.35)',
        'parchment': 'inset 0 1px 3px rgba(139, 94, 60, 0.1), 0 1px 2px rgba(139, 94, 60, 0.05)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #F8F5F0 0%, #F0F4F1 100%)',
        'forest-gradient': 'linear-gradient(135deg, #2C3A34 0%, #1E2A21 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
      },
    },
  },
  plugins: [],
};
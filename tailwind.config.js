/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sprint: {
          50: '#f5f0ff',
          100: '#ece0ff',
          200: '#dbc4ff',
          300: '#c29aff',
          400: '#a366ff',
          500: '#8431ff',
          600: '#7000ff', // Main Uzum/Sprint Signature Violet
          700: '#6000e0',
          800: '#4e00b8',
          900: '#400293',
          950: '#260061',
          accent: '#00D68F', // Neon Green Accent
          amber: '#FF9E00',  // Installment / Promo tag yellow
          coral: '#FF4D6D',  // Discount tag red
          dark: '#141415',   // Dark text
          muted: '#80808a',  // Muted gray
          border: '#e8e8ed', // Crisp card border
          bg: '#f7f7f9',     // Light background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sprint': '0 4px 20px -2px rgba(112, 0, 255, 0.25)',
        'sprint-hover': '0 10px 30px -3px rgba(112, 0, 255, 0.4)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 16px 32px -4px rgba(112, 0, 255, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
        'dark-card': '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(112, 0, 255, 0.15)',
        'glow-purple': '0 0 20px rgba(112, 0, 255, 0.5)',
        'glow-amber': '0 0 20px rgba(255, 158, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'heart-pop': 'heartPop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'cart-bump': 'cartBump 0.35s ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
        'gradient-x': 'gradientX 8s ease infinite',
        'float': 'float 4s ease-in-out infinite',
        'badge-glow': 'badgeGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.4)' },
          '70%': { transform: 'scale(0.85)' },
          '100%': { transform: 'scale(1)' },
        },
        cartBump: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25) rotate(-6deg)' },
          '75%': { transform: 'scale(1.1) rotate(4deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        badgeGlow: {
          '0%': { filter: 'drop-shadow(0 0 2px rgba(255, 158, 0, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 8px rgba(255, 158, 0, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}

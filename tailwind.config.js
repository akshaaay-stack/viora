/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        viora: {
          red: '#990011',
          'red-hover': '#80000e',
          'red-light': '#fdf2f2',
          navy: '#1E2761',
          'navy-light': '#2a3680',
          'navy-surface': '#f0f3f9',
          green: '#1F6E43',
          'green-light': '#edf7f1',
          gold: '#B8860B',
          'gold-light': '#fdf8ea',
          bg: '#F8F8F6',
          surface: '#FFFFFF',
          text: '#172033',
          muted: '#667085',
          border: '#E4E7EC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'pulse-subtle': 'vioraPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'vioraPulseFast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-expand': 'waveExpand 3s ease-out infinite'
      },
      keyframes: {
        vioraPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.04)' }
        },
        vioraPulseFast: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.08)' }
        },
        waveExpand: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        }
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0A0A0A',
        muted: '#F5F5F5',
        'muted-fg': '#6B6B6B',
        accent: '#F2B772',
        'accent-secondary': '#D4892A',
        'accent-fg': '#0A0A0A',
        border: '#E8E8E8',
        card: '#FAFAFA',
        ring: '#F2B772',
      },
      fontFamily: {
        display: ['"Calistoga"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 60s linear infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0,0,0,0.07)',
        'card-hover': '0 20px 25px rgba(0,0,0,0.1)',
        'accent': '0 4px 14px rgba(242,183,114,0.4)',
        'accent-lg': '0 8px 24px rgba(242,183,114,0.55)',
      },
    },
  },
  plugins: [],
}

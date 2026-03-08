/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linear: {
          deep: '#020203',
          base: '#050506',
          elevated: '#0a0a0c',
          surface: 'rgba(255,255,255,0.05)',
          surfaceHover: 'rgba(255,255,255,0.08)',
          fg: '#EDEDEF',
          muted: '#8A8F98',
          subtle: 'rgba(255,255,255,0.60)',
          accent: '#5E6AD2',
          accentBright: '#6872D9',
          accentGlow: 'rgba(94,106,210,0.3)',
          border: 'rgba(255,255,255,0.06)',
          borderHover: 'rgba(255,255,255,0.10)',
          borderAccent: 'rgba(94,106,210,0.30)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Geist Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 10s ease-in-out infinite',
        'float-medium': 'float 8s ease-in-out infinite',
        'float-fast': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.10' },
          '50%': { opacity: '0.18' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(255,255,255,0.06), 0 2px 20px rgba(0,0,0,0.4), 0 0 40px rgba(0,0,0,0.2)',
        'card-hover': '0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(94,106,210,0.1)',
        'accent-glow': '0 0 0 1px rgba(94,106,210,0.5), 0 4px 12px rgba(94,106,210,0.3), inset 0 1px 0 0 rgba(255,255,255,0.2)',
        'inner-highlight': 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}

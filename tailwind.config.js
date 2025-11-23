/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        web3: {
          dark: '#0a0b0d',
          darker: '#050507',
          card: '#0f1117',
          cardHover: '#151820',
          accent: '#6366f1',
          accentHover: '#818cf8',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'web3-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'web3-mesh': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      },
      boxShadow: {
        custom: `2.4px 2.4px 2.2px rgba(0, 0, 0, 0.031),
        8.2px 8.2px 5.3px rgba(0, 0, 0, 0.043),
        17.5px 17.5px 10px rgba(0, 0, 0, 0.05),
        31.2px 31.2px 17.9px rgba(0, 0, 0, 0.055),
        52.4px 52.4px 33.4px rgba(0, 0, 0, 0.061),
        100px 100px 80px rgba(0, 0, 0, 0.08)`,
        'neon': '0 0 5px theme(colors.web3.accent), 0 0 20px theme(colors.web3.accent)',
        'neon-lg': '0 0 10px theme(colors.web3.accent), 0 0 40px theme(colors.web3.accent), 0 0 80px theme(colors.web3.accent)',
        'card': '0 8px 16px rgba(99, 102, 241, 0.1)',
        'card-hover': '0 20px 40px rgba(99, 102, 241, 0.2)',
      }
    },
  },
  plugins: [],
}
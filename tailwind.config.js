/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        custom: `2.4px 2.4px 2.2px rgba(0, 0, 0, 0.031),
                 8.2px 8.2px 5.3px rgba(0, 0, 0, 0.043),
                 17.5px 17.5px 10px rgba(0, 0, 0, 0.05),
                 31.2px 31.2px 17.9px rgba(0, 0, 0, 0.055),
                 52.4px 52.4px 33.4px rgba(0, 0, 0, 0.061),
                 100px 100px 80px rgba(0, 0, 0, 0.08)`
      }
    
      
    },
  }
  ,
  plugins: [],
}
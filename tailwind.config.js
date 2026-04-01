/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nuit': {
          DEFAULT: '#0f1923',
          light: '#162233',
        },
        'emerald-b': {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.12)',
        },
        'bronze': {
          DEFAULT: '#c4a87d',
          glow: 'rgba(196, 168, 125, 0.1)',
        },
        'txt': {
          primary: '#e2e8f0',
          secondary: '#7b8a9e',
          muted: '#4a5568',
        },
        'bord': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

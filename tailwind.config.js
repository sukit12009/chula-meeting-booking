/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E75480', // Pink - Primary Button, Highlights (จุฬาฯ pink)
          light: '#F9E6EE',   // Light Pink - Background Soft, Hover
          dark: '#C23B69',    // Darker Pink for hover states
        },
        gray: {
          light: '#F5F5F5',   // Light Gray - Card Background, Secondary sections
          medium: '#9E9E9E',  // Medium Gray - Text Secondary, Border
          dark: '#424242',    // Dark Gray - Text Primary
        },
        gold: {
          light: '#FFF8E1',   // Light Gold
          DEFAULT: '#FFD700', // Gold color
          dark: '#DAA520',    // Dark Gold
        },
        white: '#FFFFFF',     // White - Main Background
      },
      fontFamily: {
        sarabun: ['var(--font-sarabun)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.1)',
      },
      backgroundImage: {
        'chula-pattern': "url('/images/chula-pattern.png')",
      },
    },
  },
  plugins: [],
} 
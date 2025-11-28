/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC107', // Marigold Yellow
          hover: '#FFCA28',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#4DB6AC', // Soft Teal
          hover: '#26A69A',
          foreground: '#FFFFFF',
        },
        background: '#FFFDF5', // Cream/Off-White
        accent: '#FF8A65', // Coral
        surface: '#FFFFFF',
        text: {
          primary: '#2D3748',
          secondary: '#718096',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}

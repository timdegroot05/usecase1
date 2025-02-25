/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
    './public/index.html',
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E4C76B',
        secondary: '#07144D',
      }
    },
  },
  plugins: [],
}


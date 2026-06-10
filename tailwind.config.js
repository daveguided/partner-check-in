/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        tem: {
          orange:    '#ff4e00',  // --orange100
          orange2:   '#eb5b1d',  // --orange
          orange60:  '#f39d77',  // --orange60
          orange5:   '#fef7f3',  // --orange5
          btn:       '#fff8f2',  // --btnBackground
          btnHover:  '#fff1e6',  // --btnBackgroundHover
          dark:      '#1f1e1e',  // --dark100
          dark60:    '#797878',  // --dark60
          dark10:    '#e9e9e9',  // --dark10
          bg:        '#f8f8f8',  // --background
          gray10:    '#eaebec',  // --gray10
        },
      },
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

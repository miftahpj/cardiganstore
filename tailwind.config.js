/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Palette extracted from the WOOMAN by Khania logo (dusty rose / pink)
        primary: {
          50: '#fdf3f5',
          100: '#fbe6ea',
          200: '#f5c9d4',
          300: '#eda3b5',
          400: '#dd7893',
          500: '#c66a80', // core logo pink
          600: '#b05570',
          700: '#8f4159',
          800: '#743648',
          900: '#622f3e',
          950: '#361620'
        },
        cream: '#fdf8f6',
        blush: '#f6e9ec'
      },
      fontFamily: {
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Playfair Display"', 'serif']
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(198, 106, 128, 0.25)'
      }
    }
  },
  plugins: []
}

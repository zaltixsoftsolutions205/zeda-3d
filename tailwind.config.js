/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: { zeda: '#0F3D2E', deep: '#082a1f' },
        sun: '#E8731A',
        sky: { zeda: '#E6F4EC' },
        ink: '#0F3D2E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

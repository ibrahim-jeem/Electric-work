/** Rebuild css/tailwind.css after adding new Tailwind classes to index.html or js/*.js: npm run build:css */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0284c7', 600: '#0369a1', 700: '#075985', 900: '#0c4a6e' },
        phaseR: '#ef4444', phaseY: '#eab308', phaseB: '#3b82f6', phaseN: '#6b7280', phaseE: '#22c55e'
      }
    }
  }
}

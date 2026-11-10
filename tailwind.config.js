/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eco: {
          light: '#F0FDF4', // Vert très pâle pour le fond clair
          DEFAULT: '#10B981', // Vert émeraude vif
          dark: '#059669',
        },
        slate: {
          bg: '#0F172A', // Fond sombre style "SaaS moderne" (Slate 900)
          card: '#1E293B', // Fond de carte sombre (Slate 800)
          border: '#334155', // Bordure sombre (Slate 700)
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      }
    },
  },
  plugins: [],
}
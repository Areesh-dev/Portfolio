/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: 'rgb(var(--page) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--fg) / <alpha-value>)',
        primary: {
          50: '#f0f0f0',
          100: '#e4e4e4',
          200: '#c7c7c7',
          300: '#a8a8a8',
          400: '#8a8a8a',
          500: '#6b6b6b',
          600: '#525252',
          700: '#383838',
          800: '#232323',
          900: '#141414',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        rowdies: ['Rowdies', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgb(0 0 0 / 0.25)',
        glass: '0 8px 32px -8px rgb(0 0 0 / 0.45), inset 0 1px 0 0 rgb(255 255 255 / 0.08)',
      },
    },
  },
  plugins: [],
};

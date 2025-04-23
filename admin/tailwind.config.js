/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        backgroundColor: 'rgba(var(--background-color))',
        textColor: 'rgba(var(--text-color))',
        borderColor: 'rgba(var(--border-color))',
        hoverColor: 'rgba(var(--hover-color))',
        primaryColor: 'rgba(var(--primary-color))',
        secondaryColor: 'rgba(var(--secondary-color))',
        accentColor: 'rgba(var(--accent-color))',
        errorColor: 'rgba(var(--error-color))',
      },
    },
  },
  plugins: [],
};

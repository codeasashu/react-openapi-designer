module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  darkMode: 'media', // or 'media' or 'class'
  //darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        canvas: {
          light: 'var(--color-canvas)',
          dark: 'var(--color-canvas)',
          DEFAULT: 'var(--color-canvas)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

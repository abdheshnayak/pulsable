/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'pl-',
  content: ['./src/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],

  keyframes: {
    shimmer: {
      '100%': {
        transform: 'translateX(100%)',
      },
    },
  },
};

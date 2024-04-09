import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{jsx,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bluegray: colors.slate,
      },
    },
  },
  variants: {
    extend: {
      textColor: ['disabled'],
      backgroundColor: ['disabled'],
      boxShadow: ['disabled'],
      cursor: ['disabled'],
      pointerEvents: ['disabled'],
    },
  },
  plugins: [],
};

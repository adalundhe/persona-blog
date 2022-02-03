module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    extend: {
      
      // that is animation class
      animation: {
        fade: 'fadeIn 3s ease-linear',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { backgroundColor: theme('colors.red.300') },
          '100%': { backgroundColor: theme('colors.transparent') },
        },
      }),
    }
  },
  plugins: [],
};
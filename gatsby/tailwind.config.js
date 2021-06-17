const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  // darkMode: 'media', // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    spacing: {
      '0': '0px',
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
      '7': '80px',
      '8': '800px',
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      // serif: ['Didot', 'Didot LT', 'STD', 'Hoefler Text' , 'Garamond', 'Times New Roman', 'serif']
      serif: ['Playfair Display', 'serif'],
    },
    extend: {
      colors: {
        vibrant: {
          DEFAULT: 'rgb(var(--vibrant))',
          light: 'rgb(var(--light-vibrant))',
          dark: 'rgb(var(--dark-vibrant))',
          '75': 'rgba(var(--vibrant), .75)',
          'light-75': 'rgba(var(--light-vibrant), .75)',
          'dark-75': 'rgba(var(--dark-vibrant), .75)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          light: 'rgb(var(--light-muted))',
          dark: 'rgb(var(--dark-muted))',
          '75': 'rgba(var(--muted), .75)',
          'light-75': 'rgba(var(--light-muted), .75)',
          'dark-75': 'rgba(var(--dark-muted), .75)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

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
      'portrait': {'raw': '(orientation: portrait)'},
      'landscape': {'raw': '(orientation: landscape)'},
    },
    spacing: {
      '0': '0px',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '24px',
      '6': '32px',
      '7': '48px',
      '8': '80px',
      '9': '800px',
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
          '75': 'rgba(var(--vibrant), .8)',
          'light-75': 'rgba(var(--light-vibrant), .8)',
          'dark-75': 'rgba(var(--dark-vibrant), .8)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          light: 'rgb(var(--light-muted))',
          dark: 'rgb(var(--dark-muted))',
          '75': 'rgba(var(--muted), .8)',
          'light-75': 'rgba(var(--light-muted), .8)',
          'dark-75': 'rgba(var(--dark-muted), .8)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    spacing: {
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
      '7': '80px',
      '8': '800px'
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      // serif: ['Didot', 'Didot LT', 'STD', 'Hoefler Text' , 'Garamond', 'Times New Roman', 'serif']
      serif: ['Playfair Display', 'serif']
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

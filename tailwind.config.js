const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  // darkMode: 'media', // or 'media' or 'class'
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      portrait: { raw: "(orientation: portrait)" },
      landscape: { raw: "(orientation: landscape)" },
    },
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "24px",
      6: "32px",
      7: "48px",
      8: "80px",
      9: "800px",
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      // serif: ['Didot', 'Didot LT', 'STD', 'Hoefler Text' , 'Garamond', 'Times New Roman', 'serif']
      serif: ["Comic Neue", "serif"],
    },
    extend: {
      dropShadow: {
        'dark': '0 1px 2px rgba(0, 0, 0, 0.8)',
      },
      fontSize: {
        'huge-1': '95px',
        'huge-2': 'max(7.8vw, 120px)'
      },
      colors: {
        vibrant: {
          DEFAULT: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--vibrant), ${opacityValue})`;
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--vibrant), var(${opacityVariable}, 1))`;
            }
            return "rgb(var(--vibrant))";
          },
          light: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--light-vibrant), ${opacityValue})`;
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--light-vibrant), var(${opacityVariable}, 1))`;
            }
            return "rgb(var(--light-vibrant))";
          },
          dark: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--dark-vibrant), ${opacityValue})`;
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--dark-vibrant), var(${opacityVariable}, 1))`;
            }
            return "rgb(var(--dark-vibrant))";
          },
        },
        muted: {
          DEFAULT: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--muted), ${opacityValue})`;
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--muted), var(${opacityVariable}, 1))`;
            }
            return "rgb(var(--muted))";
          },
          light: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--light-muted), ${opacityValue})`;
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--light-muted), var(${opacityVariable}, 1))`;
            }
            return "rgb(var(--light-muted))";
          },
          dark: ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--dark-muted), ${opacityValue})`;
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--dark-muted), var(${opacityVariable}, 1))`;
            }
            return "rgb(var(--dark-muted))";
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

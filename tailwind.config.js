/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#740015",
          500: "#740015",
          600: "#990200",
          700: "#531946",
        },
        secondary: {
          DEFAULT: "#CE805C",
          500: "#CE805C",
          600: "#B87050",
        },
        accent: {
          DEFAULT: "#D4A574",
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      dm: ["DM Sans", "sans-serif"],
      nuni: ["Nunito", "sans-serif"],
      bar: ["Barlow", "sans-serif"],
    },
    maxWidth: {
      container: "1280px",
    },
  },

  plugins: [],
};

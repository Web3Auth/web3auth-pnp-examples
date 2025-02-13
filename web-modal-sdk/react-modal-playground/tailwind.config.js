/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5E17A",
        secondary: "#FAF2C2",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

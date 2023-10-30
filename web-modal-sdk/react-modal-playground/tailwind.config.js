/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0364FF",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0364FF",
        purple_100: "#EDEBFE",
        purple_800: "#5521B5",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6D5AE6",
        secondary: "#FF7D54",
        // Modern dark theme
        dark: {
          bg: {
            primary: "#10101E",
            secondary: "#191927",
            tertiary: "#1E1E30",
          },
          border: {
            primary: "#2E2E45",
            secondary: "#3D3D5C",
            focus: "#6D5AE6",
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#CDCDDF",
            tertiary: "#9999AF",
            accent: "#6D5AE6",
          },
          accent: {
            primary: "#6D5AE6", // Vibrant purple
            secondary: "#FF7D54", // Coral orange
            tertiary: "#4DBFFF", // Bright blue
            quaternary: "#41E88D", // Success green
            destructive: "#FF5F5F", // Danger red
            warning: "#FFD166", // Warning yellow
          },
          card: {
            primary: "rgba(30, 30, 48, 0.7)",
            secondary: "rgba(25, 25, 39, 0.8)",
            highlight: "rgba(109, 90, 230, 0.15)",
          },
          gradient: {
            primary: "linear-gradient(135deg, #6D5AE6 0%, #4DBFFF 100%)",
            secondary: "linear-gradient(135deg, #FF7D54 0%, #FFBD59 100%)",
            tertiary: "linear-gradient(135deg, #41E88D 0%, #00C4B8 100%)",
          }
        },
        // Keep these for backward compatibility
        purple_100: "#EDEBFE",
        purple_800: "#5521B5",
        github: {
          bg: "#0D1117",
          surface: "#161B22",
          hover: "#21262D",
          border: "#30363D",
          text: "#C9D1D9",
          textSecondary: "#8B949E",
          heading: "#F0F6FC",
          accent: "#58A6FF",
          success: "#3FB950",
          danger: "#F85149",
          warning: "#F8E3A1",
          highlight: "#F78166",
          button: "#238636",
          buttonHover: "#2EA043"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 5px 15px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(109, 90, 230, 0.5)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F45BA7",
        secondary: "#FF9A3C",
        accent: "#9B5DE5",
        coral: "#F35C5C",
        deep: "#0E4D64",
        dark: "#0F0F14",

        // 🔥 Neon Red Option 3
        neonRed: "#E10600",
        neonRedDark: "#B00500",
      },

      boxShadow: {
        neonRed: "0 0 25px rgba(225, 6, 0, 0.7)",
      },

      fontFamily: {
  genz: ["Poppins", "sans-serif"],
  display: ["Montserrat", "sans-serif"],
  shrikhand: ["Shrikhand", "cursive"], // ✅ new
},


      animation: {
        heartbeat: "heartbeat 3s ease-in-out infinite",
        scan: "scan 2s linear infinite",
        pulse: "pulse 1.5s infinite",
      },

      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulse: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

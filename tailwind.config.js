/** @type {import('tailwindcss').Config} */

import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "gray-100": "#D0D0D0",
        "gray-200": "#54647A",
        "gray-300": "#7A7A9D",
        "primary": "#FF840F",
        "secondary": "#0F344E",
        "sandal": "#F7EFE8",
        "error": "#FF0000",
        "title":"#262222",
        "lead":"#4B515C",

      },
      fontFamily: {
        inter: ['Inter', "sans-serif"],
      },
      fontSize: {
        sm: '13px',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      backgroundImage: {
        'glass-gradient-color': 'rgba(229, 229, 229, 0.10)',
        'orange-gradient-color': "linear-gradient(89deg, #FF9625 0%, #FF405E 100%)"
      },
      
    },
  },
  plugins: [tailwindAnimate],
}
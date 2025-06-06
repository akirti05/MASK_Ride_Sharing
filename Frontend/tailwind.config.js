/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: "var(--color-text-base)",
          main: "var(--color-text-main)",
          "heading-1": "var(--color-text-heading-1)",
          "base-2": "var(--color-text-base-2)",
          "button-accent": "var(--color-button-accent)",
          "button-accent-hover": "var(--color-button-accent-hover)"
        },
      },
      backgroundColor: {
        skin: {
          fill: "var(--color-fill)",
          "fill-2": "var(--color-fill-2)",
          "button-accent": "var(--color-button-accent)",
          "button-accent-hover": "var(--color-button-accent-hover)",
          "fill-signup": "var(--color-fill-signup)",
          "button-signup": "var(--color-button-singup)",
          "input-signup": "var(--color-input-signup)",
        },
        signup: {
          "button-1": "var(--color-button-signup-2)",
        },
      },
      borderColor: {
        skin: {
          "button-accent": "var(--color-button-accent)",
          "button-accent-hover": "var(--color-button-accent-hover)",
        },
      },
      animation: {
        fade: "fadeIn .5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};

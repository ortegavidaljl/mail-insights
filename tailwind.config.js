/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/views/*.php",
    "./resources/js/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    /*{
      pattern: /text-(white|black|blue|red|green|yellow)-600/,
    }*/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


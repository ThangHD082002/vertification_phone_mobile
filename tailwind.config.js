const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx,mdx}").replace(/\\/g, "/"),
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        viettel: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#EE0033',
          600: '#D80027',
          700: '#BA0024',
          800: '#94001D',
          900: '#730017',
          red: '#EE0033',
          darkRed: '#BA0024',
        },
      },
    },
  },
  plugins: [],
};

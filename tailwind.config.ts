import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: '#1C1C1F',
        blue: '#5383E8',
        lightBlue: '#2F436E',
        gray: '#c0c8ce',
        lighterGray: '#9e9eb1',
        lightGrayBackground: '#424254',
        lightGreen: '#03f9de'
      }
    },
  },
  darkMode: 'selector',
  plugins: [],
};

export default config;
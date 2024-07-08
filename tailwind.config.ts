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
        blue: '#5383E8',
        lightBlue: '#2F436E',
        gray: '#c0c8ce',
        lightGrayBackground: '#424254',
        lightGreen: '#03f9de',
        darkMode: {
          darkBlue: '#1C1C1F',
          darkGray: '#282830',
          mediumGray: '#31313C',
          lighterGray: '#9e9eb1',
        },
        lightMode: {
          lightGray: '#f7f7f9'
        },
        icons: {
          gray: '#9aa4af'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
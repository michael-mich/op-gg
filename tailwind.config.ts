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
        gray: '#c0c8ce',
        secondGray: '#9aa4af',
        mediumGrayText: '#7a798d',
        lightGray: '#9a9aac',
        lightGrayBackground: '#424254',
        lightGreen: '#03f9de',
        darkMode: {
          darkBlue: '#1C1C1F',
          darkGray: '#282830',
          mediumGray: '#31313C',
          lighterGray: '#9e9eb1',
        },
        lightMode: {
          lightGray: '#f7f7f9',
          lighterGray: '#f1f2f5'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
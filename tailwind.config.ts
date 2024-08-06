import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blue: '#5383E8',
        lightBlue: '#ecf2ff',
        gray: '#c0c8ce',
        secondGray: '#9aa4af',
        mediumGrayText: '#7a798d',
        lightGray: '#9a9aac',
        lightGrayBackground: '#424254',
        lightGreen: '#03f9de',
        yellow: '#ffb900',
        darkMode: {
          darkBlue: '#1C1C1F',
          darkGray: '#282830',
          mediumGray: '#31313C',
          lighterGray: '#9e9eb1',
        },
        lightMode: {
          lightGray: '#f7f7f9',
          lighterGray: '#f1f2f5',
          secondLighterGray: '#758592'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};

export default config;
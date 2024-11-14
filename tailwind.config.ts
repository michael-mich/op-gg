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
      fontSize: {
        small: '0.6875rem' // 11px
      },
      colors: {
        almostWhite: '#ebeef1',
        darkSlateGray: '#34414d',
        blue: '#5383E8',
        darkBlue: '#28344e',
        lightBlue: '#ecf2ff',
        secondLightBlue: '#0090fb',
        gray: '#c0c8ce',
        secondGray: '#9aa4af',
        mediumGrayText: '#7a798d',
        lightGray: '#9a9aac',
        lightGrayBackground: '#424254',
        mediumGreen: '#00bba3',
        lightGreen: '#03f9de',
        yellow: '#ffb900',
        lightRed: '#fff1f3',
        red: '#e84057',
        darkRed: '#59343b',
        orange: '#ff8200',
        darkMode: {
          darkBlue: '#1C1C1F',
          mediumBlue: '#2f436e',
          red: '#703c47',
          darkGray: '#282830',
          secondDarkGray: '#222227',
          mediumGray: '#31313C',
          secondMediumGray: '#79788b',
          lighterGray: '#9e9eb1',
        },
        lightMode: {
          black: "#202d37",
          blue: '#d5e3ff',
          red: '#ffd8d9',
          secondMediumGray: '#57646F',
          lightGray: '#f7f7f9',
          lighterGray: '#f1f2f5',
          secondLighterGray: '#758592',
          thirdLighterGray: '#dbe0e4'
        }
      },
      boxShadow: {
        'custom-shadow': 'rgba(0, 0, 0, 0.3) 0px 8px 12px 0px'
      }
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};

export default config;
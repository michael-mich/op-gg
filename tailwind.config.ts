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
        mediumBlue: '#27344E',
        lightBlue: '#2F436E',
        lightestBlue: '#B3CDFF',
        mediumGray: '#31313c',
        lightGrayBackground: '#424254'
      }
    },
  },
  darkMode: 'selector',
  plugins: [],
};

export default config;
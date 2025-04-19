import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FA9BAB',
        secondary: '#ED553B',
        stroke: '#EAE8DF',
        gray: '#888888',
      },
    },
  },
  plugins: [],
};
export default config;

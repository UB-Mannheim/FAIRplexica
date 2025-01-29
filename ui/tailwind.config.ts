import type { Config } from 'tailwindcss';
import type { DefaultColors } from 'tailwindcss/types/generated/colors';

const themeDark = (colors: DefaultColors) => ({
  50: '#0a0a0a',
  100: '#111111',
  200: '#1c1c1c',
});

const themeLight = (colors: DefaultColors) => ({
  50: '#ffffff',
  100: '#aab9ca',
  200: '#222f58',
});

// const modularScale = {
//   tiny: ['0.8125rem', { lineHeight: '1rem' }],
//   xs: ['0.9rem', { lineHeight: '1rem' }],  
//   sm: ['1rem', { lineHeight: '1.25rem' }],  // Base
//   md: ['1.25rem', { lineHeight: '1.5rem' }],
//   lg: ['1.5rem', { lineHeight: '1.75rem' }],
//   xl: ['1.7rem', { lineHeight: '2rem' }],
//   '2xl': ['2rem', { lineHeight: '2.5rem' }],
//   '3xl': ['2.25rem', { lineHeight: '2.8rem' }],
// };

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderColor: ({ colors }) => {
        return {
          light: themeLight(colors),
          dark: themeDark(colors),
        };
      },
      colors: ({ colors }) => {
        const colorsDark = themeDark(colors);
        const colorsLight = themeLight(colors);

        return {
          dark: {
            primary: colorsDark[50],
            secondary: colorsDark[100],
            ...colorsDark,
          },
          light: {
            primary: colorsLight[50],
            secondary: colorsLight[100],
            ...colorsLight,
          },
        };
      },
      // fontSize: modularScale,
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './app/**/*.{js,ts,jsx,tsx}',
//     './pages/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{js,ts,jsx,tsx}',

//     // // Or if using `src` directory:
//     // './src/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', ,],
  theme: {
    extend: {
      fontFamily: {
        // sans: ['var(--font-sans)', ...fontFamily.sans],
        // here we add the font for JetBrains_Mono
        mono: ['JetBrains Mono', ...fontFamily.mono],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        bg: '#F7F7F7',
      },
    },
  },
  plugins: [require('tailwindcss-animate', '@tailwindcss/typography')],
  css: [
    // ...
    './styles/globals.css',
  ],
};

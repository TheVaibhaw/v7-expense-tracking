import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  // ... content
  theme: {
    // ...
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

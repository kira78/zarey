import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,ts}', './shared/**/*.ts'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d0d',
        cream: '#fff3df',
        zblue: '#1f3fd9',
        zred: '#e3262b',
        zyellow: '#ffd21f',
        zpink: '#eba99b',
        zkhaki: '#7e8c3b',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        bubble: ['"Bagel Fat One"', 'Archivo', 'sans-serif'],
      },
      boxShadow: {
        sticker: '4px 4px 0 0 #0d0d0d',
        'sticker-lg': '8px 8px 0 0 #0d0d0d',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
} satisfies Config

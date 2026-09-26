import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        nuit: {
          DEFAULT: '#0f1923',
          light: '#162233',
          deep: '#0b131b',
        },
        'emerald-b': {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.12)',
        },
        bronze: {
          DEFAULT: '#c4a87d',
          glow: 'rgba(196, 168, 125, 0.1)',
        },
        // Contrastes vérifiés WCAG AA (≥ 4,5:1) sur nuit et nuit-light.
        txt: {
          primary: '#e2e8f0',
          secondary: '#9aa9bc',
          muted: '#8593a8',
        },
        bord: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        dm: ['var(--font-dm)', 'system-ui', 'sans-serif'],
      },
      typography: {
        babtech: {
          css: {
            '--tw-prose-body': '#b9c5d3',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-lead': '#c9d3df',
            '--tw-prose-links': '#34d399',
            '--tw-prose-bold': '#e2e8f0',
            '--tw-prose-counters': '#9aa9bc',
            '--tw-prose-bullets': '#10b981',
            '--tw-prose-hr': 'rgba(255,255,255,0.08)',
            '--tw-prose-quotes': '#e2e8f0',
            '--tw-prose-quote-borders': '#c4a87d',
            '--tw-prose-captions': '#9aa9bc',
            '--tw-prose-code': '#e2e8f0',
            '--tw-prose-pre-code': '#e2e8f0',
            '--tw-prose-pre-bg': '#0b131b',
            '--tw-prose-th-borders': 'rgba(255,255,255,0.16)',
            '--tw-prose-td-borders': 'rgba(255,255,255,0.08)',
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config

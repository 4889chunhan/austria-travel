import type { Config } from 'tailwindcss';

/**
 * Tailwind tokens are wired to CSS custom properties declared in
 * `src/styles/globals.css`. This keeps a single source of truth — change
 * a value there and both `bg-cream` and `var(--color-cream)` update.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--color-cream)',
        card: 'var(--color-card)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
          faint: 'var(--color-ink-faint)',
        },
        lime: {
          DEFAULT: 'var(--color-lime)',
          dark: 'var(--color-lime-dark)',
          deep: 'var(--color-lime-deep)',
        },
        sage: 'var(--color-sage)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border)',
        med: 'var(--color-border-med)',
      },
      fontFamily: {
        serif: ['var(--font-en)'],
        chinese: ['var(--font-zh)'],
        german: ['var(--font-de)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
        hover: 'var(--shadow-hover)',
      },
      letterSpacing: {
        editorial: '0.2em',
      },
    },
  },
  plugins: [],
};

export default config;

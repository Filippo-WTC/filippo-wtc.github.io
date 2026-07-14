const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme-adaptive colors — change via CSS vars in dark/light mode
        'white':       'rgb(var(--c-white) / <alpha-value>)',
        'wtc-white':   'rgb(var(--c-white) / <alpha-value>)',
        'wtc-black':   'rgb(var(--c-bg) / <alpha-value>)',
        'ice-grey':    'rgb(var(--c-ice) / <alpha-value>)',
        'surface-01':  'rgb(var(--c-surface-01) / <alpha-value>)',
        'surface-02':  'rgb(var(--c-surface-02) / <alpha-value>)',
        'surface-03':  'rgb(var(--c-surface-03) / <alpha-value>)',
        'border-dim':  'rgb(var(--c-border) / <alpha-value>)',
        'text-muted':  'rgb(var(--c-text-muted) / <alpha-value>)',
        // Brand / status colors — fixed, do not adapt to theme
        'wtc-orange':  '#F26522',
        'wtc-neon':    '#FF7029',
      },
      fontFamily: {
        clash:   ['"Clash Display"', ...fontFamily.sans],
        inter:   ['Inter', ...fontFamily.sans],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 6rem)',   { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 4.5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 3rem)',   { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.25rem, 2vw, 2rem)',  { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
      },
      borderRadius: {
        'bento': '1.5rem',
      },
      backgroundImage: {
        'telemetry-grid': `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        'hero-radial':   'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(242,101,34,0.10) 0%, transparent 65%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
        'orange-glow':   'radial-gradient(ellipse at center, rgba(242,101,34,0.18) 0%, transparent 65%)',
        'stripe-dark':   'repeating-linear-gradient(-45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 8px)',
      },
      backgroundSize: {
        'grid-sm': '40px 40px',
        'grid-md': '72px 72px',
        'grid-lg': '120px 120px',
      },
      boxShadow: {
        'orange-glow':  '0 0 50px rgba(242,101,34,0.15), 0 0 100px rgba(242,101,34,0.05)',
        'orange-sm':    '0 0 20px rgba(242,101,34,0.12)',
        'card':         '0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover':   '0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
        'inset-orange': 'inset 0 0 0 1px rgba(242,101,34,0.2)',
      },
      animation: {
        'pulse-glow':   'pulse-glow 3s ease-in-out infinite',
        'scan':         'scan 4s linear infinite',
        'flicker':      'flicker 0.15s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1',   filter: 'brightness(1)' },
          '50%':       { opacity: '0.6', filter: 'brightness(1.4)' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities, theme }) {
      addUtilities({
        '.telemetry-bg': {
          backgroundImage: theme('backgroundImage.telemetry-grid'),
          backgroundSize:  theme('backgroundSize.grid-md'),
        },
        '.telemetry-bg-sm': {
          backgroundImage: theme('backgroundImage.telemetry-grid'),
          backgroundSize:  theme('backgroundSize.grid-sm'),
        },
        '.text-gradient-orange': {
          background: `linear-gradient(135deg, ${theme('colors.wtc-orange')}, ${theme('colors.wtc-neon')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.border-glow': {
          border: '1px solid rgba(242,101,34,0.3)',
          boxShadow: '0 0 20px rgba(242,101,34,0.1)',
        },
        '.border-subtle': {
          border: '1px solid rgba(255,255,255,0.06)',
        },
        '.surface-card': {
          backgroundColor: 'rgb(var(--c-surface-01))',
          border: '1px solid rgba(255,255,255,0.05)',
        },
      });
    },
  ],
};

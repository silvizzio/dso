import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            hr: { borderColor: 'hsl(var(--border))' },
            'h1, h2, h3, h4': { color: 'hsl(var(--foreground))' },
            a: { color: 'hsl(var(--primary))' },
            code: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '4px',
              padding: '2px 5px',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            blockquote: {
              borderLeftColor: 'hsl(var(--border))',
              color: 'hsl(var(--muted-foreground))',
            },
            thead: { borderBottomColor: 'hsl(var(--border))' },
            'tbody tr': { borderBottomColor: 'hsl(var(--border))' },
            p: { fontSize: '0.9375rem', lineHeight: '1.7' },
            li: { fontSize: '0.9375rem', lineHeight: '1.6', marginTop: '0.2rem', marginBottom: '0.2rem' },
            'ul > li': { marginTop: '0.2rem', marginBottom: '0.2rem' },
            'ol > li': { marginTop: '0.2rem', marginBottom: '0.2rem' },
            h2: { fontSize: '1.25rem' },
            h3: { fontSize: '1.0625rem' },
          },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/typography')],
}

export default config
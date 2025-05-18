import type { Config } from "tailwindcss";
import { PluginUtils } from "tailwindcss/types/config";
import typographyPlugin from '@tailwindcss/typography';

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },      typography: ({ theme }: PluginUtils) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[600]'),
            '--tw-prose-headings': theme('colors.gray[900]'),
            '--tw-prose-links': theme('colors.blue[600]'),
            '--tw-prose-bold': theme('colors.gray[900]'),
            '--tw-prose-code': theme('colors.gray[900]'),
            '--tw-prose-quotes': theme('colors.gray[900]'),
            '--tw-prose-pre-bg': theme('colors.gray[100]'),
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'code': {
              backgroundColor: theme('colors.gray[100]'),
              borderRadius: '0.25rem',
              padding: '0.2rem 0.4rem',
              fontWeight: '400',
              fontSize: '0.875em',
            }
          }
        },
        dark: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.blue[400]'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-quotes': theme('colors.gray[100]'),
            '--tw-prose-pre-bg': theme('colors.gray[800]'),
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'code': {
              backgroundColor: theme('colors.gray[800]'),
              color: theme('colors.white'),
              borderRadius: '0.25rem',
              padding: '0.2rem 0.4rem',
              fontWeight: '400',
              fontSize: '0.875em',
            }
          }
        }
      }),
    },
  },
  plugins: [typographyPlugin],
};

export default config;

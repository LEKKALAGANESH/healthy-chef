export const theme = {
  colors: {
    dominant: '#FFFDF7',
    secondary: '#F0F7EE',
    accent: '#3A7D44',
    accentDark: '#2E6537',
    accentAlt: '#F4845F',
    text: '#1F2937',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    danger: '#DC2626',
    success: '#16A34A',
    surface: '#FFFFFF',
    rowAlt: '#F9FAFB',
  },
  typography: {
    fontHeading: "'Nunito', system-ui, sans-serif",
    fontBody: "'Open Sans', system-ui, sans-serif",
    sizes: {
      xs: '14px',
      sm: '16px',
      md: '18px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    weights: { regular: 400, semibold: 600, bold: 700 },
  },
  spacing: (n: number): string => `${n * 4}px`,
  radii: { sm: '4px', md: '8px', lg: '12px', pill: '999px' },
  shadows: {
    soft: '0 2px 16px rgba(58,125,68,0.12)',
    medium: '0 4px 24px rgba(58,125,68,0.18)',
  },
  transitions: { fast: '150ms ease', base: '250ms ease', slow: '400ms ease' },
  breakpoints: { xs: '320px', sm: '480px', md: '768px', lg: '1024px', xl: '1280px' },
} as const;

export type AppTheme = typeof theme;

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    font-family: ${({ theme }) => theme.typography.fontBody};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.dominant};
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.typography.fontHeading};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    line-height: 1.25;
  }
  button, input, select, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; background: none; border: none; }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

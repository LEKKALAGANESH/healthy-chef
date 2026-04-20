import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import { theme } from './styles/theme';
import { store } from './app/store';

function renderWithProviders() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ReduxProvider store={store}>
      <QueryClientProvider client={qc}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

describe('App shell', () => {
  it('renders the brand and nav links', async () => {
    renderWithProviders();
    expect(await screen.findByRole('heading', { name: /healthychef/i, level: 1 })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /items/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /new invoice/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /history/i })).toBeInTheDocument();
  });
});

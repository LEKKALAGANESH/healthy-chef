import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AppShell } from './components/layouts/AppShell';
import { ROUTES } from './constants/routes';

const ItemsPage = lazy(() => import('./pages/ItemsPage'));
const NewInvoicePage = lazy(() => import('./pages/NewInvoicePage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

function Fallback({ error }: { error: Error }) {
  return <p role="alert">Error: {error.message}</p>;
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Suspense fallback={<p>Loading…</p>}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path={ROUTES.items} element={<ItemsPage />} />
            <Route path={ROUTES.newInvoice} element={<NewInvoicePage />} />
            <Route path={ROUTES.history} element={<HistoryPage />} />
            <Route path="*" element={<Navigate to={ROUTES.items} replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

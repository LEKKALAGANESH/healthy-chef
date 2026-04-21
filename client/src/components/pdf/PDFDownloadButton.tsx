import { PDFDownloadLink } from '@react-pdf/renderer';
import { useMemo, type ReactElement } from 'react';
import { Button } from '../ui/Button';
import { InvoicePDFDocument } from './InvoicePDFDocument';
import type { Invoice } from '../../types/invoice';

interface BlobParams {
  loading: boolean;
  error: Error | null;
  url: string | null;
}

// PDFDownloadLink's children accepts a render function but its TS types in
// @react-pdf/renderer@3.x only expose ReactNode — cast to satisfy both.
// While loading OR in a transient error before the URL settles, stay on
// "Generating…" rather than flashing "PDF failed"; the first render can race
// with async font loading and briefly surface an error that clears on retry.
const renderChildren = (params: BlobParams): ReactElement => {
  const ready = !!params.url && !params.loading;
  return (
    <Button type="button" $variant="secondary" disabled={!ready}>
      {ready ? 'Download PDF' : 'Generating…'}
    </Button>
  );
};

export function PDFDownloadButton({ invoice }: { invoice: Invoice }) {
  const doc = useMemo(() => <InvoicePDFDocument invoice={invoice} />, [invoice]);
  return (
    <PDFDownloadLink
      document={doc}
      fileName={`${invoice.invoiceNumber}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {renderChildren as unknown as ReactElement}
    </PDFDownloadLink>
  );
}

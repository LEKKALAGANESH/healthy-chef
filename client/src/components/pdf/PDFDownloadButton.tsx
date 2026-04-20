import { PDFDownloadLink } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import { Button } from '../ui/Button';
import { InvoicePDFDocument } from './InvoicePDFDocument';
import type { Invoice } from '../../types/invoice';

interface BlobParams {
  loading: boolean;
  error: Error | null;
}

// PDFDownloadLink's children accepts a render function but its TS types in
// @react-pdf/renderer@3.x only expose ReactNode — cast to satisfy both.
const renderChildren = (params: BlobParams): ReactElement =>
  params.error ? (
    <Button type="button" $variant="ghost" disabled>
      PDF failed
    </Button>
  ) : (
    <Button type="button" $variant="secondary" disabled={params.loading}>
      {params.loading ? 'Generating…' : 'Download PDF'}
    </Button>
  );

export function PDFDownloadButton({ invoice }: { invoice: Invoice }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDFDocument invoice={invoice} />}
      fileName={`${invoice.invoiceNumber}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {renderChildren as unknown as ReactElement}
    </PDFDownloadLink>
  );
}

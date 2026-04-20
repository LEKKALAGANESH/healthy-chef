import { Document, Page, Text } from '@react-pdf/renderer';
import { pdfStyles as s } from './pdfTheme';
import { PDFHeader } from './PDFHeader';
import { PartiesBlock } from './PartiesBlock';
import { ItemsTable } from './ItemsTable';
import { SummaryBlock } from './SummaryBlock';
import { PDFFooter } from './PDFFooter';
import type { Invoice } from '../../types/invoice';

export function InvoicePDFDocument({ invoice }: { invoice: Invoice }) {
  return (
    <Document title={invoice.invoiceNumber} author="HealthyChef">
      <Page size="A4" style={s.page}>
        <PDFHeader invoiceNumber={invoice.invoiceNumber} createdAt={invoice.createdAt} />
        <PartiesBlock customer={invoice.customer} />
        <ItemsTable lineItems={invoice.lineItems} />
        <SummaryBlock totals={invoice} />
        <PDFFooter />
        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

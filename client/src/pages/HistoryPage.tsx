import styled from 'styled-components';
import { PageHeader } from '../components/layouts/PageHeader';
import { InvoiceHistoryTable } from '../components/history/InvoiceHistoryTable';
import { InvoiceListSkeleton } from '../components/skeletons/InvoiceListSkeleton';
import { useInvoices } from '../hooks/useInvoices';

const Err = styled.p`
  color: ${({ theme }) => theme.colors.danger};
`;

export default function HistoryPage() {
  const { data, isLoading, isError } = useInvoices();
  return (
    <>
      <PageHeader title="Invoice History" />
      {isLoading && <InvoiceListSkeleton />}
      {isError && <Err>Failed to load invoices. Is the server running?</Err>}
      {data && <InvoiceHistoryTable invoices={data} />}
    </>
  );
}

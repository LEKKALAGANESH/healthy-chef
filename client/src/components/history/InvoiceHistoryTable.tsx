import styled from 'styled-components';
import { Table } from '../ui/Table';
import { InvoiceRow } from './InvoiceRow';
import type { InvoiceSummary } from '../../types/invoice';

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

interface Props {
  invoices: InvoiceSummary[];
}

export function InvoiceHistoryTable({ invoices }: Props) {
  if (invoices.length === 0) {
    return <Empty>No invoices yet. Create one from the "New Invoice" tab.</Empty>;
  }
  return (
    <Table>
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Grand Total</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {invoices.map((i) => (
          <InvoiceRow key={i._id} summary={i} />
        ))}
      </tbody>
    </Table>
  );
}

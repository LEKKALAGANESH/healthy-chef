import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../ui/Button';
import { PDFDownloadButton } from '../pdf/PDFDownloadButton';
import { useInvoice } from '../../hooks/useInvoices';
import { formatINR } from '../../utils/money';
import type { InvoiceSummary } from '../../types/invoice';

const ExpandRow = styled.tr`
  background: ${({ theme }) => theme.colors.secondary};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing(3)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const Muted = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const GrandCell = styled.span`
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  white-space: nowrap;
`;

interface Props {
  summary: InvoiceSummary;
}

export function InvoiceRow({ summary }: Props) {
  const [open, setOpen] = useState(false);
  const { data: full } = useInvoice(open ? summary._id : '');

  return (
    <>
      <tr>
        <td>
          <strong>{summary.invoiceNumber}</strong>
        </td>
        <td>{summary.customer.name}</td>
        <td>{new Date(summary.createdAt).toLocaleDateString('en-IN')}</td>
        <td>
          <GrandCell>{formatINR(summary.grandTotal)}</GrandCell>
        </td>
        <td>
          <Button $variant="ghost" $size="sm" onClick={() => setOpen((o) => !o)}>
            {open ? 'Hide' : 'Details'}
          </Button>
        </td>
      </tr>
      {open && full && (
        <ExpandRow>
          <td colSpan={5}>
            <DetailGrid>
              <div>
                <Muted>
                  {full.customer.email} · {full.customer.phone}
                </Muted>
                <Muted>{full.customer.address}</Muted>
                <Muted>
                  {full.lineItems.length} line item{full.lineItems.length === 1 ? '' : 's'} ·
                  Subtotal {formatINR(full.subtotal)} · GST +{formatINR(full.totalGst)} · Discount −
                  {formatINR(full.totalDiscount)}
                </Muted>
              </div>
              <PDFDownloadButton invoice={full} />
            </DetailGrid>
          </td>
        </ExpandRow>
      )}
    </>
  );
}

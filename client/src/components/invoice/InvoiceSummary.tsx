import styled from 'styled-components';
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations';
import { formatINR } from '../../utils/money';

const Panel = styled.aside`
  background: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing(5)};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(6)};
  margin-left: auto;
  max-width: 480px;
  > div {
    display: flex;
    justify-content: space-between;
  }
  > .grand {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    color: ${({ theme }) => theme.colors.accent};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: ${({ theme }) => theme.spacing(3)};
    margin-top: ${({ theme }) => theme.spacing(2)};
  }
`;

export function InvoiceSummary() {
  const { subtotal, totalDiscount, totalGst, grandTotal } = useInvoiceCalculations();
  return (
    <Panel aria-label="Invoice summary">
      <div>
        <span>Subtotal</span>
        <span>{formatINR(subtotal)}</span>
      </div>
      <div>
        <span>Total Discount</span>
        <span>− {formatINR(totalDiscount)}</span>
      </div>
      <div>
        <span>Total GST</span>
        <span>+ {formatINR(totalGst)}</span>
      </div>
      <div className="grand">
        <span>GRAND TOTAL</span>
        <span>{formatINR(grandTotal)}</span>
      </div>
    </Panel>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../components/layouts/PageHeader';
import { Button } from '../components/ui/Button';
import { CustomerForm } from '../components/invoice/CustomerForm';
import { LineItemTable } from '../components/invoice/LineItemTable';
import { InvoiceSummary } from '../components/invoice/InvoiceSummary';
import { PDFDownloadButton } from '../components/pdf/PDFDownloadButton';
import { useCreateInvoice } from '../hooks/useInvoices';
import { resetDraft } from '../features/invoiceDraft/invoiceDraftSlice';
import type { RootState } from '../app/rootReducer';
import type { Invoice } from '../types/invoice';
import { ROUTES } from '../constants/routes';

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(6)};
  flex-wrap: wrap;
`;

const SavedBanner = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(5)};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`;

const Err = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export default function NewInvoicePage() {
  const draft = useSelector((s: RootState) => s.invoiceDraft);
  const create = useCreateInvoice();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<Invoice | null>(null);

  const canSave =
    draft.lineItems.length > 0 &&
    draft.customer.name.trim() !== '' &&
    draft.customer.phone.trim() !== '' &&
    draft.customer.email.trim() !== '' &&
    draft.customer.address.trim() !== '';

  const save = async () => {
    const payload = {
      customer: draft.customer,
      lineItems: draft.lineItems.map(({ id: _id, ...rest }) => rest),
    };
    try {
      const result = await create.mutateAsync(payload);
      setSaved(result);
    } catch {
      // error surface via create.isError below
    }
  };

  const startAnother = () => {
    dispatch(resetDraft());
    setSaved(null);
  };

  return (
    <>
      <PageHeader title={saved ? `Saved: ${saved.invoiceNumber}` : 'New Invoice'} />
      {saved && (
        <SavedBanner>
          Invoice {saved.invoiceNumber} saved. Download the PDF below or view all in History.
        </SavedBanner>
      )}
      <CustomerForm />
      <LineItemTable />
      <InvoiceSummary />
      {create.isError && (
        <Err>Failed to save invoice. Please check server connection and try again.</Err>
      )}
      <Actions>
        {!saved && (
          <Button onClick={save} disabled={!canSave || create.isPending}>
            {create.isPending ? 'Saving…' : 'Save Invoice'}
          </Button>
        )}
        {saved && (
          <>
            <PDFDownloadButton invoice={saved} />
            <Button $variant="ghost" onClick={startAnother}>
              New Invoice
            </Button>
            <Button $variant="ghost" onClick={() => navigate(ROUTES.history)}>
              View History
            </Button>
          </>
        )}
      </Actions>
    </>
  );
}

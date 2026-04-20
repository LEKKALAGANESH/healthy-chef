import { PageHeader } from '../components/layouts/PageHeader';
import { CustomerForm } from '../components/invoice/CustomerForm';
import { LineItemTable } from '../components/invoice/LineItemTable';
import { InvoiceSummary } from '../components/invoice/InvoiceSummary';

export default function NewInvoicePage() {
  return (
    <>
      <PageHeader title="New Invoice" />
      <CustomerForm />
      <LineItemTable />
      <InvoiceSummary />
    </>
  );
}

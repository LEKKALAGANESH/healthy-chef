import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Input } from '../ui/Input';
import { setCustomer } from '../../features/invoiceDraft/invoiceDraftSlice';
import type { RootState } from '../../app/rootReducer';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Address = styled.div`
  grid-column: 1 / -1;
`;

const SectionTitle = styled.h3`
  grid-column: 1 / -1;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.accent};
`;

export function CustomerForm() {
  const dispatch = useDispatch();
  const c = useSelector((s: RootState) => s.invoiceDraft.customer);
  return (
    <Grid>
      <SectionTitle>Customer Details</SectionTitle>
      <Input
        label="Full Name"
        value={c.name}
        onChange={(e) => dispatch(setCustomer({ name: e.target.value }))}
        required
      />
      <Input
        label="Phone Number"
        value={c.phone}
        onChange={(e) => dispatch(setCustomer({ phone: e.target.value }))}
        required
      />
      <Input
        label="Email ID"
        type="email"
        value={c.email}
        onChange={(e) => dispatch(setCustomer({ email: e.target.value }))}
        required
      />
      <Address>
        <Input
          label="Billing Address"
          value={c.address}
          onChange={(e) => dispatch(setCustomer({ address: e.target.value }))}
          required
        />
      </Address>
    </Grid>
  );
}

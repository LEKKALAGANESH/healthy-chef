import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { LineItemRow } from './LineItemRow';
import { useItems } from '../../hooks/useItems';
import { addLine } from '../../features/invoiceDraft/invoiceDraftSlice';
import type { RootState } from '../../app/rootReducer';

const Section = styled.div`
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

const Picker = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  align-items: flex-end;
  margin-top: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
  > label {
    flex: 1;
    min-width: 240px;
  }
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export function LineItemTable() {
  const dispatch = useDispatch();
  const { data: items = [] } = useItems();
  const lines = useSelector((s: RootState) => s.invoiceDraft.lineItems);
  const [selectedId, setSelectedId] = useState('');

  const add = () => {
    const item = items.find((i) => i._id === selectedId);
    if (!item) return;
    const firstVariant = item.variants[0];
    dispatch(
      addLine({
        itemId: item._id,
        itemName: item.name,
        variantLabel: firstVariant ? `${firstVariant.label}:${firstVariant.value}` : '',
        quantity: 1,
        basePrice: item.basePrice,
        gstRate: 5,
        discountType: 'absolute',
        discountValue: 0,
      })
    );
    setSelectedId('');
  };

  return (
    <Section>
      <SectionTitle>Line Items</SectionTitle>
      {lines.length === 0 ? (
        <Empty>No items added yet. Pick one below to add the first line.</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Base</th>
              <th>GST</th>
              <th>Discount</th>
              <th>Row Total</th>
              <th aria-label="Remove" />
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <LineItemRow key={l.id} line={l} />
            ))}
          </tbody>
        </Table>
      )}
      <Picker>
        <Select
          label="Add item from inventory"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select item…</option>
          {items.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name}
            </option>
          ))}
        </Select>
        <Button type="button" onClick={add} disabled={!selectedId}>
          + Add Line
        </Button>
      </Picker>
    </Section>
  );
}

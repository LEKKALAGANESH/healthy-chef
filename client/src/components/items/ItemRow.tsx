import styled from 'styled-components';
import type { Item } from '../../types/item';
import { formatINR } from '../../utils/money';
import { IconButton } from '../ui/IconButton';

const VariantChip = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 2px 10px;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  margin-right: 4px;
  margin-bottom: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: flex-end;
`;

const Price = styled.span`
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  white-space: nowrap;
`;

interface Props {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, onEdit, onDelete }: Props) {
  return (
    <>
      <td>{item.name}</td>
      <td>{item.description || <span style={{ opacity: 0.5 }}>—</span>}</td>
      <td>
        {item.variants.length > 0 ? (
          item.variants.map((v) => (
            <VariantChip key={`${v.label}:${v.value}`}>
              {v.label}: {v.value}
            </VariantChip>
          ))
        ) : (
          <span style={{ opacity: 0.5 }}>—</span>
        )}
      </td>
      <td>
        <Price>{formatINR(item.basePrice)}</Price>
      </td>
      <td>
        <Actions>
          <IconButton onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`}>
            ✎
          </IconButton>
          <IconButton onClick={() => onDelete(item._id)} aria-label={`Delete ${item.name}`}>
            ✕
          </IconButton>
        </Actions>
      </td>
    </>
  );
}

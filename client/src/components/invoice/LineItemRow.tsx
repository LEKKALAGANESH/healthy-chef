import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { IconButton } from '../ui/IconButton';
import { updateLine, removeLine } from '../../features/invoiceDraft/invoiceDraftSlice';
import { calculateLineItem } from '../../utils/invoiceMath';
import { formatINR, rupeesToPaise, paiseToRupees } from '../../utils/money';
import { GST_RATES, DISCOUNT_TYPES } from '../../constants/gst';
import type { DraftLineItem, GstRate, DiscountType } from '../../types/invoice';

const QtyInput = styled.input`
  width: 64px;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  text-align: right;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const DiscountInput = styled(QtyInput)`
  width: 80px;
`;

const SmallSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  background: ${({ theme }) => theme.colors.surface};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const DiscountGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`;

const RowTotal = styled.strong`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};
`;

interface Props {
  line: DraftLineItem;
}

export function LineItemRow({ line }: Props) {
  const dispatch = useDispatch();
  const result = calculateLineItem({
    quantity: line.quantity,
    basePrice: line.basePrice,
    gstRate: line.gstRate,
    discountType: line.discountType,
    discountValue: line.discountValue,
  });

  const isPct = line.discountType === 'percentage';

  return (
    <tr>
      <td>
        {line.itemName}
        {line.variantLabel ? (
          <div style={{ fontSize: 12, opacity: 0.7 }}>{line.variantLabel}</div>
        ) : null}
      </td>
      <td>
        <QtyInput
          type="number"
          min={1}
          value={line.quantity}
          onChange={(e) =>
            dispatch(
              updateLine({
                id: line.id,
                patch: { quantity: Math.max(1, Number(e.target.value) || 1) },
              })
            )
          }
          aria-label="Quantity"
        />
      </td>
      <td>{formatINR(line.basePrice)}</td>
      <td>
        <SmallSelect
          value={String(line.gstRate)}
          onChange={(e) =>
            dispatch(
              updateLine({ id: line.id, patch: { gstRate: Number(e.target.value) as GstRate } })
            )
          }
          aria-label="GST rate"
        >
          {GST_RATES.map((r) => (
            <option key={r} value={r}>
              {r}%
            </option>
          ))}
        </SmallSelect>
      </td>
      <td>
        <DiscountGroup>
          <SmallSelect
            value={line.discountType}
            onChange={(e) =>
              dispatch(
                updateLine({
                  id: line.id,
                  patch: { discountType: e.target.value as DiscountType, discountValue: 0 },
                })
              )
            }
            aria-label="Discount type"
          >
            {DISCOUNT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'percentage' ? '%' : '₹'}
              </option>
            ))}
          </SmallSelect>
          <DiscountInput
            type="number"
            min={0}
            step={isPct ? 1 : 0.01}
            value={isPct ? line.discountValue : paiseToRupees(line.discountValue)}
            onChange={(e) =>
              dispatch(
                updateLine({
                  id: line.id,
                  patch: {
                    discountValue: isPct
                      ? Math.max(0, Number(e.target.value) || 0)
                      : rupeesToPaise(Math.max(0, Number(e.target.value) || 0)),
                  },
                })
              )
            }
            aria-label="Discount value"
          />
        </DiscountGroup>
      </td>
      <td>
        <RowTotal>{formatINR(result.rowTotal)}</RowTotal>
      </td>
      <td>
        <IconButton
          onClick={() => dispatch(removeLine(line.id))}
          aria-label="Remove line"
        >
          ✕
        </IconButton>
      </td>
    </tr>
  );
}

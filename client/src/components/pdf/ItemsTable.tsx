import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as s } from './pdfTheme';
import { formatINRPlain } from '../../utils/money';
import type { InvoiceLineItem } from '../../types/invoice';

function formatDiscount(l: InvoiceLineItem): string {
  return l.discountType === 'percentage' ? `${l.discountValue}%` : formatINRPlain(l.discountValue);
}

export function ItemsTable({ lineItems }: { lineItems: InvoiceLineItem[] }) {
  return (
    <View style={[s.table, s.mt16]} wrap>
      <View style={s.tr}>
        <Text style={[s.th, s.c_item]}>Item</Text>
        <Text style={[s.th, s.c_variant]}>Variant</Text>
        <Text style={[s.th, s.c_qty]}>Qty</Text>
        <Text style={[s.th, s.c_base]}>Base (₹)</Text>
        <Text style={[s.th, s.c_gst]}>GST</Text>
        <Text style={[s.th, s.c_disc]}>Discount</Text>
        <Text style={[s.th, s.c_total]}>Row Total (₹)</Text>
      </View>
      {lineItems.map((l, i) => {
        const isLast = i === lineItems.length - 1;
        return (
          <View
            key={i}
            style={[s.tr, i % 2 === 1 ? s.trAlt : null, isLast ? s.trLast : null].filter(
              (x): x is NonNullable<typeof x> => x != null
            )}
          >
            <Text style={[s.td, s.c_item]}>{l.itemName}</Text>
            <Text style={[s.td, s.c_variant, s.muted]}>{l.variantLabel || '—'}</Text>
            <Text style={[s.td, s.c_qty]}>{l.quantity}</Text>
            <Text style={[s.td, s.c_base]}>{formatINRPlain(l.basePrice)}</Text>
            <Text style={[s.td, s.c_gst]}>{l.gstRate}%</Text>
            <Text style={[s.td, s.c_disc]}>{formatDiscount(l)}</Text>
            <Text style={[s.td, s.c_total]}>{formatINRPlain(l.rowTotal)}</Text>
          </View>
        );
      })}
    </View>
  );
}

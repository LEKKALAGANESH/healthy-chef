import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as s } from './pdfTheme';
import { formatINRPlain } from '../../utils/money';

interface Totals {
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
}

export function SummaryBlock({ totals }: { totals: Totals }) {
  return (
    <View style={s.summary} wrap={false}>
      <View style={s.sumRow}>
        <Text>Subtotal</Text>
        <Text>₹ {formatINRPlain(totals.subtotal)}</Text>
      </View>
      <View style={s.sumRow}>
        <Text>Total Discount</Text>
        <Text>− ₹ {formatINRPlain(totals.totalDiscount)}</Text>
      </View>
      <View style={s.sumRow}>
        <Text>Total GST</Text>
        <Text>+ ₹ {formatINRPlain(totals.totalGst)}</Text>
      </View>
      <View style={s.grandRow}>
        <Text style={s.grand}>GRAND TOTAL</Text>
        <Text style={s.grand}>₹ {formatINRPlain(totals.grandTotal)}</Text>
      </View>
    </View>
  );
}

import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as s } from './pdfTheme';
import { SUPPLIER } from '../../constants/supplier';
import type { Customer } from '../../types/invoice';

export function PartiesBlock({ customer }: { customer: Customer }) {
  return (
    <View style={[s.row, s.mt16]}>
      <View style={s.partyBlock}>
        <Text style={s.h3}>From</Text>
        <Text>{SUPPLIER.name}</Text>
        <Text style={s.muted}>{SUPPLIER.address}</Text>
        <Text style={s.muted}>GSTIN: {SUPPLIER.gstin}</Text>
        <Text style={s.muted}>
          {SUPPLIER.email} · {SUPPLIER.phone}
        </Text>
      </View>
      <View style={s.partyGap} />
      <View style={s.partyBlock}>
        <Text style={s.h3}>Bill To</Text>
        <Text>{customer.name}</Text>
        <Text style={s.muted}>{customer.address}</Text>
        <Text style={s.muted}>{customer.email}</Text>
        <Text style={s.muted}>{customer.phone}</Text>
      </View>
    </View>
  );
}

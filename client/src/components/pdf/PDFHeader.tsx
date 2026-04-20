import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as s } from './pdfTheme';
import { SUPPLIER, DUE_DAYS } from '../../constants/supplier';

interface Props {
  invoiceNumber: string;
  createdAt: string;
}

const fmtDate = (d: Date): string =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export function PDFHeader({ invoiceNumber, createdAt }: Props) {
  const issue = new Date(createdAt);
  const due = new Date(issue);
  due.setDate(due.getDate() + DUE_DAYS);

  return (
    <View style={s.row}>
      <View style={s.col}>
        <Text style={s.h1}>{SUPPLIER.name}</Text>
        <Text style={s.muted}>{SUPPLIER.tagline}</Text>
      </View>
      <View style={[s.col, s.colRight]}>
        <Text style={s.h2}>INVOICE</Text>
        <Text>
          <Text style={s.muted}>Number: </Text>
          {invoiceNumber}
        </Text>
        <Text>
          <Text style={s.muted}>Issue Date: </Text>
          {fmtDate(issue)}
        </Text>
        <Text>
          <Text style={s.muted}>Due Date: </Text>
          {fmtDate(due)}
        </Text>
      </View>
    </View>
  );
}

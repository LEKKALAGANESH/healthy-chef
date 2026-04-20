import { View, Text } from '@react-pdf/renderer';
import { pdfStyles as s } from './pdfTheme';
import { TERMS_AND_CONDITIONS } from '../../constants/gst';

export function PDFFooter() {
  return (
    <View style={s.tc}>
      <Text style={s.h3}>Terms &amp; Conditions</Text>
      {TERMS_AND_CONDITIONS.map((t, i) => (
        <Text key={i}>
          {i + 1}. {t}
        </Text>
      ))}
      <Text style={s.thanks}>Thank you for choosing HealthyChef!</Text>
    </View>
  );
}

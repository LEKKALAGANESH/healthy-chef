import { Font, StyleSheet } from '@react-pdf/renderer';

// Roboto has the ₹ (U+20B9) glyph; react-pdf's built-in Helvetica does not.
// TTFs are served locally from public/assets/fonts/ so PDF generation works offline.
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/assets/fonts/Roboto-Regular.ttf' },
    { src: '/assets/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

const COLORS = {
  accent: '#3A7D44',
  accentAlt: '#F4845F',
  text: '#1F2937',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  rowAlt: '#F9FAFB',
  headerBg: '#F0F7EE',
  surface: '#FFFFFF',
} as const;

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontSize: 10,
    fontFamily: 'Roboto',
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  row: { flexDirection: 'row' },
  col: { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
  colRight: { alignItems: 'flex-end' },
  h1: { fontSize: 22, color: COLORS.accent, fontWeight: 'bold' },
  h2: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: COLORS.accent },
  h3: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.textMuted,
  },
  muted: { color: COLORS.textMuted },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  divider: { borderTopWidth: 1, borderColor: COLORS.border, marginVertical: 12 },

  partyBlock: {
    padding: 10,
    backgroundColor: COLORS.rowAlt,
    borderRadius: 4,
    flexGrow: 1,
    flexBasis: 0,
  },
  partyGap: { width: 12 },

  table: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderColor: COLORS.border },
  trAlt: { backgroundColor: COLORS.rowAlt },
  trLast: { borderBottomWidth: 0 },
  th: {
    padding: 8,
    fontWeight: 'bold',
    backgroundColor: COLORS.headerBg,
    fontSize: 9,
    color: COLORS.text,
  },
  td: { padding: 8, fontSize: 9 },
  c_item: { width: '22%' },
  c_variant: { width: '18%' },
  c_qty: { width: '8%', textAlign: 'right' },
  c_base: { width: '14%', textAlign: 'right' },
  c_gst: { width: '10%', textAlign: 'right' },
  c_disc: { width: '14%', textAlign: 'right' },
  c_total: { width: '14%', textAlign: 'right' },

  summary: {
    marginTop: 16,
    alignSelf: 'flex-end',
    width: '45%',
    padding: 10,
    backgroundColor: COLORS.rowAlt,
    borderRadius: 4,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  grand: { fontWeight: 'bold', fontSize: 13, color: COLORS.accent },

  tc: { marginTop: 24, fontSize: 9, color: COLORS.textMuted, lineHeight: 1.6 },
  pageNumber: {
    position: 'absolute',
    bottom: 24,
    right: 40,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  thanks: { marginTop: 8, fontWeight: 'bold', color: COLORS.accent },
});

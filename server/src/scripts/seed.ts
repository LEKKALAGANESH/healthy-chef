/**
 * Seed the connected MongoDB with realistic HealthyChef demo data.
 *
 * Usage:
 *   npm run seed              # insert only if items + invoices are empty
 *   npm run seed -- --fresh   # drop existing items + invoices, then insert
 */
import { connectDB, disconnectDB } from '../config/db.js';
import { Item } from '../models/Item.js';
import { Invoice } from '../models/Invoice.js';
import {
  calculateInvoice,
  type DiscountType,
  type GstRate,
  type LineItemInput,
} from '../services/invoiceCalc.js';
import { nextInvoiceNumber } from '../services/invoiceNumber.js';

const rupeesToPaise = (rupees: number): number => Math.round(rupees * 100);

const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

interface ItemSeed {
  name: string;
  description: string;
  variants: Array<{ label: string; value: string }>;
  basePriceRupees: number;
}

const itemSeeds: ItemSeed[] = [
  {
    name: 'Grilled Chicken Salad Bowl',
    description: 'Charcoal-grilled chicken breast over mixed greens, cherry tomatoes, cucumbers, and olives with a lemon-herb vinaigrette.',
    variants: [
      { label: 'Size', value: 'Regular' },
      { label: 'Dressing', value: 'Lemon-Herb' },
    ],
    basePriceRupees: 320,
  },
  {
    name: 'Quinoa Power Bowl',
    description: 'Tri-color quinoa, roasted sweet potato, chickpeas, kale, and tahini drizzle. 100% plant-based.',
    variants: [
      { label: 'Size', value: 'Regular' },
      { label: 'Protein', value: 'Chickpea' },
    ],
    basePriceRupees: 290,
  },
  {
    name: 'Avocado Toast (Sourdough)',
    description: 'Smashed Hass avocado on toasted sourdough, chili flakes, microgreens, and a poached egg.',
    variants: [
      { label: 'Bread', value: 'Sourdough' },
      { label: 'Egg', value: 'Poached' },
    ],
    basePriceRupees: 240,
  },
  {
    name: 'Salmon Poke Bowl',
    description: 'Sashimi-grade salmon, sushi rice, edamame, avocado, pickled ginger, sesame, and ponzu.',
    variants: [
      { label: 'Size', value: 'Large' },
      { label: 'Base', value: 'Sushi Rice' },
    ],
    basePriceRupees: 480,
  },
  {
    name: 'Paneer Tikka Bowl',
    description: 'Tandoor-grilled paneer, basmati brown rice, cucumber raita, pickled onions, and mint chutney.',
    variants: [
      { label: 'Spice', value: 'Medium' },
      { label: 'Base', value: 'Brown Rice' },
    ],
    basePriceRupees: 310,
  },
  {
    name: 'Mediterranean Veggie Wrap',
    description: 'Whole-wheat wrap with hummus, falafel, tabbouleh, pickled turnips, and garlic sauce.',
    variants: [
      { label: 'Wrap', value: 'Whole Wheat' },
      { label: 'Sauce', value: 'Garlic Toum' },
    ],
    basePriceRupees: 260,
  },
  {
    name: 'Greek Yogurt Parfait',
    description: 'Layered Greek yogurt with house granola, seasonal berries, and wildflower honey.',
    variants: [
      { label: 'Topping', value: 'Berries + Granola' },
    ],
    basePriceRupees: 180,
  },
  {
    name: 'Cold-Pressed Green Juice',
    description: 'Kale, spinach, cucumber, green apple, celery, and ginger — cold-pressed, no added sugar.',
    variants: [
      { label: 'Volume', value: '250 ml' },
    ],
    basePriceRupees: 220,
  },
  {
    name: 'Protein Smoothie',
    description: 'Whey isolate, almond milk, banana, peanut butter, and cocoa. 28g protein per serving.',
    variants: [
      { label: 'Flavor', value: 'Chocolate Peanut Butter' },
      { label: 'Volume', value: '400 ml' },
    ],
    basePriceRupees: 260,
  },
  {
    name: 'Overnight Oats Jar',
    description: 'Rolled oats soaked overnight in almond milk, chia, vanilla, topped with berries and nuts.',
    variants: [
      { label: 'Topping', value: 'Berries + Almonds' },
    ],
    basePriceRupees: 200,
  },
  {
    name: 'Buddha Bowl',
    description: 'Brown rice, roasted root vegetables, steamed broccoli, edamame, avocado, and miso-ginger dressing.',
    variants: [
      { label: 'Size', value: 'Regular' },
      { label: 'Dressing', value: 'Miso-Ginger' },
    ],
    basePriceRupees: 300,
  },
  {
    name: 'Keto Breakfast Platter',
    description: 'Scrambled eggs, turkey bacon, sautéed spinach, avocado, and grilled cherry tomatoes.',
    variants: [
      { label: 'Eggs', value: 'Scrambled' },
    ],
    basePriceRupees: 340,
  },
];

interface InvoiceSeed {
  customer: { name: string; phone: string; email: string; address: string };
  daysAgo: number;
  lines: Array<{
    itemIndex: number;
    quantity: number;
    gstRate: GstRate;
    discountType: DiscountType;
    discountValue: number; // percent (0-100) or paise
  }>;
}

const invoiceSeeds: InvoiceSeed[] = [
  {
    customer: {
      name: 'Aarav Sharma',
      phone: '+91 98450 11234',
      email: 'aarav.sharma@zyloherbs.in',
      address: '14, MG Road, Indiranagar, Bengaluru, Karnataka 560038',
    },
    daysAgo: 82,
    lines: [
      { itemIndex: 0, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 3, quantity: 1, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 7, quantity: 2, gstRate: 12, discountType: 'absolute', discountValue: rupeesToPaise(40) },
    ],
  },
  {
    customer: {
      name: 'Priya Nair',
      phone: '+91 99801 45678',
      email: 'priya.nair@finewellness.co',
      address: '502, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    },
    daysAgo: 67,
    lines: [
      { itemIndex: 1, quantity: 3, gstRate: 5, discountType: 'percentage', discountValue: 10 },
      { itemIndex: 10, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 10 },
      { itemIndex: 6, quantity: 4, gstRate: 12, discountType: 'percentage', discountValue: 10 },
    ],
  },
  {
    customer: {
      name: 'Rohan Mehta',
      phone: '+91 98111 33445',
      email: 'rohan.mehta@kineticfit.in',
      address: '7, Greater Kailash II, New Delhi 110048',
    },
    daysAgo: 54,
    lines: [
      { itemIndex: 8, quantity: 4, gstRate: 12, discountType: 'absolute', discountValue: rupeesToPaise(100) },
      { itemIndex: 11, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 0 },
    ],
  },
  {
    customer: {
      name: 'Ananya Iyer',
      phone: '+91 97890 22110',
      email: 'ananya.iyer@gmail.com',
      address: '22/3, Besant Nagar, Chennai, Tamil Nadu 600090',
    },
    daysAgo: 41,
    lines: [
      { itemIndex: 2, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 5 },
      { itemIndex: 9, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 5 },
      { itemIndex: 7, quantity: 2, gstRate: 12, discountType: 'percentage', discountValue: 5 },
    ],
  },
  {
    customer: {
      name: 'Vikram Desai',
      phone: '+91 99001 55667',
      email: 'vikram.desai@patelco-labs.com',
      address: '11, Koregaon Park Road 5, Pune, Maharashtra 411001',
    },
    daysAgo: 29,
    lines: [
      { itemIndex: 4, quantity: 5, gstRate: 12, discountType: 'absolute', discountValue: rupeesToPaise(75) },
      { itemIndex: 5, quantity: 3, gstRate: 12, discountType: 'absolute', discountValue: rupeesToPaise(60) },
      { itemIndex: 6, quantity: 3, gstRate: 5, discountType: 'percentage', discountValue: 0 },
    ],
  },
  {
    customer: {
      name: 'Sneha Kulkarni',
      phone: '+91 98234 77889',
      email: 'sneha@nourishstudio.in',
      address: '9, Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033',
    },
    daysAgo: 17,
    lines: [
      { itemIndex: 3, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 0, quantity: 3, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 7, quantity: 3, gstRate: 12, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 9, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 0 },
    ],
  },
  {
    customer: {
      name: 'Karthik Reddy',
      phone: '+91 96220 99001',
      email: 'karthik.reddy@altumsoft.com',
      address: '404, Financial District, Gachibowli, Hyderabad, Telangana 500032',
    },
    daysAgo: 8,
    lines: [
      { itemIndex: 11, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 15 },
      { itemIndex: 2, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 15 },
      { itemIndex: 8, quantity: 2, gstRate: 12, discountType: 'percentage', discountValue: 15 },
    ],
  },
  {
    customer: {
      name: 'Meera Joshi',
      phone: '+91 98331 44556',
      email: 'meera.joshi@verdantwellness.in',
      address: '3B, Alipore Road, Kolkata, West Bengal 700027',
    },
    daysAgo: 2,
    lines: [
      { itemIndex: 10, quantity: 3, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 1, quantity: 2, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 3, quantity: 1, gstRate: 5, discountType: 'percentage', discountValue: 0 },
      { itemIndex: 6, quantity: 4, gstRate: 12, discountType: 'absolute', discountValue: rupeesToPaise(50) },
    ],
  },
];

async function run(): Promise<void> {
  const fresh = process.argv.includes('--fresh');
  await connectDB();
  console.log('✅ Connected to MongoDB');

  if (fresh) {
    const [items, invoices] = await Promise.all([Item.deleteMany({}), Invoice.deleteMany({})]);
    console.log(`🗑️  Wiped ${items.deletedCount} items, ${invoices.deletedCount} invoices`);
  } else {
    const [itemCount, invoiceCount] = await Promise.all([
      Item.countDocuments(),
      Invoice.countDocuments(),
    ]);
    if (itemCount > 0 || invoiceCount > 0) {
      console.log(
        `ℹ️  Skipping — database already contains ${itemCount} items and ${invoiceCount} invoices. Pass --fresh to reset.`
      );
      await disconnectDB();
      return;
    }
  }

  const itemDocs = await Item.insertMany(
    itemSeeds.map((seed) => ({
      name: seed.name,
      description: seed.description,
      variants: seed.variants,
      basePrice: rupeesToPaise(seed.basePriceRupees),
    }))
  );
  console.log(`📦 Inserted ${itemDocs.length} items`);

  const ordered = [...invoiceSeeds].sort((a, b) => b.daysAgo - a.daysAgo);
  let inserted = 0;

  for (const seed of ordered) {
    const created = daysAgo(seed.daysAgo);

    const lineInputs: LineItemInput[] = seed.lines.map((line) => {
      const itemDoc = itemDocs[line.itemIndex];
      if (!itemDoc) throw new Error(`invoice seed references missing item index ${line.itemIndex}`);
      return {
        quantity: line.quantity,
        basePrice: itemDoc.basePrice,
        gstRate: line.gstRate,
        discountType: line.discountType,
        discountValue: line.discountValue,
      };
    });

    const totals = calculateInvoice(lineInputs);

    const lineItems = totals.lineItems.map((row, idx) => {
      const seedLine = seed.lines[idx];
      if (!seedLine) throw new Error('line index out of range');
      const itemDoc = itemDocs[seedLine.itemIndex];
      if (!itemDoc) throw new Error('item doc missing');
      const firstVariant = itemDoc.variants[0];
      return {
        itemId: itemDoc._id,
        itemName: itemDoc.name,
        variantLabel: firstVariant ? firstVariant.value : '',
        quantity: row.quantity,
        basePrice: row.basePrice,
        gstRate: row.gstRate,
        discountType: row.discountType,
        discountValue: row.discountValue,
        rowGross: row.rowGross,
        rowDiscount: row.rowDiscount,
        rowGst: row.rowGst,
        rowTotal: row.rowTotal,
      };
    });

    const invoiceNumber = await nextInvoiceNumber(created);

    const doc = new Invoice({
      invoiceNumber,
      customer: seed.customer,
      lineItems,
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      totalGst: totals.totalGst,
      grandTotal: totals.grandTotal,
    });
    doc.set('createdAt', created);
    doc.set('updatedAt', created);
    await doc.save({ timestamps: false });
    inserted++;
  }

  console.log(`🧾 Inserted ${inserted} invoices`);
  await disconnectDB();
  console.log('✨ Seed complete');
}

run().catch(async (err) => {
  console.error('❌ Seed failed:', err);
  await disconnectDB().catch(() => undefined);
  process.exit(1);
});

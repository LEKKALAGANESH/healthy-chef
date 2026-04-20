import { Item } from '../../models/Item.js';

describe('Item model', () => {
  it('requires name and basePrice', async () => {
    const item = new Item({});
    await expect(item.validate()).rejects.toThrow(/name|basePrice/);
  });

  it('rejects negative basePrice', async () => {
    const item = new Item({ name: 'X', basePrice: -1 });
    await expect(item.validate()).rejects.toThrow(/positive|min/i);
  });

  it('saves with variants and trims name', async () => {
    const saved = await Item.create({
      name: '  Salad  ',
      description: 'Healthy',
      variants: [{ label: 'Size', value: 'Large' }],
      basePrice: 25000,
    });
    expect(saved.name).toBe('Salad');
    expect(saved.basePrice).toBe(25000);
    expect(saved.variants).toHaveLength(1);
    expect(saved.createdAt).toBeInstanceOf(Date);
  });

  it('strips __v from toJSON', async () => {
    const saved = await Item.create({ name: 'X', basePrice: 100 });
    const json = saved.toJSON() as Record<string, unknown>;
    expect(json.__v).toBeUndefined();
  });
});

import { useState, useEffect, FormEvent } from 'react';
import styled from 'styled-components';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Item, ItemInput, Variant } from '../../types/item';
import { rupeesToPaise, paiseToRupees } from '../../utils/money';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const VariantRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: end;
`;

const Footer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

interface Props {
  open: boolean;
  initial?: Item | null;
  isSaving?: boolean;
  onSubmit: (input: ItemInput) => void;
  onClose: () => void;
}

export function ItemFormModal({ open, initial, isSaving, onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description ?? '');
      setPriceRupees(String(paiseToRupees(initial.basePrice)));
      setVariants(initial.variants ?? []);
    } else {
      setName('');
      setDescription('');
      setPriceRupees('');
      setVariants([]);
    }
  }, [initial, open]);

  const updateVariant = (i: number, patch: Partial<Variant>) => {
    setVariants((xs) => xs.map((x, ix) => (ix === i ? { ...x, ...patch } : x)));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      variants: variants.filter((v) => v.label.trim() && v.value.trim()),
      basePrice: rupeesToPaise(Number(priceRupees)),
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Title>{initial ? 'Edit Item' : 'New Item'}</Title>
      <Form onSubmit={submit}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          autoFocus
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        <Input
          label="Base Price (₹)"
          type="number"
          step="0.01"
          min={0}
          value={priceRupees}
          onChange={(e) => setPriceRupees(e.target.value)}
          required
        />
        {variants.map((v, i) => (
          <VariantRow key={i}>
            <Input
              label={i === 0 ? 'Variant label' : undefined}
              placeholder="Size"
              value={v.label}
              onChange={(e) => updateVariant(i, { label: e.target.value })}
            />
            <Input
              label={i === 0 ? 'Variant value' : undefined}
              placeholder="Large"
              value={v.value}
              onChange={(e) => updateVariant(i, { value: e.target.value })}
            />
            <Button
              type="button"
              $variant="ghost"
              onClick={() => setVariants((xs) => xs.filter((_, ix) => ix !== i))}
              aria-label="Remove variant"
            >
              ✕
            </Button>
          </VariantRow>
        ))}
        <Button
          type="button"
          $variant="secondary"
          onClick={() => setVariants((xs) => [...xs, { label: '', value: '' }])}
        >
          + Add variant
        </Button>
        <Footer>
          <Button type="button" $variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : initial ? 'Save' : 'Create'}
          </Button>
        </Footer>
      </Form>
    </Modal>
  );
}

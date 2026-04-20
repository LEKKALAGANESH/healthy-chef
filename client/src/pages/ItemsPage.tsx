import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layouts/PageHeader';
import { ItemRow } from '../components/items/ItemRow';
import { ItemFormModal } from '../components/items/ItemFormModal';
import { ItemListSkeleton } from '../components/skeletons/ItemListSkeleton';
import {
  useItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from '../hooks/useItems';
import type { Item, ItemInput } from '../types/item';
import { staggerContainer, listItem } from '../styles/animations';

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.spacing(6)};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
`;

export default function ItemsPage() {
  const { data: items, isLoading, isError } = useItems();
  const create = useCreateItem();
  const update = useUpdateItem();
  const remove = useDeleteItem();
  const [editing, setEditing] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (input: ItemInput) => {
    if (editing) {
      await update.mutateAsync({ id: editing._id, input });
    } else {
      await create.mutateAsync(input);
    }
    setOpen(false);
    setEditing(null);
  };

  const startEdit = (item: Item) => {
    setEditing(item);
    setOpen(true);
  };

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this item?')) remove.mutate(id);
  };

  return (
    <>
      <PageHeader
        title="Items"
        action={<Button onClick={startCreate}>+ New Item</Button>}
      />
      {isLoading && <ItemListSkeleton />}
      {isError && <ErrorMsg>Failed to load items. Is the server running?</ErrorMsg>}
      {items && items.length === 0 && <Empty>No items yet. Click "+ New Item" to add one.</Empty>}
      {items && items.length > 0 && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Variants</th>
                <th>Price</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <motion.tr key={item._id} variants={listItem} style={{ display: 'table-row' }}>
                  <ItemRow item={item} onEdit={startEdit} onDelete={handleDelete} />
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      )}
      <ItemFormModal
        open={open}
        initial={editing}
        isSaving={create.isPending || update.isPending}
        onSubmit={handleSubmit}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </>
  );
}

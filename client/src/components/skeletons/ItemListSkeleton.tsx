import styled from 'styled-components';
import { BaseSkeleton } from './BaseSkeleton';

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(3)};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 2fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

export function ItemListSkeleton() {
  return (
    <Wrapper>
      {Array.from({ length: 5 }).map((_, i) => (
        <Row key={i}>
          <BaseSkeleton $h="20px" />
          <BaseSkeleton $h="16px" />
          <BaseSkeleton $h="16px" />
          <BaseSkeleton $h="16px" />
          <BaseSkeleton $h="16px" />
        </Row>
      ))}
    </Wrapper>
  );
}

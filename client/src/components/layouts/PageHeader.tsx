import styled from 'styled-components';
import type { ReactNode } from 'react';

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  h2 {
    font-size: ${({ theme }) => theme.typography.sizes.xl};
    color: ${({ theme }) => theme.colors.text};
  }
`;

interface Props {
  title: string;
  action?: ReactNode;
}

export function PageHeader({ title, action }: Props) {
  return (
    <Wrapper>
      <h2>{title}</h2>
      {action}
    </Wrapper>
  );
}

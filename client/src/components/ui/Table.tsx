import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  th,
  td {
    padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
    text-align: left;
    vertical-align: middle;
  }
  thead {
    background: ${({ theme }) => theme.colors.secondary};
  }
  th {
    font-family: ${({ theme }) => theme.typography.fontHeading};
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  tbody tr {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
  tbody tr:first-child {
    border-top: none;
  }
`;

import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.surface};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.accentDark}; }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.accent};
    &:hover:not(:disabled) { background: #E4F0E0; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.secondary}; }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.surface};
    &:hover:not(:disabled) { background: #B91C1C; }
  `,
};

export const Button = styled.button<{
  $variant?: Variant;
  $size?: Size;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ $size, theme }) =>
    $size === 'sm' ? `${theme.spacing(2)} ${theme.spacing(3)}` : `${theme.spacing(3)} ${theme.spacing(5)}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  transition: background ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  ${({ $variant = 'primary' }) => variantStyles[$variant]};
  &:active:not(:disabled) { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

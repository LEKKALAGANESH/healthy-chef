import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.55; }
  100% { opacity: 1; }
`;

export const BaseSkeleton = styled.div<{ $w?: string; $h?: string; $radius?: string }>`
  width: ${({ $w = '100%' }) => $w};
  height: ${({ $h = '16px' }) => $h};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radii.md};
  background: ${({ theme }) => theme.colors.secondary};
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

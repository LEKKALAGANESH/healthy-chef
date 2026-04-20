import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { scaleIn, fadeIn } from '../../styles/animations';
import type { ReactNode } from 'react';

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const Panel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing(6)};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
`;

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: Props) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <Backdrop
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <Panel
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </Panel>
        </Backdrop>
      )}
    </AnimatePresence>,
    document.body
  );
}

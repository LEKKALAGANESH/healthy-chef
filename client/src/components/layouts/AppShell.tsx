import styled from 'styled-components';
import { NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { CONFIG } from '../../constants/config';

const Shell = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => `${theme.spacing(4)} ${theme.spacing(6)}`};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  align-items: center;
  flex-wrap: wrap;

  h1 {
    font-size: ${({ theme }) => theme.typography.sizes.md};
    color: ${({ theme }) => theme.colors.accent};
    margin-right: auto;
  }

  a {
    font-weight: ${({ theme }) => theme.typography.weights.semibold};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
    border-radius: ${({ theme }) => theme.radii.md};
    transition: background ${({ theme }) => theme.transitions.fast};
  }
  a:hover {
    text-decoration: none;
    background: ${({ theme }) => theme.colors.secondary};
  }
  a.active {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const Main = styled.main`
  padding: ${({ theme }) => theme.spacing(6)};
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export function AppShell() {
  return (
    <Shell>
      <Nav>
        <h1>{CONFIG.appName}</h1>
        <NavLink to={ROUTES.items} end>
          Items
        </NavLink>
        <NavLink to={ROUTES.newInvoice}>New Invoice</NavLink>
        <NavLink to={ROUTES.history}>History</NavLink>
      </Nav>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
}

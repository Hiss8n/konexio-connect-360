import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

type RoleLayoutProps = {
  role: 'learner' | 'donor' | 'alumni';
  title: string;
  links: { to: string; label: string }[];
  children?: ReactNode;
};

const RoleLayout = ({ role, title, links, children }: RoleLayoutProps) => {
  return (
    <div style={{ display: 'flex', minHeight: '70vh', gap: 20, padding: '24px 16px 48px' }}>
      <aside
        style={{
          width: 260,
          background: '#0f172a',
          color: '#f8fafc',
          borderRadius: 18,
          padding: 20,
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.8 }}>
          {role}
        </div>
        <h2 style={{ margin: '12px 0 20px', fontSize: 26 }}>{title}</h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#f8fafc' : '#cbd5e1',
                background: isActive ? '#1d4ed8' : 'transparent',
                borderRadius: 10,
                padding: '10px 12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                fontWeight: 600,
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, background: '#f8fafc', borderRadius: 18, padding: 24, boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)' }}>
        {children ?? <Outlet />}
      </main>
    </div>
  );
};

export default RoleLayout;

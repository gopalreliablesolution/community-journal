import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Tag, Hash, Image, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/posts', icon: FileText, label: 'Posts' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/tags', icon: Hash, label: 'Tags' },
  { to: '/admin/media', icon: Image, label: 'Media' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid #E5E7EB',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}>
        {/* Logo / Brand */}
        <div style={{ marginBottom: '32px', padding: '0 8px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '8px' }}>
            <ArrowLeft size={16} style={{ color: '#6B7280' }} />
            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Back to site</span>
          </Link>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Admin Panel
          </h2>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = item.to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  background: isActive ? '#FEF3C7' : 'transparent',
                  color: isActive ? '#B8860B' : '#6B7280',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F9FAFB';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 8px', borderTop: '1px solid #E5E7EB', marginTop: '16px' }}>
          <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Blog Admin v1.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '32px 40px', background: '#F8F9FA', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}

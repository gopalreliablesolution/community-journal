import { Link } from 'react-router-dom';
import { Phone, Mail, Heart, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/apiClient';
import { toast } from 'sonner';

// Inline SVG social icons (not in lucide-react)
const InstagramIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const TwitterIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedinIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      await api.post('/newsletter/subscribe', { email });
    },
    onSuccess: () => {
      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed!');
      setTimeout(() => setSubscribed(false), 4000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to subscribe');
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate(email);
    }
  };

  return (
    <footer
      style={{
        background: '#0A0A0A',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle noise / texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          pointerEvents: 'none',
          opacity: 0.35,
        }}
      />

      {/* Top gold accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #C89B3C 30%, #D4A848 50%, #C89B3C 70%, transparent 100%)' }} />

      {/* ─── MAIN FOOTER BODY ─── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '72px 60px 0', position: 'relative', zIndex: 1 }}>

        {/* ── TOP SECTION: Brand Statement + Columns ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '48px', paddingBottom: '64px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Column 1 – Brand + Newsletter */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Logo - same as navbar: just the image, no text */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src="/logo-gold.png"
                alt="Logo"
                style={{
                  width: '44px',
                  height: '44px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.2s ease',
                  filter: 'brightness(1.1)',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
              />
            </Link>

            {/* Brand tagline */}
            <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', fontWeight: 400, lineHeight: '1.35', color: '#E8E8E8', maxWidth: '400px', letterSpacing: '-0.02em' }}>
              Get updates and announcements{' '}
              <em style={{ fontStyle: 'italic', color: '#C89B3C' }}>delivered to your inbox.</em>
            </p>

            {/* Newsletter form */}
            <form id="newsletter" onSubmit={handleSubscribe} style={{ maxWidth: '420px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '9999px',
                  padding: '5px 5px 5px 20px',
                  gap: '8px',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#ffffff',
                    padding: '8px 0',
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #C89B3C, #8B6914)',
                    color: '#0A0A0A',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '10px 22px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                  {!subscribed && <ArrowRight style={{ width: '12px', height: '12px' }} />}
                </button>
              </div>
            </form>

            {/* Contact Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <a
                href="tel:+918866911763"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#A0A0A0',
                  fontSize: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#C89B3C';
                  e.currentTarget.style.borderColor = 'rgba(200,155,60,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A0A0A0';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(200,155,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone style={{ width: '10px', height: '10px', color: '#C89B3C' }} />
                </div>
                (+91) 8866911763
              </a>

              <a
                href="mailto:kolig7374@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#A0A0A0',
                  fontSize: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#C89B3C';
                  e.currentTarget.style.borderColor = 'rgba(200,155,60,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A0A0A0';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(200,155,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail style={{ width: '10px', height: '10px', color: '#C89B3C' }} />
                </div>
                kolig7374@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2 – Explore Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Latest Articles', to: '/explore' },
                { label: 'Categories', to: '/categories' },
                { label: 'Tags', to: '/tags' },
                { label: 'Write for Us', to: '/write' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={{ color: '#7A7A7A', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s ease', fontWeight: 400 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#7A7A7A')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', margin: 0 }}>
              Socials
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
                { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
                { label: 'Twitter / X', href: 'https://twitter.com', Icon: TwitterIcon },
              ].map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#7A7A7A',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#7A7A7A')}
                  >
                    <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social icon row */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              {[
                { href: 'https://instagram.com', Icon: InstagramIcon },
                { href: 'https://linkedin.com', Icon: LinkedinIcon },
                { href: 'https://twitter.com', Icon: TwitterIcon },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7A7A7A',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C89B3C';
                    e.currentTarget.style.color = '#C89B3C';
                    e.currentTarget.style.background = 'rgba(200,155,60,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#7A7A7A';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  <Icon style={{ width: '14px', height: '14px' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          style={{
            padding: '24px 0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#444444' }}>
            <span>Designed with</span>
            <Heart style={{ width: '12px', height: '12px', fill: '#ef4444', color: '#ef4444', margin: '0 2px' }} />
            <span>by Gopal</span>
          </div>

          {/* Center: legal links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((label) => (
              <a
                key={label}
                href="#"
                style={{ fontSize: '11px', color: '#3D3D3D', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '0.02em' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3D3D')}
              >
                {label}
              </a>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: '#444444' }}>
            © {new Date().getFullYear()} The Landscape Blog. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

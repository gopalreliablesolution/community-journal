import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Search,
  Bell,
  PenSquare,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  History,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useLogout } from '../../features/auth/hooks';
import { useUnreadNotificationCount } from '../../features/notifications/hooks';
import { Avatar } from '../ui/Avatar';
import Button from '../ui/Button';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'EXPLORE', path: '/explore' },
  { name: 'CATEGORIES & TAGS', path: '/categories' },
];

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { data: unreadCount } = useUnreadNotificationCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-close on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #F1F1F1',
        boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div
        className="w-full"
        style={{
          paddingLeft: '60px',
          paddingRight: '60px',
        }}
      >
        {/* <div className="flex items-center justify-between h-20"> */}
        <div className="grid grid-cols-[220px_1fr_auto] items-center h-20">
          {/* ── Left Column: Logo ─────────────────────── */}
          <div className="flex items-center">
            <Link to="/" className="shrink-0">
              <img
                src="/logo-gold.png"
                alt="Community Logo"
                style={{
                  width: '42px',
                  height: '42px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
              />
            </Link>
          </div>

          {/* ── Center Column: Menu (Centered) ────────── */}
          <div className="hidden lg:flex flex-1 justify-center">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="transition-colors duration-200"
                  style={{
                    color: isActive(link.path) ? '#1A1A1A' : '#6B6B6B',
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Right Column: Actions ─────────────────── */}
          <div
            className="hidden md:flex items-center gap-4 shrink-0 justify-end"
            style={{ width: isAuthenticated ? '460px' : '410px' }}
          >

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center" style={{ minWidth: 0 }}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search your blog"
                width={200}
              />
            </form>

            {isAuthenticated ? (
              <div className="flex items-center gap-3.5">
                {/* Write */}
                <Link to="/write">
                  <Button variant="primary" size="sm" className="rounded-full px-5 font-semibold">
                    <PenSquare className="w-3.5 h-3.5 mr-1.5" />
                    Write
                  </Button>
                </Link>

                {/* Notifications Bell Button */}
                <Link
                  to="/notifications"
                  title="Notifications"
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #EFEFEF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1A1A1A',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C89B3C';
                    e.currentTarget.style.borderColor = '#C89B3C';
                    e.currentTarget.style.backgroundColor = '#FDF6E7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1A1A1A';
                    e.currentTarget.style.borderColor = '#EFEFEF';
                    e.currentTarget.style.backgroundColor = '#FAF8F5';
                  }}
                >
                  <Bell style={{ width: '18px', height: '18px' }} />
                  {unreadCount !== undefined && unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#DC3545',
                        boxShadow: '0 0 0 2px #FFFFFF',
                      }}
                    />
                  )}
                </Link>

                {/* Avatar Dropdown Trigger */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 10px 3px 3px',
                      borderRadius: '9999px',
                      backgroundColor: '#FAF8F5',
                      border: userMenuOpen ? '1.5px solid #C89B3C' : '1px solid #EFEFEF',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: userMenuOpen ? '0 2px 10px rgba(200, 155, 60, 0.25)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C89B3C';
                      e.currentTarget.style.backgroundColor = '#FDF6E7';
                    }}
                    onMouseLeave={(e) => {
                      if (!userMenuOpen) {
                        e.currentTarget.style.borderColor = '#EFEFEF';
                        e.currentTarget.style.backgroundColor = '#FAF8F5';
                      }
                    }}
                  >
                    <Avatar
                      name={user?.name || ''}
                      src={user?.avatar?.path}
                      size="sm"
                    />
                    <ChevronDown
                      style={{
                        width: '14px',
                        height: '14px',
                        color: userMenuOpen ? '#C89B3C' : '#6B6B6B',
                        transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease, color 0.2s ease',
                      }}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0px',
                        top: 'calc(100% + 12px)',
                        width: '260px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EFEFEF',
                        borderRadius: '20px',
                        boxShadow: '0 16px 44px rgba(0,0,0,0.14)',
                        padding: '10px',
                        zIndex: 100,
                      }}
                    >
                      {/* User Info Header Box (Links to Public Profile) */}
                      <Link
                        to={`/users/${user?.username}`}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          backgroundColor: '#FAF8F5',
                          borderRadius: '14px',
                          padding: '12px 16px',
                          marginBottom: '8px',
                          border: '1px solid #EFEFEF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          textDecoration: 'none',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F3EB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F5')}
                      >
                        <Avatar
                          name={user?.name || ''}
                          src={user?.avatar?.path}
                          size="md"
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: 0 }} className="truncate">
                            {user?.name}
                          </p>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#C89B3C', margin: '2px 0 0 0' }} className="truncate">
                            @{user?.username}
                          </p>
                        </div>
                      </Link>

                      {/* Navigation Links */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <DropdownLink to="/dashboard" icon={LayoutDashboard} onClick={() => setUserMenuOpen(false)}>
                          Dashboard
                        </DropdownLink>
                        <DropdownLink to="/write" icon={PenSquare} onClick={() => setUserMenuOpen(false)}>
                          Write Article
                        </DropdownLink>
                        <DropdownLink to="/bookmarks" icon={Bookmark} onClick={() => setUserMenuOpen(false)}>
                          Bookmarks
                        </DropdownLink>
                        <DropdownLink to="/history" icon={History} onClick={() => setUserMenuOpen(false)}>
                          Reading History
                        </DropdownLink>
                        <DropdownLink to="/settings/profile" icon={Settings} onClick={() => setUserMenuOpen(false)}>
                          Settings
                        </DropdownLink>
                      </div>

                      {/* Logout */}
                      <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #EFEFEF' }}>
                        <button
                          onClick={() => { logoutMutation.mutate(); setUserMenuOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '15px',
                            fontWeight: 600,
                            borderRadius: '12px',
                            color: '#DC3545',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <LogOut style={{ width: '18px', height: '18px' }} />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest (Aligned with CSS styling of reference button) */
              <div className="flex items-center gap-4">
                <Link
                  to="/auth/login"
                  style={{
                    color: '#C89B3C',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '36px',
                  }}
                  className="hover:opacity-80 transition-opacity"
                >
                  Login
                </Link>
                <Link to="/auth/register" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <button
                    style={{
                      height: '36px',
                      backgroundColor: '#C89B3C',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: 'Inter, sans-serif',
                      padding: '0 20px',
                      borderRadius: '9999px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(200,155,60,0.2)',
                      transition: 'background-color 0.2s, box-shadow 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#A67C1F';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(200,155,60,0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#C89B3C';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(200,155,60,0.2)';
                    }}
                  >
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile: search + hamburger ─────────────── */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full transition-colors duration-200"
              style={{ color: '#6B6B6B' }}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 transition-colors duration-200"
              style={{ color: '#1A1A1A' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileMenuOpen ? '600px' : '0px',
          opacity: mobileMenuOpen ? 1 : 0,
        }}
      >
        <div
          className="px-5 pt-5 pb-6 space-y-5"
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #F1F1F1',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your blog"
            />
          </form>

          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  color: isActive(link.path) ? '#C89B3C' : '#1A1A1A',
                  backgroundColor: isActive(link.path) ? '#FDF6E7' : 'transparent',
                  fontWeight: isActive(link.path) ? 600 : 500,
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth section */}
          <div
            className="pt-3 flex flex-col gap-2"
            style={{ borderTop: '1px solid #F1F1F1' }}
          >
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-2 py-2 mb-1">
                  <Avatar name={user?.name || ''} src={user?.avatar?.path} size="sm" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{user?.name}</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>@{user?.username}</p>
                  </div>
                </div>

                <Link
                  to="/write"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-colors duration-200"
                  style={{ backgroundColor: '#C89B3C', color: '#ffffff' }}
                >
                  <PenSquare className="w-4 h-4" />
                  Write article
                </Link>

                <MobileLink to={`/users/${user?.username}`} icon={LayoutDashboard} onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileLink>
                <MobileLink to="/notifications" icon={Bell} onClick={() => setMobileMenuOpen(false)}>Notifications</MobileLink>
                <MobileLink to="/dashboard/bookmarks" icon={Bookmark} onClick={() => setMobileMenuOpen(false)}>Bookmarks</MobileLink>
                <MobileLink to="/settings/profile" icon={Settings} onClick={() => setMobileMenuOpen(false)}>Settings</MobileLink>

                <button
                  onClick={() => { logoutMutation.mutate(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 mt-1"
                  style={{ color: '#DC3545' }}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 rounded-full font-semibold text-sm transition-colors duration-200"
                  style={{ backgroundColor: '#C89B3C', color: '#ffffff' }}
                >
                  Register
                </Link>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 rounded-full font-semibold text-sm transition-colors duration-200"
                  style={{
                    border: '1px solid #E5E5E5',
                    color: '#1A1A1A',
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Helpers ────────────────────────────────────────────── */

function DropdownLink({
  to,
  icon: Icon,
  onClick,
  children,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        fontSize: '15px',
        fontWeight: 600,
        borderRadius: '12px',
        color: '#1A1A1A',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#FAF8F5';
        e.currentTarget.style.color = '#C89B3C';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#1A1A1A';
      }}
    >
      <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
      {children}
    </Link>
  );
}

function MobileLink({
  to,
  icon: Icon,
  onClick,
  children,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-150"
      style={{ color: '#1A1A1A' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#C89B3C';
        e.currentTarget.style.backgroundColor = '#FDF6E7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1A1A1A';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Icon className="w-4 h-4" style={{ color: '#6B6B6B' } as React.CSSProperties} />
      {children}
    </Link>
  );
}

/* SearchBar — with autocomplete suggestions */
function SearchBar({
  value,
  onChange,
  placeholder = 'Search your blog',
  width = 200,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}) {
  const [focused, setFocused] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceRef = React.useRef<any>(null);
  const blurTimeoutRef = React.useRef<any>(null);

  const currentWidth = focused ? (width + 40) : width;

  // Fetch suggestions on input change
  React.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(value.trim())}&limit=5`);
        const data = await res.json();
        if (data.success && data.data) {
          setSuggestions(data.data);
          setShowSuggestions(data.data.length > 0 && focused);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [value, focused]);

  // Close suggestions on outside click
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (slug: string) => {
    setShowSuggestions(false);
    onChange('');
    navigate(`/posts/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      onChange('');
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setFocused(true);
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay blur to allow click on suggestion to fire first
    blurTimeoutRef.current = setTimeout(() => {
      setFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', zIndex: 200 }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '36px',
          width: `${currentWidth}px`,
          backgroundColor: '#ffffff',
          border: '1.5px solid #C89B3C',
          borderRadius: '9999px',
          padding: '0 12px 0 16px',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(200,155,60,0.08), 0 0 0 3px rgba(200,155,60,0.05)',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), all 0.2s ease',
          cursor: 'text',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C89B3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: 'transparent',
            color: '#1A1A1A',
            border: 'none',
            outline: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
          }}
        />

        {value && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); onChange(''); setSuggestions([]); setShowSuggestions(false); inputRef.current?.focus(); }}
            style={{ color: '#999999', lineHeight: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: '1px solid #E8E8E8',
            overflow: 'hidden',
            zIndex: 9999,
            maxHeight: '360px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((post: any) => (
            <div
              key={post.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(post.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                borderBottom: '1px solid #F5F5F5',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF8F5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {post.coverImage?.path && (
                <img src={post.coverImage.path} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </p>
                <p style={{ fontSize: '11px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.author?.name} · {post.readingTime || 5} min read
                </p>
              </div>
            </div>
          ))}
          <div
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              clearTimeout(blurTimeoutRef.current);
              setShowSuggestions(false);
              navigate(`/search?q=${encodeURIComponent(value.trim())}`);
              onChange('');
            }}
            style={{
              padding: '12px 16px',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: '#C89B3C',
              cursor: 'pointer',
              background: '#FAFAFA',
              borderTop: '1px solid #F1F1F1',
            }}
          >
            View all results for "{value}" →
          </div>
        </div>
      )}
    </div>
  );
}

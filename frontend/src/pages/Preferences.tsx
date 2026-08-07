import { usePreferences, useUpdatePreferences } from '../features/profile/hooks';
import Loader from '../components/ui/Loader';

export default function Preferences() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();

  if (isLoading) {
    return <Loader size="lg" className="min-h-[400px]" />;
  }

  if (!prefs) return null;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#1A1A1A', marginBottom: '32px' }}>
        Preferences
      </h1>

      {/* Notifications */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '20px' }}>Notifications</h2>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', margin: 0 }}>Email notifications</p>
            <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0' }}>Receive email updates about your account activity</p>
          </div>
          <div
            onClick={() => updatePrefs.mutate({ emailNotifications: !prefs.emailNotifications })}
            style={{
              width: '48px', height: '26px', borderRadius: '13px', cursor: 'pointer',
              background: prefs.emailNotifications ? '#C89B3C' : '#D1D5DB',
              position: 'relative', transition: 'background 0.2s ease', flexShrink: 0, marginLeft: '16px',
            }}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
              position: 'absolute', top: '3px', left: prefs.emailNotifications ? '25px' : '3px',
              transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
        </label>
      </div>

      {/* Appearance */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '20px' }}>Appearance</h2>

        <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A', marginBottom: '10px' }}>Theme</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['light', 'dark', 'system'].map((theme) => (
            <button
              key={theme}
              onClick={() => updatePrefs.mutate({ theme })}
              style={{
                padding: '10px 24px', borderRadius: '10px', border: prefs.theme === theme ? '2px solid #C89B3C' : '1px solid #E5E7EB',
                background: prefs.theme === theme ? 'rgba(200,155,60,0.08)' : '#FAF8F5',
                color: prefs.theme === theme ? '#8B6914' : '#6B7280',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '20px' }}>Language</h2>

        <select
          value={prefs.language}
          onChange={(e) => updatePrefs.mutate({ language: e.target.value })}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB',
            background: '#FAF8F5', fontSize: '14px', color: '#1A1A1A', outline: 'none',
          }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
    </div>
  );
}

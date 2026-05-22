import React from 'react';
import { useApp } from '../App';
import { LogoMark } from '../components/Icons';

export default function Login() {
  const { login, loginError } = useApp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const now = new Date();
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
  const dateStr = `${days[now.getDay()]} · ${now.getDate()}. ${months[now.getMonth()]} ${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // error already set in context
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pos-screen shift-open-screen">
      <div className="bg-grid" />
      <div className="brand-strip">
        <div className="logo">
          <span className="mark"><LogoMark fill="var(--b-700)" /></span>
          <span className="wm">gäbig</span>
          <span style={{ fontSize: 11, color: 'var(--n-500)', marginLeft: 8, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 700 }}>· POS</span>
        </div>
        <div className="clock">
          <span>{dateStr}</span>
          <span className="now">{timeStr}</span>
        </div>
      </div>

      <form className="shift-card" style={{ width: 440 }} onSubmit={handleSubmit}>
        <div className="head">
          <span className="eyebrow"><span className="d" />Anmelden</span>
          <h1>Willkommen bei Gäbig.</h1>
          <p className="sub">Melde Dich mit Deinem Bedaya-Konto an, um den Verkauf zu starten.</p>
        </div>

        <div className="shift-form" style={{ gridTemplateColumns: '1fr' }}>
          <div className="f full">
            <label>E-Mail</label>
            <div className={`field-ctrl ${email ? 'focus' : ''}`}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@bedaya.ch"
                style={{ width: '100%' }}
                autoFocus
                required
              />
            </div>
          </div>
          <div className="f full">
            <label>Passwort</label>
            <div className="field-ctrl">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%' }}
                required
              />
              <span
                className="caret"
                style={{ fontSize: 11, color: 'var(--n-500)', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? 'verbergen' : 'anzeigen'}
              </span>
            </div>
          </div>
        </div>

        {loginError && (
          <div style={{
            background: 'var(--p-d-100)', border: '1px solid var(--sem-error)', borderRadius: 8,
            padding: '10px 14px', fontSize: 13, color: 'var(--sem-error)', fontWeight: 700,
          }}>
            {loginError}
          </div>
        )}

        <div className="actions">
          <button
            type="submit"
            className="btn-primary"
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? 'Anmelden …' : 'Anmelden'}
            {!loading && <span style={{ fontSize: 18 }}>→</span>}
          </button>
        </div>

        <div className="recent-shifts" style={{ borderTop: '1px solid var(--n-300)' }}>
          <h6>Schnellanmeldung</h6>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              background: 'var(--egg-200)', border: '1px solid var(--n-300)', borderRadius: 8, cursor: 'pointer',
            }}>
              <span className="av av-c" style={{ width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: 'var(--n-900)' }}>ND</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--n-900)' }}>Nadia D.</div>
                <div style={{ fontSize: 11, color: 'var(--n-500)' }}>PIN-Code</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              background: 'var(--egg-200)', border: '1px solid var(--n-300)', borderRadius: 8, cursor: 'pointer',
            }}>
              <span className="av av-e" style={{ width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: 'var(--n-900)' }}>MR</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--n-900)' }}>Mara R.</div>
                <div style={{ fontSize: 11, color: 'var(--n-500)' }}>PIN-Code</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

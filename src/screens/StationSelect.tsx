import React from 'react';
import { useApp } from '../App';
import { api } from '../api';
import { LogoMark, Icon, ICONS } from '../components/Icons';
import type { LocationFlatDto } from '../types';

export default function StationSelect() {
  const { selectStation, logout, user, station: savedStation } = useApp();
  const [locations, setLocations] = React.useState<LocationFlatDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<LocationFlatDto | null>(savedStation);

  React.useEffect(() => {
    api.listLocationsFlat()
      .then(locs => setLocations(locs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'PO';
  const AV_COLORS = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e', 'av-f'];
  const avColor = AV_COLORS[(user?.email?.charCodeAt(0) ?? 0) % AV_COLORS.length];

  function getLocationLabel(loc: LocationFlatDto): string {
    return loc.path || loc.name;
  }

  function handleContinue() {
    if (selected) selectStation(selected);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: 'var(--n-700)' }}>
          <span className={`av ${avColor}`} style={{ width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: 'var(--n-900)' }}>{initials}</span>
          <span style={{ fontWeight: 700, color: 'var(--b-900)' }}>{user?.email ?? ''}</span>
          <button
            onClick={logout}
            style={{ fontSize: 12, color: 'var(--n-500)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}
          >
            abmelden
          </button>
        </div>
      </div>

      <div className="shift-card" style={{ width: 620 }}>
        <div className="head">
          <span className="eyebrow"><span className="d" />Standort wählen</span>
          <h1>Wo arbeitest Du heute?</h1>
          <p className="sub">Wähle die Kasse oder den Standort. Die Auswahl bestimmt, welche Bestände, Preise und Drucker verbunden werden.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--n-500)' }}>Standorte werden geladen …</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxHeight: 320, overflowY: 'auto' }}>
            {locations.map((loc, i) => {
              const isSelected = selected?.uuid === loc.uuid;
              const isLast = savedStation?.uuid === loc.uuid;
              const abbrev = loc.name.slice(0, 2).toUpperCase();
              return (
                <div
                  key={loc.uuid}
                  onClick={() => setSelected(loc)}
                  style={{
                    padding: 18,
                    background: 'var(--n-100)',
                    border: isSelected ? '2px solid var(--b-500)' : '1px solid var(--n-300)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 0 3px var(--b-100)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: isSelected ? 'var(--b-100)' : 'var(--n-200)',
                      color: isSelected ? 'var(--b-700)' : 'var(--n-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14,
                    }}>
                      {abbrev}
                    </div>
                    {isLast && (
                      <span style={{ fontSize: 9.5, letterSpacing: '.08em', fontWeight: 700, textTransform: 'uppercase', color: 'var(--b-700)', background: 'var(--b-100)', padding: '3px 8px', borderRadius: 99 }}>zuletzt</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, color: isSelected ? 'var(--b-900)' : 'var(--n-900)', fontSize: 15, marginBottom: 2 }}>{loc.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--n-600)', fontFamily: 'var(--mono)' }}>{getLocationLabel(loc)}</div>
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--n-300)', fontSize: 11, color: 'var(--n-500)', fontFamily: 'var(--mono)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span>Standort {i + 1}</span>
                  </div>
                </div>
              );
            })}
            {locations.length === 0 && (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 24, color: 'var(--n-500)' }}>
                Keine Standorte gefunden.
              </div>
            )}
            <div style={{
              padding: 18, background: 'var(--egg-200)', border: '1px dashed var(--n-400)',
              borderRadius: 10, cursor: 'not-allowed', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10, color: 'var(--n-600)', opacity: 0.5,
            }}>
              <Icon d={ICONS.plus} size={18} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>Neuen Standort einrichten</span>
            </div>
          </div>
        )}

        <div className="actions">
          <button className="btn-ghost" onClick={logout}>Zurück</button>
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            disabled={!selected}
            onClick={handleContinue}
          >
            {selected ? `Mit ${selected.name} fortfahren` : 'Standort wählen'}
            <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

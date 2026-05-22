import React from 'react';
import { useApp } from '../App';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import { Icon, ICONS } from '../components/Icons';
import type { CustomerFormData } from '../types';

export default function CustomerDetail() {
  const { viewedCustomer, navigate, startSaleWithCustomer, updateViewedCustomer } = useApp();
  const c = viewedCustomer;

  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<CustomerFormData>(() => ({
    entityType: c?.entityType ?? 'individual',
    firstName: c?.firstName ?? '',
    lastName: c?.lastName ?? '',
    company: c?.company ?? '',
  }));

  React.useEffect(() => {
    if (c) {
      setForm({ entityType: c.entityType, firstName: c.firstName ?? '', lastName: c.lastName ?? '', company: c.company ?? '' });
      setEditing(false);
    }
  }, [c?.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!c) {
    return (
      <div className="pos-screen">
        <NavRail active="customers" />
        <TopBar crumb="Kunden" />
        <div className="cust-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--n-500)' }}>Kein Kunde ausgewählt.</span>
        </div>
      </div>
    );
  }

  const AV_COLORS = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e', 'av-f'];
  const avColor = AV_COLORS[(c.uuid?.charCodeAt(0) ?? 0) % AV_COLORS.length];
  const displayName = c.entityType === 'company'
    ? (c.company ?? '')
    : `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim();
  const initials = displayName.slice(0, 2).toUpperCase() || '??';

  async function handleSave() {
    if (!c) return;
    setSaving(true);
    setError(null);
    try {
      await updateViewedCustomer(c.uuid, form);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!c) return;
    setForm({ entityType: c.entityType, firstName: c.firstName ?? '', lastName: c.lastName ?? '', company: c.company ?? '' });
    setEditing(false);
    setError(null);
  }

  const badgeStyle = {
    fontSize: 9, fontWeight: 700, letterSpacing: '.06em' as const, textTransform: 'uppercase' as const,
    padding: '2px 8px', borderRadius: 99,
    background: c.entityType === 'company' ? 'var(--b-100)' : 'var(--p-c-100)',
    color: c.entityType === 'company' ? 'var(--b-700)' : '#85481b',
  };

  return (
    <div className="pos-screen">
      <NavRail active="customers" />
      <TopBar crumb="Kunden · Detail" />
      <div className="cust-page">
        <div className="pk-head">
          <div className="head-top">
            <button className="back-link" onClick={() => navigate('customer_list')}>
              <Icon d={ICONS.arrowLeft} size={13} /> Alle Kunden
            </button>
          </div>
        </div>
        <div className="cust-detail-body">
          <div className="cust-detail-aside">
            <span className={`cust-av-lg ${avColor}`}>{initials}</span>
            <div>
              <div className="cust-detail-name">{displayName || '(Unbekannt)'}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={badgeStyle}>{c.entityType === 'company' ? 'B2B' : 'Privat'}</span>
                {c.customerNumber && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--n-500)' }}>
                    K-{c.customerNumber}
                  </span>
                )}
              </div>
            </div>
            <div className="cust-action-list">
              <button className="cust-action primary" onClick={() => startSaleWithCustomer(c)}>
                <Icon d={ICONS.cart} size={15} /> Neuen Verkauf starten
              </button>
            </div>
          </div>
          <div className="cust-detail-main">
            <div className="cust-info-card">
              <h5>Kundeninfo</h5>
              {c.entityType === 'individual' ? (
                <>
                  <div className="cust-field">
                    <span className="k">Vorname</span>
                    {editing
                      ? <input value={form.firstName ?? ''} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Vorname" />
                      : <span className="v">{c.firstName || '—'}</span>}
                  </div>
                  <div className="cust-field">
                    <span className="k">Nachname</span>
                    {editing
                      ? <input value={form.lastName ?? ''} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Nachname" />
                      : <span className="v">{c.lastName || '—'}</span>}
                  </div>
                </>
              ) : (
                <div className="cust-field">
                  <span className="k">Firma</span>
                  {editing
                    ? <input value={form.company ?? ''} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Firmenname" />
                    : <span className="v">{c.company || '—'}</span>}
                </div>
              )}
              <div className="cust-field">
                <span className="k">Kundennr.</span>
                <span className="v" style={{ fontFamily: 'var(--mono)' }}>
                  {c.customerNumber ? `K-${c.customerNumber}` : '—'}
                </span>
              </div>
              <div className="cust-field">
                <span className="k">Typ</span>
                <span className="v">{c.entityType === 'company' ? 'Unternehmen' : 'Privatperson'}</span>
              </div>
              <div className="cust-field">
                <span className="k">UUID</span>
                <span className="v" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--n-500)' }}>{c.uuid}</span>
              </div>
            </div>
            {error && (
              <div style={{ padding: '10px 14px', background: 'var(--sem-error)', color: '#fff', borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}
            {editing ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="cust-action primary"
                  style={{ flex: 1 }}
                  onClick={() => void handleSave()}
                  disabled={saving}
                >
                  {saving ? 'Speichert …' : 'Speichern'}
                </button>
                <button className="cust-action secondary" style={{ flex: 'none', width: 'auto' }} onClick={handleCancel}>
                  Abbrechen
                </button>
              </div>
            ) : (
              <button className="cust-action secondary" onClick={() => setEditing(true)}>
                <Icon d={ICONS.cog} size={14} /> Bearbeiten
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

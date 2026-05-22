import React from 'react';
import { useApp } from '../App';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import { Icon, ICONS } from '../components/Icons';
import type { CustomerFormData } from '../types';

export default function CustomerNew() {
  const { saveNewCustomer, customerNewReturnTo, navigate } = useApp();
  const [entityType, setEntityType] = React.useState<'company' | 'individual'>('individual');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canSave = entityType === 'company'
    ? company.trim().length > 0
    : firstName.trim().length > 0 || lastName.trim().length > 0;

  function handleCancel() {
    navigate(customerNewReturnTo === 'sale' ? 'customer_picker' : 'customer_list');
  }

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);
    setError(null);
    const data: CustomerFormData = entityType === 'company'
      ? { entityType: 'company', company: company.trim() }
      : { entityType: 'individual', firstName: firstName.trim(), lastName: lastName.trim() };
    try {
      await saveNewCustomer(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Erstellen');
      setSaving(false);
    }
  }

  return (
    <div className="pos-screen">
      <NavRail active="customers" />
      <TopBar crumb="Kunden · Neu" />
      <div className="cust-page">
        <div className="pk-head">
          <div className="head-top">
            <button className="back-link" onClick={handleCancel}>
              <Icon d={ICONS.arrowLeft} size={13} />
              {customerNewReturnTo === 'sale' ? 'Abbrechen' : 'Zurück zu Kunden'}
            </button>
          </div>
        </div>
        <div className="cust-new-body">
          <div className="cust-new-card">
            <h3>Neuer Kunde</h3>
            <div>
              <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--n-700)', fontWeight: 700, marginBottom: 8 }}>Typ</div>
              <div className="type-toggle">
                <button className={entityType === 'individual' ? 'on' : ''} onClick={() => setEntityType('individual')}>
                  Privatperson
                </button>
                <button className={entityType === 'company' ? 'on' : ''} onClick={() => setEntityType('company')}>
                  Unternehmen
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {entityType === 'company' ? (
                <div className="form-field">
                  <label>Firmenname</label>
                  <input
                    type="text"
                    placeholder="Muster AG"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') void handleSave(); }}
                    autoFocus
                  />
                </div>
              ) : (
                <div className="form-row-two">
                  <div className="form-field">
                    <label>Vorname</label>
                    <input
                      type="text"
                      placeholder="Max"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') void handleSave(); }}
                      autoFocus
                    />
                  </div>
                  <div className="form-field">
                    <label>Nachname</label>
                    <input
                      type="text"
                      placeholder="Muster"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') void handleSave(); }}
                    />
                  </div>
                </div>
              )}
            </div>
            {error && (
              <div style={{ padding: '10px 14px', background: 'var(--sem-error)', color: '#fff', borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}
            <div className="form-actions">
              <button className="save-btn" onClick={() => void handleSave()} disabled={!canSave || saving}>
                {saving ? 'Erstellt …' : 'Kunde erstellen'}
              </button>
              <button className="cancel-btn" onClick={handleCancel}>Abbrechen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

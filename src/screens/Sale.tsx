import React from 'react';
import { useApp } from '../App';
import { api } from '../api';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import CartPanel from '../components/CartPanel';
import CameraView from '../components/CameraView';
import { Icon, ICONS } from '../components/Icons';
import type { CustomerDto } from '../types';

function QuickActions({ onManualSearch, onCustomerPicker }: { onManualSearch: () => void; onCustomerPicker: () => void }) {
  return (
    <div className="panel">
      <h5>Schnellaktionen</h5>
      <div className="qa-grid">
        <div className="qa" onClick={onManualSearch}>
          <div className="ic"><Icon d={ICONS.search} size={15} /></div>
          <div>
            <span className="lbl">Manuell suchen</span>
            <span className="sub">SKU oder Name</span>
          </div>
          <span className="kbd">⌘F</span>
        </div>
        <div className="qa" onClick={onCustomerPicker}>
          <div className="ic"><Icon d={ICONS.user} size={15} /></div>
          <div>
            <span className="lbl">Kunde wählen</span>
            <span className="sub">B2B-Konto</span>
          </div>
          <span className="kbd">⌘K</span>
        </div>
        <div className="qa" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <div className="ic"><Icon d={ICONS.percent} size={15} /></div>
          <div>
            <span className="lbl">Rabatt</span>
            <span className="sub">% oder CHF</span>
          </div>
          <span className="kbd">R</span>
        </div>
        <div className="qa" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <div className="ic"><Icon d={ICONS.pause} size={15} /></div>
          <div>
            <span className="lbl">Parken</span>
            <span className="sub">Verkauf anhalten</span>
          </div>
          <span className="kbd">P</span>
        </div>
      </div>
    </div>
  );
}

function CustomerPicker() {
  const { setCustomer, navigate, sale, openCustomerNew } = useApp();
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<CustomerDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'b2b' | 'private'>('all');
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    searchRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api.listCustomers(search)
        .then(r => setResults(r))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function handleSelect(customer: CustomerDto) {
    setCustomer(customer);
    navigate('sale');
  }

  function handleClear() {
    setCustomer(null);
    navigate('sale');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') navigate('sale');
  }

  const filtered = results.filter(c => {
    if (activeTab === 'b2b') return c.entityType === 'company';
    if (activeTab === 'private') return c.entityType === 'individual';
    return true;
  });

  const getCustomerName = (c: CustomerDto) =>
    c.entityType === 'company' ? (c.company ?? '') : `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim();

  const getInitials = (c: CustomerDto) => getCustomerName(c).slice(0, 2).toUpperCase();

  const AV_COLORS = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e', 'av-f'];

  return (
    <div className="pos-overlay">
      <div className="pos-card cust-picker">
        <div className="pk-head">
          <h3>Kunde wählen</h3>
          <div className="search focus">
            <Icon d={ICONS.search} size={16} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Firma, Name, Kundennr. oder Karte scannen …"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--n-500)', background: 'var(--n-200)', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>Esc</span>
          </div>
          <div className="tabs">
            <button className={activeTab === 'all' ? 'on' : ''} onClick={() => setActiveTab('all')}>Alle</button>
            <button className={activeTab === 'b2b' ? 'on' : ''} onClick={() => setActiveTab('b2b')}>B2B-Konten</button>
            <button className={activeTab === 'private' ? 'on' : ''} onClick={() => setActiveTab('private')}>Privatkunden</button>
          </div>
        </div>
        <div className="pk-list">
          {loading && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--n-500)' }}>Suchen …</div>
          )}
          {!loading && search.trim().length >= 2 && filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--n-500)' }}>Keine Ergebnisse für "{search}"</div>
          )}
          {!loading && search.trim().length < 2 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--n-500)', fontSize: 13 }}>
              Mindestens 2 Zeichen eingeben …
            </div>
          )}
          {filtered.map(customer => {
            const name = getCustomerName(customer);
            const initials = getInitials(customer);
            const avColor = AV_COLORS[(customer.uuid?.charCodeAt(0) ?? 0) % AV_COLORS.length];
            return (
              <div key={customer.uuid} className="pk-row" onClick={() => handleSelect(customer)}>
                <span className={`av ${avColor}`}>{initials}</span>
                <div className="info">
                  <div className="n">
                    {name}
                    <span className={`badge ${customer.entityType === 'company' ? 'b2b' : 'priv'}`}>
                      {customer.entityType === 'company' ? 'B2B' : 'Privat'}
                    </span>
                  </div>
                  <div className="s">{customer.customerNumber ? `K-${customer.customerNumber}` : customer.uuid.slice(0, 8)}</div>
                </div>
                <div className="meta">
                  <div className="k">Typ</div>
                  <div>{customer.entityType === 'company' ? 'Unternehmen' : 'Privat'}</div>
                </div>
                <div className="meta">
                  <div className="k">Nr.</div>
                  <div>{customer.customerNumber ?? '—'}</div>
                </div>
                <div className="arr">→</div>
              </div>
            );
          })}
        </div>
        <div className="pk-foot">
          <button className="ghost-btn" onClick={() => openCustomerNew('sale')}><Icon d={ICONS.plus} size={13} /> Neuer Kunde</button>
          <span className="spacer" />
          <span style={{ fontSize: 11.5, color: 'var(--n-500)' }}>Esc schliessen</span>
          {sale.customer ? (
            <button className="skip" onClick={handleClear}>Ohne Kunde fortfahren</button>
          ) : (
            <button className="skip" onClick={() => navigate('sale')}>Abbrechen</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sale() {
  const { screen, scanProduct, scanError, sale, navigate } = useApp();
  const [scanInput, setScanInput] = React.useState('');
  const [inputFocused, setInputFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (screen === 'sale') {
      inputRef.current?.focus();
    }
  }, [screen]);

  function handleScan(e: React.FormEvent) {
    e.preventDefault();
    const val = scanInput.trim();
    if (!val) return;
    setScanInput('');
    void scanProduct(val);
  }

  const lastScannedItem = sale.lastScannedId
    ? sale.lineItems.find(li => li.id === sale.lastScannedId) ?? null
    : null;

  const isCustomerPicker = screen === 'customer_picker';

  return (
    <div className="pos-screen">
      <NavRail active="sale" />
      <TopBar crumb="Verkauf" />
      <CartPanel dimmed={isCustomerPicker} showActions={!isCustomerPicker} />
      <div className="pos-work">
        <div className="pos-scanbar">
          <form onSubmit={handleScan} style={{ flex: 1, display: 'contents' }}>
            <div className={`input-wrap ${inputFocused ? 'focus' : ''}`} style={{ flex: 1 }}>
              <span className="barcode-ic"><Icon d={ICONS.barcode} size={20} /></span>
              <input
                ref={inputRef}
                type="text"
                placeholder="SKU, EAN oder Artikelname …"
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <span className="kbd">Enter</span>
            </div>
          </form>
          <div className="btn-icon" title="Kamera"><Icon d={ICONS.scan} size={20} /></div>
          <div className="btn-icon" title="Manuell" onClick={() => inputRef.current?.focus()}><Icon d={ICONS.search} size={20} /></div>
        </div>
        <div className="pos-stage">
          <CameraView
            onDetect={barcode => { void scanProduct(barcode); }}
            lastScannedName={lastScannedItem?.name ?? null}
          />
          <div className="pos-side">
            <QuickActions
              onManualSearch={() => inputRef.current?.focus()}
              onCustomerPicker={() => navigate('customer_picker')}
            />
          </div>
        </div>
        {scanError && (
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--sem-error)', color: '#fff', padding: '10px 18px', borderRadius: 99,
            fontSize: 13, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,.3)', zIndex: 10,
            whiteSpace: 'nowrap',
          }}>
            {scanError}
          </div>
        )}
      </div>
      {isCustomerPicker && <CustomerPicker />}
    </div>
  );
}

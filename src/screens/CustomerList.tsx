import React from 'react';
import { useApp } from '../App';
import { api } from '../api';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import { Icon, ICONS } from '../components/Icons';
import type { CustomerDto } from '../types';

export default function CustomerList() {
  const { viewCustomer, openCustomerNew } = useApp();
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<CustomerDto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'b2b' | 'private'>('all');
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { searchRef.current?.focus(); }, []);

  React.useEffect(() => {
    if (search.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      api.listCustomers(search)
        .then(r => setResults(r))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = results.filter(c => {
    if (activeTab === 'b2b') return c.entityType === 'company';
    if (activeTab === 'private') return c.entityType === 'individual';
    return true;
  });

  const getCustomerName = (c: CustomerDto) =>
    c.entityType === 'company' ? (c.company ?? '') : `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim();
  const getInitials = (c: CustomerDto) => getCustomerName(c).slice(0, 2).toUpperCase() || '??';
  const AV_COLORS = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e', 'av-f'];

  return (
    <div className="pos-screen">
      <NavRail active="customers" />
      <TopBar crumb="Kunden" />
      <div className="cust-page">
        <div className="pk-head">
          <div className="head-top">
            <h3>Kunden</h3>
            <button className="ghost-btn" onClick={() => openCustomerNew('customer_list')}>
              <Icon d={ICONS.plus} size={13} /> Neuer Kunde
            </button>
          </div>
          <div className="search">
            <Icon d={ICONS.search} size={16} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Firma, Name oder Kundennr. …"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="tabs">
            {(['all', 'b2b', 'private'] as const).map(tab => (
              <button key={tab} className={activeTab === tab ? 'on' : ''} onClick={() => setActiveTab(tab)}>
                {tab === 'all' ? 'Alle' : tab === 'b2b' ? 'B2B-Konten' : 'Privatkunden'}
              </button>
            ))}
          </div>
        </div>
        <div className="pk-list">
          {loading && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--n-500)' }}>Suchen …</div>
          )}
          {!loading && search.trim().length >= 2 && filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--n-500)' }}>
              Keine Ergebnisse für „{search}"
            </div>
          )}
          {!loading && search.trim().length < 2 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--n-500)', fontSize: 13 }}>
              Mindestens 2 Zeichen eingeben …
            </div>
          )}
          {filtered.map(c => {
            const name = getCustomerName(c);
            const avColor = AV_COLORS[(c.uuid?.charCodeAt(0) ?? 0) % AV_COLORS.length];
            return (
              <div key={c.uuid} className="pk-row" onClick={() => viewCustomer(c)}>
                <span className={`av ${avColor}`}>{getInitials(c)}</span>
                <div className="info">
                  <div className="n">
                    {name || '(Unbekannt)'}
                    <span className={`badge ${c.entityType === 'company' ? 'b2b' : 'priv'}`}>
                      {c.entityType === 'company' ? 'B2B' : 'Privat'}
                    </span>
                  </div>
                  <div className="s">{c.customerNumber ? `K-${c.customerNumber}` : c.uuid.slice(0, 8)}</div>
                </div>
                <div className="meta">
                  <div className="k">Typ</div>
                  <div>{c.entityType === 'company' ? 'Unternehmen' : 'Privat'}</div>
                </div>
                <div className="meta">
                  <div className="k">Nr.</div>
                  <div>{c.customerNumber ?? '—'}</div>
                </div>
                <div className="arr">→</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

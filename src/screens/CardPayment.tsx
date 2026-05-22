import React from 'react';
import { useApp } from '../App';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import CartPanel from '../components/CartPanel';

function fmtCHF(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return '0.00';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export default function CardPayment() {
  const { navigate, sale, confirmPayment } = useApp();
  const { customer } = sale;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { preview, lineItems } = sale;
  const totalGross = preview
    ? fmtCHF(preview.totalGross)
    : fmtCHF(lineItems.reduce((sum, li) => sum + li.quantity * parseFloat(li.unitPrice), 0));

  const customerName = customer
    ? (customer.entityType === 'company' ? (customer.company ?? '') : `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim())
    : null;

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await confirmPayment('card');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler bei der Zahlung');
      setLoading(false);
    }
  }

  return (
    <div className="pos-screen">
      <NavRail active="sale" />
      <TopBar crumb="Verkauf · Karte" />
      <CartPanel compactItems showActions={false} />
      <div className="pos-work">
        <div className="card-stage">
          <div className="pay-summary">
            {customerName && <span>{customerName}</span>}
            {customerName && <span style={{ color: 'var(--n-300)' }}>·</span>}
            <span>{sale.preview?.documentNumber ?? sale.name}</span>
            <span style={{ color: 'var(--n-300)' }}>·</span>
            <span>{lineItems.length} Pos.</span>
            <span style={{ color: 'var(--n-300)' }}>·</span>
            <span>Karte</span>
            <span style={{ color: 'var(--n-300)' }}>·</span>
            <span className="amt">CHF {totalGross}</span>
          </div>

          <div className="terminal-card">
            <div className="terminal-illust">
              <div className="t-led" />
              <div className="t-screen">
                <div className="lbl">Bitte Karte</div>
                <div className="num">{totalGross}</div>
                <div className="dots">
                  <span /><span /><span />
                </div>
              </div>
              <div className="t-keys">
                <span /><span /><span />
                <span /><span /><span />
                <span /><span /><span />
                <span /><span /><span />
              </div>
            </div>

            <h2>Karte am Terminal einlesen</h2>

            {loading ? (
              <div className="status">
                <span className="d" />
                Zahlung wird verarbeitet …
              </div>
            ) : (
              <div className="status">
                <span className="d" />
                Wartet auf Karte · ~30 s
              </div>
            )}

            <div className="meta">
              <span>POS Terminal</span>
              <span>·</span>
              <span>Verbunden</span>
            </div>

            {error && (
              <div style={{
                background: 'var(--p-d-100)', border: '1px solid var(--sem-error)', borderRadius: 8,
                padding: '10px 14px', fontSize: 13, color: 'var(--sem-error)', fontWeight: 700, width: '100%',
              }}>
                {error}
              </div>
            )}

            <button
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Verarbeitung …' : 'Zahlung bestätigen'}
            </button>

            <button className="cancel" onClick={() => navigate('payment_select')} disabled={loading}>
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

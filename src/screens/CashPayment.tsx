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

export default function CashPayment() {
  const { navigate, sale, confirmPayment } = useApp();
  const [received, setReceived] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { preview, lineItems } = sale;
  const totalNum = preview
    ? parseFloat(preview.totalGross)
    : lineItems.reduce((sum, li) => sum + li.quantity * parseFloat(li.unitPrice), 0);
  const totalGross = fmtCHF(totalNum);

  const receivedNum = parseFloat(received.replace(',', '.')) || 0;
  const change = receivedNum - totalNum;
  const canConfirm = receivedNum >= totalNum && !loading;

  function appendDigit(d: string) {
    if (d === ',' || d === '.') {
      if (received.includes(',') || received.includes('.')) return;
      setReceived(v => (v || '0') + ',');
      return;
    }
    setReceived(v => {
      // Limit decimal places to 2
      const dotIdx = v.indexOf(',');
      if (dotIdx !== -1 && v.length - dotIdx > 2) return v;
      if (v === '0' && d !== ',') return d;
      return v + d;
    });
  }

  function backspace() {
    setReceived(v => v.slice(0, -1));
  }

  function setQuick(amount: number) {
    setReceived(fmtCHF(amount).replace('.', ','));
  }

  function setExact() {
    setReceived(fmtCHF(totalNum).replace('.', ','));
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setLoading(true);
    setError(null);
    try {
      await confirmPayment('cash', receivedNum);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler bei der Zahlung');
      setLoading(false);
    }
  }

  return (
    <div className="pos-screen">
      <NavRail active="sale" />
      <TopBar crumb="Verkauf · Bar" />
      <CartPanel compactItems showActions={false} />
      <div className="pos-work">
        <div className="cash-stage">
          <div className="cash-left">
            <div className="display">
              <div className="row total">
                <span>Zu zahlen</span>
                <span className="v">CHF {totalGross}</span>
              </div>
              <div className="row recv">
                <span>Erhalten</span>
                <span className="v">{received ? `CHF ${received}` : '—'}</span>
              </div>
              {receivedNum >= totalNum && (
                <div className="row change">
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1f5a18' }}>Rückgeld</span>
                  <span className="v">CHF {fmtCHF(change)}</span>
                </div>
              )}
              {receivedNum > 0 && receivedNum < totalNum && (
                <div className="row change" style={{ background: 'var(--p-d-100)' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--sem-error)' }}>Fehlend</span>
                  <span className="v" style={{ color: 'var(--sem-error)' }}>CHF {fmtCHF(totalNum - receivedNum)}</span>
                </div>
              )}
            </div>

            <div className="quick">
              {[50, 100, 200, 500].map(amt => (
                <button key={amt} onClick={() => setQuick(amt)}>{amt}</button>
              ))}
              <button className="exact" onClick={setExact}>Passend</button>
            </div>

            <div className="drawer">
              <div className="d-ill" />
              <div className="info">
                <div className="n">Kassenschublade</div>
                <div className="s">Öffnet automatisch bei Bestätigung</div>
              </div>
              <button className="open-btn" type="button">Schublade öffnen</button>
            </div>

            <button
              onClick={() => navigate('payment_select')}
              style={{
                background: 'transparent', border: '1px solid var(--n-300)', color: 'var(--n-700)',
                padding: '12px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              ← Zurück
            </button>
          </div>

          <div className="cash-right">
            {error && (
              <div style={{
                background: 'var(--p-d-100)', border: '1px solid var(--sem-error)', borderRadius: 8,
                padding: '10px 14px', fontSize: 13, color: 'var(--sem-error)', fontWeight: 700,
              }}>
                {error}
              </div>
            )}
            <div className="numpad">
              {['1','2','3','4','5','6','7','8','9'].map(d => (
                <button key={d} onClick={() => appendDigit(d)}>{d}</button>
              ))}
              <button className="op" onClick={() => appendDigit(',')}>.</button>
              <button onClick={() => appendDigit('0')}>0</button>
              <button className="op" onClick={backspace}>⌫</button>
              <button
                className="confirm"
                disabled={!canConfirm}
                onClick={handleConfirm}
              >
                {loading
                  ? 'Verarbeitung …'
                  : canConfirm
                    ? `Bestätigen · Rückgeld ${fmtCHF(change)}`
                    : 'Betrag eingeben'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

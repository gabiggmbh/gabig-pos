import { useApp } from '../App';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import CartPanel from '../components/CartPanel';
import { Icon, ICONS } from '../components/Icons';

function fmtCHF(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return '0.00';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

export default function PaymentSelect() {
  const { navigate, sale, confirmPayment } = useApp();
  const { preview, lineItems, customer } = sale;

  const totalGross = preview
    ? fmtCHF(preview.totalGross)
    : fmtCHF(lineItems.reduce((sum, li) => sum + li.quantity * parseFloat(li.unitPrice), 0));

  const itemCount = lineItems.length;
  const hasB2BCustomer = customer?.entityType === 'company';

  const customerName = customer
    ? (customer.entityType === 'company' ? (customer.company ?? '') : `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim())
    : null;

  return (
    <div className="pos-screen">
      <NavRail active="sale" />
      <TopBar crumb="Verkauf · Zahlung" />
      <CartPanel compactItems showActions={false} />
      <div className="pos-work">
        <div className="pay-stage">
          <div className="head">
            <div>
              <h2>Wie wird bezahlt?</h2>
              <div className="sub">
                {itemCount} Pos.{customerName ? ` · ${customerName}` : ''} · {sale.preview?.documentNumber ?? sale.name}
              </div>
            </div>
            <div className="total-block">
              <div className="k">Total</div>
              <div className="v"><span className="ccy">CHF</span>{totalGross}</div>
            </div>
          </div>

          <div className="pay-tiles">
            <div className="pay-tile card" onClick={() => navigate('card_payment')}>
              <div className="top">
                <div className="ic" />
                <span className="kbd">K</span>
              </div>
              <h4>Karte</h4>
              <p>Debit, Kredit, Apple Pay, Google Pay</p>
              <div className="meta"><span className="d" />Terminal bereit</div>
            </div>

            <div className="pay-tile cash" onClick={() => navigate('cash_payment')}>
              <div className="top">
                <div className="ic" />
                <span className="kbd">B</span>
              </div>
              <h4>Bar</h4>
              <p>Wechselgeld wird berechnet</p>
              <div className="meta"><span className="d" />Kassenschublade</div>
            </div>

            {hasB2BCustomer ? (
              <div className="pay-tile invoice" onClick={() => void confirmPayment('invoice')}>
                <div className="top">
                  <div className="ic" />
                  <span className="kbd">R</span>
                </div>
                <h4>Rechnung</h4>
                <p>Auf Konto {customerName ?? ''} · QR-Rechnung per Mail</p>
                <div className="meta"><span className="d" />Konto aktiv</div>
              </div>
            ) : (
              <div className="pay-tile invoice b2b-only">
                <div className="top">
                  <div className="ic" />
                  <span className="kbd">R</span>
                </div>
                <h4>Rechnung</h4>
                <p>Nur für B2B-Kunden · Kunde zuerst wählen</p>
                <div className="meta" style={{ color: 'var(--n-500)' }}>Kein B2B-Kunde</div>
              </div>
            )}
          </div>

          <div className="pay-foot">
            <button className="back-btn" onClick={() => navigate('sale')}>
              <Icon d={ICONS.arrowLeft} size={14} /> Zurück zum Verkauf
            </button>
            <span className="spacer" />
            <span style={{ fontSize: 12, color: 'var(--n-500)' }}>Klick oder Taste · K / B / R</span>
            <button className="next-btn" onClick={() => navigate('card_payment')}>
              Mit Karte fortfahren <Icon d={ICONS.arrow} size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

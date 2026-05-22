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

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Karte',
  cash: 'Bar',
  invoice: 'Rechnung',
};

export default function Receipt() {
  const { newSale, sale, user, station, company } = useApp();
  const { completedOrder, paymentType, lineItems, customer } = sale;

  const order = completedOrder;
  const payLabel = paymentType ? (PAYMENT_LABELS[paymentType] ?? paymentType) : 'Unbekannt';

  const customerName = customer
    ? (customer.entityType === 'company' ? (customer.company ?? '') : `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim())
    : null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const timeStr = now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="pos-screen">
      <NavRail active="sale" />
      <TopBar crumb="Verkauf · abgeschlossen" />
      <CartPanel showActions={false} />
      <div className="pos-work">
        <div className="receipt-stage">
          <div className="receipt-success">
            <div className="check-ill">✓</div>
            <h1>Verkauf abgeschlossen.</h1>
            <p>
              {payLabel === 'Karte'
                ? `Zahlung von CHF ${fmtCHF(order?.totalGross)} erfolgreich abgewickelt.`
                : payLabel === 'Bar'
                  ? `CHF ${fmtCHF(order?.totalGross)} bar erhalten.`
                  : `Rechnung über CHF ${fmtCHF(order?.totalGross)} erstellt.`
              }
              {' '}Bestand und Buchhaltung sind aktualisiert.
            </p>

            <div className="sale-meta">
              <div className="group">
                <div className="k">Beleg</div>
                <div className="v">{order?.documentNumber ?? order?.name ?? sale.name}</div>
              </div>
              <div className="group">
                <div className="k">Zahlung</div>
                <div className="v">{payLabel}</div>
              </div>
              <div className="group">
                <div className="k">Positionen</div>
                <div className="v">{lineItems.length}</div>
              </div>
              <div className="group">
                <div className="k">Total</div>
                <div className="v">CHF {fmtCHF(order?.totalGross)}</div>
              </div>
              <div className="group">
                <div className="k">Kassierer</div>
                <div className="v">{user?.email ?? 'POS'}</div>
              </div>
              {customerName && (
                <div className="group">
                  <div className="k">Kunde</div>
                  <div className="v">{customerName}</div>
                </div>
              )}
            </div>

            <div className="actions">
              <button className="primary" onClick={newSale}>
                <Icon d={ICONS.plus} size={14} /> Neuer Verkauf
                <span style={{ fontFamily: 'var(--mono)', background: 'rgba(255,255,255,.18)', padding: '1px 6px', borderRadius: 3, fontSize: 11, marginLeft: 6 }}>Enter</span>
              </button>
              <button><Icon d={ICONS.printer} size={14} /> Bon drucken</button>
              <button><Icon d={ICONS.mail} size={14} /> Per Mail</button>
              <button><Icon d={ICONS.copy} size={14} /> Duplizieren</button>
            </div>
          </div>

          <div className="receipt-paper">
            <div className="rp-head">
              <h6>{company?.name?.toUpperCase() ?? ''}</h6>
              <div className="addr">
                {station?.path ?? 'Industriestrasse 8 · 8618 Oetwil am See'}<br />
                mail@gabig.app<br />
                MwSt CHE-148.221.882
              </div>
            </div>
            <div className="rp-meta">
              <span>{order?.documentNumber ?? sale.name}</span>
              <span>{dateStr} {timeStr}</span>
            </div>
            <div className="rp-meta" style={{ marginBottom: 8 }}>
              <span>{station?.name ?? 'POS'} · {user?.email ?? ''}</span>
              {customerName && <span>{customerName}</span>}
            </div>
            <div className="rp-items">
              {(order?.lineItems ?? lineItems.map(li => ({
                uuid: li.id,
                sku: li.sku,
                quantity: String(li.quantity),
                totalGross: String(li.quantity * parseFloat(li.unitPrice)),
                name: li.name,
              }))).map((item, i) => (
                <div key={item.uuid ?? i} className="rp-item">
                  <span className="n">{'name' in item ? (item as { name?: string }).name ?? item.sku : item.sku}</span>
                  <span className="q">{item.quantity}</span>
                  <span className="px">{fmtCHF(item.totalGross)}</span>
                </div>
              ))}
            </div>
            <div className="rp-totals">
              {order ? (
                <>
                  <div className="row"><span>Netto</span><span>{fmtCHF(order.totalNet)}</span></div>
                  {parseFloat(order.totalDiscount) !== 0 && (
                    <div className="row"><span>Rabatt</span><span>−{fmtCHF(order.totalDiscount)}</span></div>
                  )}
                  {order.totalVats.map(v => (
                    <div key={v.vatUuid} className="row"><span>MwSt. {v.vatName}</span><span>{fmtCHF(v.amount)}</span></div>
                  ))}
                  <div className="row t"><span>TOTAL CHF</span><span>{fmtCHF(order.totalGross)}</span></div>
                  <div className="row paid"><span>{payLabel}</span><span>{fmtCHF(order.totalGross)}</span></div>
                </>
              ) : (
                <>
                  <div className="row t"><span>TOTAL CHF</span><span>{fmtCHF(lineItems.reduce((s, li) => s + li.quantity * parseFloat(li.unitPrice), 0))}</span></div>
                  <div className="row paid"><span>{payLabel}</span><span>{fmtCHF(lineItems.reduce((s, li) => s + li.quantity * parseFloat(li.unitPrice), 0))}</span></div>
                </>
              )}
            </div>
            <div className="rp-foot">
              Danke für Deinen Einkauf bei {company?.name ?? ''}.<br />
              Umtausch innert 30 Tagen mit Beleg.
              <div className="qr-tiny" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

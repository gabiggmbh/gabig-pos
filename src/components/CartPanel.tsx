import { useApp } from '../App';
import { Icon, ICONS } from './Icons';
import type { LocalLineItem } from '../types';

function fmtCHF(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return '0.00';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function ItemRow({ item, dimmed }: { item: LocalLineItem; dimmed: boolean }) {
  const { updateQuantity, removeItem, sale } = useApp();
  const isFlash = !dimmed && sale.lastScannedId === item.id;
  const total = (item.quantity * parseFloat(item.unitPrice)).toFixed(2);

  return (
    <div className={`item ${isFlash ? 'flash' : ''}`}>
      <div className="ic">
        <span style={{ fontSize: 18, opacity: 0.7 }}>▱</span>
        <span className="sku">{item.sku.replace(/^SKU-/, '')}</span>
      </div>
      <div className="info">
        <div className="n">{item.name}</div>
        <div className="s">{item.sku}</div>
        <div className="qty-line">
          <div className="qty-ctrl">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
            <span className="q">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <span>Stk × CHF {fmtCHF(item.unitPrice)}</span>
          <button
            onClick={() => removeItem(item.id)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--n-500)', display: 'flex', alignItems: 'center' }}
          >
            <Icon d={ICONS.trash} size={13} />
          </button>
        </div>
      </div>
      <div className="price">
        <div>CHF {total}</div>
        <div className="sub">inkl. MwSt.</div>
      </div>
    </div>
  );
}

export default function CartPanel({
  dimmed = false,
  showActions = true,
  compactItems = false,
}: {
  dimmed?: boolean;
  showActions?: boolean;
  compactItems?: boolean;
}) {
  const { sale, navigate, removeItem } = useApp();
  const { lineItems, preview, customer } = sale;
  const hasItems = lineItems.length > 0;

  const totalGross = preview
    ? fmtCHF(preview.totalGross)
    : fmtCHF(lineItems.reduce((sum, li) => sum + li.quantity * parseFloat(li.unitPrice), 0));
  const totalNet = preview ? fmtCHF(preview.totalNet) : null;
  const totalDiscount = preview && parseFloat(preview.totalDiscount) !== 0 ? fmtCHF(preview.totalDiscount) : null;
  const vatRows = preview?.totalVats ?? [];

  const customerName = customer
    ? (customer.entityType === 'company' ? (customer.company ?? '') : `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim())
    : null;
  const customerInitials = customerName ? customerName.slice(0, 2).toUpperCase() : '';
  const AV_COLORS = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e', 'av-f'];
  const avColor = AV_COLORS[(customer?.uuid?.charCodeAt(0) ?? 0) % AV_COLORS.length];

  return (
    <div className="pos-cart" style={dimmed ? { opacity: 0.55, filter: 'blur(.5px)', pointerEvents: 'none' } : {}}>
      <div className="cart-head">
        <h3>{hasItems ? 'Verkauf' : 'Neuer Verkauf'} <span className="count-tag">{lineItems.length} Pos.</span></h3>
        <span className="sale-id">{preview?.documentNumber ?? sale.name}</span>
        {showActions && hasItems && (
          <div className="actions">
            <button onClick={() => navigate('customer_picker')}><Icon d={ICONS.user} size={12} /> Kunde</button>
            <button onClick={() => { /* park */ }}><Icon d={ICONS.pause} size={12} /> Parken</button>
            <button onClick={() => { lineItems.forEach(li => removeItem(li.id)); }}><Icon d={ICONS.trash} size={12} /> Verwerfen</button>
          </div>
        )}
      </div>

      {customer && customerName && (
        <div className="cust-chip">
          <span className={`av ${avColor}`}>{customerInitials}</span>
          <div>
            <div className="nm">{customerName}</div>
            <div className="sub">{customer.entityType === 'company' ? 'B2B' : 'Privat'}</div>
          </div>
          <span className="badge">{customer.entityType === 'company' ? 'B2B' : 'Privat'}</span>
          <button className="x" onClick={() => navigate('customer_picker')} aria-label="Kunde entfernen">
            <Icon d={ICONS.x} size={14} />
          </button>
        </div>
      )}

      {hasItems ? (
        <div className="items" style={compactItems ? { flex: '0 1 auto', maxHeight: 300 } : {}}>
          {lineItems.map(item => <ItemRow key={item.id} item={item} dimmed={dimmed} />)}
        </div>
      ) : (
        <div className="empty">
          <div className="ill">
            <div className="bars">
              {Array.from({ length: 15 }).map((_, i) => <span key={i} />)}
            </div>
          </div>
          <h4>Bereit. Scan starten.</h4>
          <p>Artikel vor die Kamera halten oder SKU eingeben.</p>
        </div>
      )}

      <div className="totals">
        {totalNet && <div className="row"><span>Subtotal</span><span>CHF {totalNet}</span></div>}
        {totalDiscount && <div className="row discount"><span>Rabatt</span><span>− CHF {totalDiscount}</span></div>}
        {vatRows.map(v => (
          <div key={v.vatUuid} className="row"><span>MwSt. {v.vatName}</span><span>CHF {fmtCHF(v.amount)}</span></div>
        ))}
        {!totalNet && <div className="row"><span>MwSt.</span><span>CHF 0.00</span></div>}
        <div className="row total"><span>Total</span><span className="v">CHF {totalGross}</span></div>
      </div>

      {showActions && (
        <button
          className="pay-btn"
          disabled={!hasItems}
          style={!hasItems ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          onClick={() => hasItems && navigate('payment_select')}
        >
          <span>Bezahlen</span>
          <span className="amt">CHF {totalGross}</span>
          <span className="arr">→</span>
        </button>
      )}
    </div>
  );
}

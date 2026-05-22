import { useApp } from '../App';

export default function TopBar({ crumb = 'Verkauf' }: { crumb?: string }) {
  const { sale, user, station, company } = useApp();
  const now = new Date().toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'PO';
  const saleId = sale.preview?.documentNumber ?? sale.name;
  const AV_COLORS = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e', 'av-f'];
  const avColor = AV_COLORS[(user?.email?.charCodeAt(0) ?? 0) % AV_COLORS.length];

  return (
    <div className="pos-top">
      <div className="breadcrumb">
        <span className="crumb-muted">{company?.name ?? ''}</span>
        <span className="sep">/</span>
        <span>{crumb}</span>
        <span className="sep">/</span>
        <span className="crumb-muted mono" style={{ fontFamily: 'var(--mono)', fontWeight: 400, fontSize: 12 }}>{saleId}</span>
      </div>
      <div className="spacer" />
      <div className="meta-item">
        <span className="pulse" />
        <div>
          <div className="lbl">Terminal</div>
          <div className="val">Verbunden</div>
        </div>
      </div>
      {station && (
        <div className="meta-item">
          <div>
            <div className="lbl">Station</div>
            <div className="val">{station.name}</div>
          </div>
        </div>
      )}
      <div className="meta-item">
        <div>
          <div className="lbl">Zeit</div>
          <div className="val">{now}</div>
        </div>
      </div>
      <div className="cashier">
        <span className={`av ${avColor}`}>{initials}</span>
        <div>
          <div className="nm">{user?.email ?? ''}</div>
          <div className="sub">{station?.name ?? 'POS'}</div>
        </div>
      </div>
    </div>
  );
}

import { useApp } from '../App';
import { Icon, ICONS, LogoMark } from './Icons';

export default function NavRail({ active = 'sale' }: { active?: string }) {
  const { logout } = useApp();
  return (
    <div className="pos-nav">
      <div className="logo"><LogoMark /></div>
      <div className={`nav-item ${active === 'sale' ? 'active' : ''}`}>
        <div className="ic"><Icon d={ICONS.cart} size={20} /></div>
        <span>Verkauf</span>
      </div>
      <div className="nav-item">
        <div className="ic"><Icon d={ICONS.refund} size={20} /></div>
        <span>Retoure</span>
      </div>
      <div className="nav-item">
        <div className="ic"><Icon d={ICONS.user} size={20} /></div>
        <span>Kunden</span>
      </div>
      <div className="nav-item">
        <div className="ic"><Icon d={ICONS.chart} size={20} /></div>
        <span>Berichte</span>
      </div>
      <div className="spacer" />
      <div className="nav-item">
        <div className="ic"><Icon d={ICONS.cog} size={20} /></div>
      </div>
      <div className="nav-item" onClick={logout} style={{ cursor: 'pointer' }}>
        <div className="ic"><Icon d={ICONS.power} size={20} /></div>
      </div>
    </div>
  );
}

// ============================================================
// Gäbig POS — desktop browser app
// All screens stacked in a DesignCanvas, 1440×900 each.
// ============================================================

// ---------- shared sub-components ----------

const LogoMark = ({ fill = "var(--n-100)" }) => (
  <svg viewBox="0 0 29 42" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.39 10.7C22.9 10.7 26.68 14.6 26.68 14.6L23.23 19.98C23.23 19.98 20.23 17.27 16.09 17.27C9.93 17.27 7.43 21.21 7.43 25.56C7.43 31.14 11.29 34.47 15.85 34.47C19.3 34.47 21.8 32.34 21.8 32.34V30.08H17.65V23.96H28.16V40.55H22.17V39.73C22.17 39.11 22.21 38.5 22.21 38.5H22.13C22.13 38.5 19.3 41.05 14.41 41.05C6.9 41.05 0 35.43 0 25.82C0 17.28 6.45 10.71 15.39 10.71V10.7Z" fill={fill}/>
    <path d="M27.72 4.32996V6.54996H1.71997V4.32996H27.72Z" fill={fill}/>
    <path d="M27.72 0V2.22H1.71997V0H27.72Z" fill={fill}/>
  </svg>
);

const Icon = ({ d, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// minimal icon set as SVG paths
const ICONS = {
  cart: "M3 6h2l2.5 11h11l2-8h-14 M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  refund: "M3 12a9 9 0 1 0 3-6.7 M3 4v5h5",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  chart: "M3 3v18h18 M7 14l4-4 3 3 5-6",
  clock: "M12 6v6l4 2 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  power: "M18.36 6.64A9 9 0 1 1 5.64 6.64 M12 2v10",
  barcode: "M4 6v12 M7 6v12 M10 6v8 M10 17v1 M13 6v12 M16 6v8 M16 17v1 M19 6v12",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  percent: "M19 5L5 19 M6.5 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  trash: "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  printer: "M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6",
  arrow: "M5 12h14 M13 5l7 7-7 7",
  arrowLeft: "M19 12H5 M12 19l-7-7 7-7",
  check: "M20 6L9 17l-5-5",
  x: "M6 6l12 12 M18 6L6 18",
  scan: "M4 7V4h3 M17 4h3v3 M20 17v3h-3 M7 20H4v-3 M7 12h10",
  copy: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2 M16 4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2",
  pause: "M6 4h4v16H6z M14 4h4v16h-4z",
};

const NavRail = ({ active = "sale" }) => (
  <div className="pos-nav">
    <div className="logo"><LogoMark /></div>
    <div className={`nav-item ${active === "sale" ? "active" : ""}`}>
      <div className="ic"><Icon d={ICONS.cart} size={20}/></div>
      <span>Verkauf</span>
    </div>
    <div className={`nav-item ${active === "refund" ? "active" : ""}`}>
      <div className="ic"><Icon d={ICONS.refund} size={20}/></div>
      <span>Retoure</span>
    </div>
    <div className={`nav-item ${active === "customers" ? "active" : ""}`}>
      <div className="ic"><Icon d={ICONS.user} size={20}/></div>
      <span>Kunden</span>
    </div>
    <div className={`nav-item ${active === "reports" ? "active" : ""}`}>
      <div className="ic"><Icon d={ICONS.chart} size={20}/></div>
      <span>Berichte</span>
    </div>
    <div className="spacer"></div>
    <div className="nav-item">
      <div className="ic"><Icon d={ICONS.cog} size={20}/></div>
    </div>
    <div className="nav-item">
      <div className="ic"><Icon d={ICONS.power} size={20}/></div>
    </div>
  </div>
);

const TopBar = ({
  crumb = "Verkauf",
  saleId = "S-2026-0418",
  station = "Kasse 02",
  shiftFor = "02:34h",
  cashier = { initials: "ND", name: "Nadia D.", role: "Verkauf · Stage 2", color: "av-c" },
  now = "14:23",
}) => (
  <div className="pos-top">
    <div className="breadcrumb">
      <span className="crumb-muted">Bedaya AG</span>
      <span className="sep">/</span>
      <span>{crumb}</span>
      <span className="sep">/</span>
      <span className="crumb-muted mono" style={{fontFamily:"var(--mono)",fontWeight:400,fontSize:12}}>{saleId}</span>
    </div>
    <div className="spacer"></div>
    <div className="meta-item">
      <span className="pulse"></span>
      <div>
        <div className="lbl">Terminal</div>
        <div className="val">Wallee · ready</div>
      </div>
    </div>
    <div className="meta-item">
      <div>
        <div className="lbl">Station</div>
        <div className="val">{station}</div>
      </div>
    </div>
    <div className="meta-item">
      <div>
        <div className="lbl">Zeit</div>
        <div className="val">{now}</div>
      </div>
    </div>
    <div className="cashier">
      <span className={`av ${cashier.color}`}>{cashier.initials}</span>
      <div>
        <div className="nm">{cashier.name}</div>
        <div className="sub">{cashier.role}</div>
      </div>
    </div>
  </div>
);

const Crosshair = () => (
  <div className="brackets">
    <span></span>
    <span></span>
  </div>
);

// camera viewport — variants: empty / scanned / focused
const CameraView = ({ variant = "scanned" }) => (
  <div className="pos-camera">
    <div className="scene"></div>
    {variant !== "empty" && (
      <div className="box" data-sku="SKU-991022"></div>
    )}
    <Crosshair/>
    <div className="scan-line"></div>
    <div className="cam-meta">
      <span className="rec"></span>
      <span className="lbl">LIVE · USB-Kamera 1</span>
    </div>
    <div className="cam-fps">1080p · 30fps</div>
    {variant === "scanned" && (
      <div className="last-scan">
        <div className="chk"><Icon d={ICONS.check} size={14}/></div>
        <div className="info">
          <div className="n">Kabel HDMI 2m</div>
          <div className="s">SKU-991022 · vor 0.4s · zur Bestellung hinzugefügt</div>
        </div>
        <div className="px">+ CHF 18.90</div>
      </div>
    )}
    {variant === "empty" && (
      <div className="hint"><span className="d"></span>Bereit · Artikel vor die Kamera halten</div>
    )}
  </div>
);

// quick-actions panel (right of camera)
const QuickActions = () => (
  <>
    <div className="panel">
      <h5>Schnellaktionen</h5>
      <div className="qa-grid">
        <div className="qa">
          <div className="ic"><Icon d={ICONS.search} size={15}/></div>
          <div>
            <span className="lbl">Manuell suchen</span>
            <span className="sub">SKU oder Name</span>
          </div>
          <span className="kbd">⌘F</span>
        </div>
        <div className="qa">
          <div className="ic"><Icon d={ICONS.user} size={15}/></div>
          <div>
            <span className="lbl">Kunde wählen</span>
            <span className="sub">B2B-Konto</span>
          </div>
          <span className="kbd">⌘K</span>
        </div>
        <div className="qa">
          <div className="ic"><Icon d={ICONS.percent} size={15}/></div>
          <div>
            <span className="lbl">Rabatt</span>
            <span className="sub">% oder CHF</span>
          </div>
          <span className="kbd">R</span>
        </div>
        <div className="qa">
          <div className="ic"><Icon d={ICONS.pause} size={15}/></div>
          <div>
            <span className="lbl">Parken</span>
            <span className="sub">Verkauf anhalten</span>
          </div>
          <span className="kbd">P</span>
        </div>
      </div>
    </div>
  </>
);

// ShiftBar removed in v2 — kept as a stub for any leftover refs
const ShiftBar = () => null;

const CustomerChip = ({ initials = "MA", name = "Müller AG", terms = "Konto · 30 Tage netto · CHF 12'400 frei", badge = "B2B", color = "av-a" }) => (
  <div className="cust-chip">
    <span className={`av ${color}`}>{initials}</span>
    <div>
      <div className="nm">{name}</div>
      <div className="sub">{terms}</div>
    </div>
    <span className="badge">{badge}</span>
    <button className="x" aria-label="Kunde entfernen"><Icon d={ICONS.x} size={14}/></button>
  </div>
);

const Item = ({ ic = "▱", sku, name, qty = 1, unit = "Stk", price, total, flash = false, note = null }) => (
  <div className={`item ${flash ? "flash" : ""}`}>
    <div className="ic">
      <span style={{fontSize:18,opacity:.7}}>{ic}</span>
      <span className="sku">{sku.replace(/^SKU-/,"")}</span>
    </div>
    <div className="info">
      <div className="n">{name}</div>
      <div className="s">{sku}{note ? ` · ${note}` : ""}</div>
      <div className="qty-line">
        <div className="qty-ctrl">
          <button>−</button>
          <span className="q">{qty}</span>
          <button>+</button>
        </div>
        <span>{unit} × CHF {price}</span>
      </div>
    </div>
    <div className="price">
      <div>CHF {total}</div>
      <div className="sub">inkl. 8.1 %</div>
    </div>
  </div>
);

// ============================================================
// 01 — Login
// ============================================================
const LoginScreen = () => (
  <div className="pos-screen shift-open-screen">
    <div className="bg-grid"></div>
    <div className="brand-strip">
      <div className="logo">
        <span className="mark"><LogoMark fill="var(--b-700)"/></span>
        <span className="wm">gäbig</span>
        <span style={{fontSize:11,color:"var(--n-500)",marginLeft:8,textTransform:"uppercase",letterSpacing:".12em",fontWeight:700}}>· POS</span>
      </div>
      <div className="clock">
        <span>Di · 20. Mai 2026</span>
        <span className="now">07:42</span>
      </div>
    </div>

    <div className="shift-card" style={{width:440}}>
      <div className="head">
        <span className="eyebrow"><span className="d"></span>Anmelden</span>
        <h1>Willkommen bei Gäbig.</h1>
        <p className="sub">Melde Dich mit Deinem Bedaya-Konto an, um den Verkauf zu starten.</p>
      </div>

      <div className="shift-form" style={{gridTemplateColumns:"1fr"}}>
        <div className="f full">
          <label>E-Mail</label>
          <div className="field-ctrl focus">
            <input type="email" defaultValue="nadia.d@bedaya.ch" style={{width:"100%"}}/>
          </div>
        </div>
        <div className="f full">
          <label>Passwort</label>
          <div className="field-ctrl">
            <input type="password" defaultValue="••••••••••" style={{width:"100%"}}/>
            <span className="caret" style={{fontSize:11,color:"var(--n-500)"}}>anzeigen</span>
          </div>
        </div>
        <div className="f full" style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:0,paddingTop:4}}>
          <label style={{display:"flex",alignItems:"center",gap:8,textTransform:"none",letterSpacing:0,fontSize:13,fontWeight:400,color:"var(--n-700)"}}>
            <span style={{width:16,height:16,border:"1.5px solid var(--b-500)",borderRadius:3,background:"var(--b-500)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700}}>✓</span>
            Angemeldet bleiben
          </label>
          <a style={{fontSize:13,color:"var(--b-700)",fontWeight:700,cursor:"pointer"}}>Passwort vergessen?</a>
        </div>
      </div>

      <div className="actions">
        <button className="btn-primary" style={{flex:1}}>
          Anmelden
          <span style={{fontSize:18}}>→</span>
        </button>
      </div>

      <div className="recent-shifts" style={{borderTop:"1px solid var(--n-300)"}}>
        <h6>Schnellanmeldung</h6>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--egg-200)",border:"1px solid var(--n-300)",borderRadius:8,cursor:"pointer"}}>
            <span className="av av-c" style={{width:30,height:30,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"var(--n-900)",fontFamily:"'Helvetica-Custom'"}}>ND</span>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"var(--n-900)"}}>Nadia D.</div>
              <div style={{fontSize:11,color:"var(--n-500)"}}>PIN-Code</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--egg-200)",border:"1px solid var(--n-300)",borderRadius:8,cursor:"pointer"}}>
            <span className="av av-e" style={{width:30,height:30,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"var(--n-900)",fontFamily:"'Helvetica-Custom'"}}>MR</span>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"var(--n-900)"}}>Mara R.</div>
              <div style={{fontSize:11,color:"var(--n-500)"}}>PIN-Code</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 02 — Station / Standort wählen
// ============================================================
const StationSelectScreen = () => (
  <div className="pos-screen shift-open-screen">
    <div className="bg-grid"></div>
    <div className="brand-strip">
      <div className="logo">
        <span className="mark"><LogoMark fill="var(--b-700)"/></span>
        <span className="wm">gäbig</span>
        <span style={{fontSize:11,color:"var(--n-500)",marginLeft:8,textTransform:"uppercase",letterSpacing:".12em",fontWeight:700}}>· POS</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14,fontSize:13,color:"var(--n-700)"}}>
        <span className="av av-c" style={{width:28,height:28,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"var(--n-900)",fontFamily:"'Helvetica-Custom'"}}>ND</span>
        <span style={{fontWeight:700,color:"var(--b-900)"}}>Nadia D.</span>
        <a style={{fontSize:12,color:"var(--n-500)",fontWeight:700,cursor:"pointer"}}>abmelden</a>
      </div>
    </div>

    <div className="shift-card" style={{width:620}}>
      <div className="head">
        <span className="eyebrow"><span className="d"></span>Standort wählen</span>
        <h1>Wo arbeitest Du heute?</h1>
        <p className="sub">Wähle die Kasse oder den Standort. Die Auswahl bestimmt, welche Bestände, Preise und Drucker verbunden werden.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{padding:18,background:"var(--n-100)",border:"2px solid var(--b-500)",borderRadius:10,cursor:"pointer",boxShadow:"0 0 0 3px var(--b-100)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:"var(--b-100)",color:"var(--b-700)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,fontFamily:"'Helvetica-Custom'"}}>K2</div>
            <span style={{fontSize:9.5,letterSpacing:".08em",fontWeight:700,textTransform:"uppercase",color:"var(--b-700)",background:"var(--b-100)",padding:"3px 8px",borderRadius:99}}>zuletzt</span>
          </div>
          <div style={{fontWeight:700,color:"var(--b-900)",fontSize:15,marginBottom:2}}>Kasse 02 · Verkaufsraum</div>
          <div style={{fontSize:12,color:"var(--n-600)",fontFamily:"var(--mono)"}}>Industriestrasse 8 · Oetwil am See</div>
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px dashed var(--n-300)",fontSize:11,color:"var(--n-500)",fontFamily:"var(--mono)",display:"flex",gap:14,flexWrap:"wrap"}}>
            <span style={{color:"var(--sem-success)",fontWeight:700}}>● Wallee verbunden</span>
            <span>Brother QL-820</span>
            <span>Cashlogy</span>
          </div>
        </div>

        <div style={{padding:18,background:"var(--n-100)",border:"1px solid var(--n-300)",borderRadius:10,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:"var(--n-200)",color:"var(--n-700)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,fontFamily:"'Helvetica-Custom'"}}>K1</div>
            <span style={{fontSize:11,color:"var(--n-500)",fontFamily:"var(--mono)"}}>belegt von Mara R.</span>
          </div>
          <div style={{fontWeight:700,color:"var(--n-900)",fontSize:15,marginBottom:2}}>Kasse 01 · Trade Counter</div>
          <div style={{fontSize:12,color:"var(--n-600)",fontFamily:"var(--mono)"}}>Industriestrasse 8 · Oetwil am See</div>
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px dashed var(--n-300)",fontSize:11,color:"var(--n-500)",fontFamily:"var(--mono)",display:"flex",gap:14,flexWrap:"wrap"}}>
            <span style={{color:"var(--sem-success)",fontWeight:700}}>● Wallee verbunden</span>
            <span>Zebra ZD421</span>
            <span>Cashlogy</span>
          </div>
        </div>

        <div style={{padding:18,background:"var(--n-100)",border:"1px solid var(--n-300)",borderRadius:10,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:8,background:"var(--n-200)",color:"var(--n-700)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,fontFamily:"'Helvetica-Custom'"}}>K3</div>
            <span style={{fontSize:9.5,letterSpacing:".08em",fontWeight:700,textTransform:"uppercase",color:"var(--n-500)"}}>frei</span>
          </div>
          <div style={{fontWeight:700,color:"var(--n-900)",fontSize:15,marginBottom:2}}>Kasse 03 · Lagerausgabe</div>
          <div style={{fontSize:12,color:"var(--n-600)",fontFamily:"var(--mono)"}}>Industriestrasse 8 · Oetwil am See</div>
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px dashed var(--n-300)",fontSize:11,color:"var(--n-500)",fontFamily:"var(--mono)",display:"flex",gap:14,flexWrap:"wrap"}}>
            <span style={{color:"var(--n-500)",fontWeight:700}}>○ Kein Terminal</span>
            <span>Brother QL-820</span>
          </div>
        </div>

        <div style={{padding:18,background:"var(--egg-200)",border:"1px dashed var(--n-400)",borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,color:"var(--n-600)"}}>
          <Icon d={ICONS.plus} size={18}/>
          <span style={{fontWeight:700,fontSize:13}}>Neuen Standort einrichten</span>
        </div>
      </div>

      <div className="actions">
        <button className="btn-ghost">Zurück</button>
        <button className="btn-primary" style={{flex:1}}>
          Mit Kasse 02 fortfahren
          <span style={{fontSize:18}}>→</span>
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// 02 — Sale screen — empty (waiting for first scan)
// ============================================================
const SaleEmptyScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar saleId="S-2026-0419"/>
    <div className="pos-cart">
      <div className="cart-head">
        <h3>Neuer Verkauf <span className="count-tag">0 Pos.</span></h3>
        <span className="sale-id">S-2026-0419 · gestartet 14:22</span>
      </div>
      <div className="empty">
        <div className="ill">
          <div className="bars">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <h4>Bereit. Scan starten.</h4>
        <p>Halte den Artikel vor die Kamera oder tippe die SKU im Feld rechts oben. Tastatur-Scanner funktioniert genauso.</p>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <span className="kbd">⌘F</span>
          <span style={{fontSize:11,color:"var(--n-500)"}}>manuelle Suche</span>
          <span className="kbd" style={{marginLeft:10}}>⌘K</span>
          <span style={{fontSize:11,color:"var(--n-500)"}}>Kunde wählen</span>
        </div>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 0.00</span></div>
        <div className="row"><span>MwSt. 8.1 %</span><span className="v">CHF 0.00</span></div>
        <div className="row total"><span>Total</span><span className="v">CHF 0.00</span></div>
      </div>
      <button className="pay-btn" disabled style={{opacity:.4,cursor:"not-allowed"}}>
        Bezahlen <span className="amt">CHF 0.00</span>
      </button>
    </div>
    <div className="pos-work">
      <div className="pos-scanbar">
        <div className="input-wrap focus">
          <span className="barcode-ic"><Icon d={ICONS.barcode} size={20}/></span>
          <input type="text" placeholder="SKU, EAN oder Artikelname …" />
          <span className="kbd">Enter</span>
        </div>
        <div className="btn-icon" title="Kamera"><Icon d={ICONS.scan} size={20}/></div>
        <div className="btn-icon" title="Manuell"><Icon d={ICONS.search} size={20}/></div>
      </div>
      <div className="pos-stage">
        <CameraView variant="empty"/>
        <div className="pos-side">
          <QuickActions/>
        </div>
      </div>
      <ShiftBar count={0} sales="CHF 0.00" twint={0} card={0} cash={0}/>
    </div>
  </div>
);

// ============================================================
// 03 — Sale screen — 5 items + B2B customer
// ============================================================
const SaleActiveScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar/>
    <div className="pos-cart">
      <div className="cart-head">
        <h3>Verkauf <span className="count-tag">5 Pos.</span></h3>
        <span className="sale-id">S-2026-0418 · gestartet 14:18</span>
        <div className="actions">
          <button><Icon d={ICONS.percent} size={12}/> Rabatt</button>
          <button><Icon d={ICONS.copy} size={12}/> Notiz</button>
          <button><Icon d={ICONS.pause} size={12}/> Parken</button>
          <button><Icon d={ICONS.trash} size={12}/> Verwerfen</button>
        </div>
      </div>
      <CustomerChip/>
      <div className="items">
        <Item ic="◧" sku="SKU-991022" name="Kabel HDMI 2.1 · 2 m" qty="1" price="18.90" total="18.90" flash/>
        <Item ic="◐" sku="SKU-101782" name="Bohrkrone Ø 20 mm · HSS" qty="2" price="89.00" total="178.00"/>
        <Item ic="◑" sku="SKU-882244" name="Holzschutzlasur 5 L · Eiche dunkel" qty="1" price="64.80" total="64.80"/>
        <Item ic="◮" sku="SKU-449128" name="Schraubenset M6 · sortiert" qty="3" price="24.50" total="73.50" note="Aktion −10 %"/>
        <Item ic="◭" sku="SKU-228130" name="Dichtungsring 40 mm · 12er-Pack" qty="1" price="13.30" total="13.30"/>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 348.50</span></div>
        <div className="row discount"><span>Rabatt B2B · −5 %</span><span className="v">− CHF 17.43</span></div>
        <div className="row"><span>MwSt. 8.1 %</span><span className="v">CHF 26.84</span></div>
        <div className="row total"><span>Total</span><span className="v">CHF 357.91</span></div>
      </div>
      <button className="pay-btn">
        <span>Bezahlen</span>
        <span className="amt">CHF 357.91</span>
        <span className="arr">→</span>
      </button>
    </div>
    <div className="pos-work">
      <div className="pos-scanbar">
        <div className="input-wrap">
          <span className="barcode-ic"><Icon d={ICONS.barcode} size={20}/></span>
          <input type="text" placeholder="SKU, EAN oder Artikelname …" />
          <span className="kbd">Enter</span>
        </div>
        <div className="btn-icon" title="Kamera"><Icon d={ICONS.scan} size={20}/></div>
        <div className="btn-icon" title="Manuell"><Icon d={ICONS.search} size={20}/></div>
      </div>
      <div className="pos-stage">
        <CameraView variant="scanned"/>
        <div className="pos-side">
          <QuickActions/>
        </div>
      </div>
      <ShiftBar/>
    </div>
  </div>
);

// ============================================================
// 04 — Customer picker (overlay on sale)
// ============================================================
const CustomerPickerScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar/>
    {/* dimmed cart panel underneath */}
    <div className="pos-cart" style={{opacity:.55,filter:"blur(.5px)"}}>
      <div className="cart-head">
        <h3>Verkauf <span className="count-tag">5 Pos.</span></h3>
        <span className="sale-id">S-2026-0418 · gestartet 14:18</span>
      </div>
      <div className="items">
        <Item ic="◧" sku="SKU-991022" name="Kabel HDMI 2.1 · 2 m" qty="1" price="18.90" total="18.90"/>
        <Item ic="◐" sku="SKU-101782" name="Bohrkrone Ø 20 mm · HSS" qty="2" price="89.00" total="178.00"/>
        <Item ic="◑" sku="SKU-882244" name="Holzschutzlasur 5 L · Eiche dunkel" qty="1" price="64.80" total="64.80"/>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 348.50</span></div>
        <div className="row total"><span>Total</span><span className="v">CHF 376.74</span></div>
      </div>
    </div>
    <div className="pos-work" style={{opacity:.55,filter:"blur(.5px)"}}>
      <div className="pos-scanbar">
        <div className="input-wrap">
          <span className="barcode-ic"><Icon d={ICONS.barcode} size={20}/></span>
          <input type="text" placeholder="SKU, EAN oder Artikelname …" />
        </div>
      </div>
      <div className="pos-stage">
        <CameraView variant="scanned"/>
        <div className="pos-side"><QuickActions/></div>
      </div>
    </div>

    <div className="pos-overlay">
      <div className="pos-card cust-picker">
        <div className="pk-head">
          <h3>Kunde wählen</h3>
          <div className="search focus">
            <Icon d={ICONS.search} size={16}/>
            <input type="text" placeholder="Firma, Name, Kundennr. oder Karte scannen …" defaultValue="müll"/>
            <span style={{fontFamily:"var(--mono)",fontSize:10.5,color:"var(--n-500)",background:"var(--n-200)",padding:"2px 7px",borderRadius:4,fontWeight:700}}>Esc</span>
          </div>
          <div className="tabs">
            <button className="on">Zuletzt</button>
            <button>B2B-Konten</button>
            <button>Privatkunden</button>
            <button>Alle (1'428)</button>
            <button style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
              <Icon d={ICONS.scan} size={13}/> Karte scannen
            </button>
          </div>
        </div>
        <div className="pk-list">
          <div className="pk-row" style={{background:"var(--b-100)"}}>
            <span className="av av-a">MA</span>
            <div className="info">
              <div className="n">Müller AG <span className="badge b2b">B2B</span></div>
              <div className="s">K-1042 · Industriestrasse 14, 8050 Zürich</div>
            </div>
            <div className="meta"><div className="k">Konto</div><div>30 Tage netto</div></div>
            <div className="meta"><div className="k">Frei</div><div style={{color:"var(--sem-success)",fontWeight:700}}>CHF 12'400</div></div>
            <div className="arr">→</div>
          </div>
          <div className="pk-row">
            <span className="av av-c">MS</span>
            <div className="info">
              <div className="n">Müller &amp; Söhne GmbH <span className="badge b2b">B2B</span></div>
              <div className="s">K-2218 · Bahnhofstrasse 4, 8400 Winterthur</div>
            </div>
            <div className="meta"><div className="k">Konto</div><div>14 Tage netto</div></div>
            <div className="meta"><div className="k">Frei</div><div style={{color:"var(--sem-success)",fontWeight:700}}>CHF 4'800</div></div>
            <div className="arr">→</div>
          </div>
          <div className="pk-row">
            <span className="av av-e">SM</span>
            <div className="info">
              <div className="n">Sandra Müller <span className="badge priv">Privat</span></div>
              <div className="s">K-7720 · Mitglied seit 2024 · zuletzt 12.05.</div>
            </div>
            <div className="meta"><div className="k">Punkte</div><div>1'248</div></div>
            <div className="meta"><div className="k">Letzter</div><div>CHF 89.50</div></div>
            <div className="arr">→</div>
          </div>
          <div className="pk-row">
            <span className="av av-f">MK</span>
            <div className="info">
              <div className="n">Müller-Keller AG <span className="badge b2b">B2B</span></div>
              <div className="s">K-3340 · Seestrasse 21, 8700 Küsnacht</div>
            </div>
            <div className="meta"><div className="k">Konto</div><div>30 Tage netto</div></div>
            <div className="meta"><div className="k">Frei</div><div style={{color:"var(--sem-warning)",fontWeight:700}}>CHF 240</div></div>
            <div className="arr">→</div>
          </div>
          <div className="pk-row">
            <span className="av av-b">PM</span>
            <div className="info">
              <div className="n">Peter Müller <span className="badge priv">Privat</span></div>
              <div className="s">K-8819 · Mitglied seit 2022 · zuletzt 18.04.</div>
            </div>
            <div className="meta"><div className="k">Punkte</div><div>448</div></div>
            <div className="meta"><div className="k">Letzter</div><div>CHF 24.20</div></div>
            <div className="arr">→</div>
          </div>
        </div>
        <div className="pk-foot">
          <button className="ghost-btn"><Icon d={ICONS.plus} size={13}/> Neuer Kunde</button>
          <span className="spacer"></span>
          <span style={{fontSize:11.5,color:"var(--n-500)"}}>Pfeil ↑↓ navigieren · Enter wählen</span>
          <button className="skip">Ohne Kunde fortfahren</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 05 — Payment method selection
// ============================================================
const PaymentSelectScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar crumb="Verkauf · Zahlung"/>
    <div className="pos-cart">
      <div className="cart-head">
        <h3>Zu zahlen <span className="count-tag">5 Pos.</span></h3>
        <span className="sale-id">S-2026-0418</span>
      </div>
      <CustomerChip/>
      <div className="items" style={{flex:"0 1 auto",maxHeight:300}}>
        <Item ic="◧" sku="SKU-991022" name="Kabel HDMI 2.1 · 2 m" qty="1" price="18.90" total="18.90"/>
        <Item ic="◐" sku="SKU-101782" name="Bohrkrone Ø 20 mm · HSS" qty="2" price="89.00" total="178.00"/>
        <Item ic="◑" sku="SKU-882244" name="Holzschutzlasur 5 L" qty="1" price="64.80" total="64.80"/>
        <Item ic="◮" sku="SKU-449128" name="Schraubenset M6" qty="3" price="24.50" total="73.50"/>
        <Item ic="◭" sku="SKU-228130" name="Dichtungsring 40 mm" qty="1" price="13.30" total="13.30"/>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 348.50</span></div>
        <div className="row discount"><span>Rabatt B2B · −5 %</span><span className="v">− CHF 17.43</span></div>
        <div className="row"><span>MwSt. 8.1 %</span><span className="v">CHF 26.84</span></div>
        <div className="row total"><span>Total</span><span className="v">CHF 357.91</span></div>
      </div>
    </div>
    <div className="pos-work">
      <div className="pay-stage">
        <div className="head">
          <div>
            <h2>Wie wird bezahlt?</h2>
            <div className="sub">5 Positionen · Müller AG · S-2026-0418 · 14:23</div>
          </div>
          <div className="total-block">
            <div className="k">Total</div>
            <div className="v"><span className="ccy">CHF</span>357.91</div>
          </div>
        </div>

        <div className="pay-tiles">
          <div className="pay-tile card on">
            <div className="top">
              <div className="ic"></div>
              <span className="kbd">K</span>
            </div>
            <h4>Karte</h4>
            <p>Wallee · Debit, Kredit, Apple Pay, Google Pay</p>
            <div className="meta"><span className="d"></span>Terminal bereit</div>
          </div>
          <div className="pay-tile cash">
            <div className="top">
              <div className="ic"></div>
              <span className="kbd">B</span>
            </div>
            <h4>Bar</h4>
            <p>Schublade öffnet automatisch · Wechselgeld wird berechnet</p>
            <div className="meta"><span className="d"></span>Cashlogy online</div>
          </div>
          <div className="pay-tile invoice">
            <div className="top">
              <div className="ic"></div>
              <span className="kbd">R</span>
            </div>
            <h4>Rechnung</h4>
            <p>Auf Konto Müller AG · 30 Tage netto · QR-Rechnung per Mail</p>
            <div className="meta"><span className="d"></span>Limit CHF 12'400 frei</div>
          </div>
          <div className="pay-tile voucher">
            <div className="top">
              <div className="ic"></div>
              <span className="kbd">G</span>
            </div>
            <h4>Gutschein</h4>
            <p>Code eingeben oder QR scannen · Restbetrag möglich</p>
            <div className="meta" style={{color:"var(--n-500)"}}>4'218 aktive Codes</div>
          </div>
          <div className="pay-tile split">
            <div className="top">
              <div className="ic"></div>
              <span className="kbd">+</span>
            </div>
            <h4>Aufteilen</h4>
            <p>Mehrere Zahlungsarten kombinieren · z.B. CHF 200 Karte, Rest Bar</p>
            <div className="meta" style={{color:"var(--n-500)"}}>Split-Modus aktivieren</div>
          </div>
        </div>

        <div className="pay-foot">
          <button className="back-btn"><Icon d={ICONS.arrowLeft} size={14}/> Zurück zum Verkauf</button>
          <span className="spacer"></span>
          <span style={{fontSize:12,color:"var(--n-500)"}}>Auswahl mit Tastatur oder Klick · Enter bestätigt</span>
          <button className="next-btn">Mit Karte fortfahren <Icon d={ICONS.arrow} size={14}/></button>
        </div>
      </div>
      <ShiftBar/>
    </div>
  </div>
);

// ============================================================
// 06 — Card payment in progress
// ============================================================
const CardPaymentScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar crumb="Verkauf · Karte"/>
    <div className="pos-cart">
      <div className="cart-head">
        <h3>Zahlung läuft <span className="count-tag">Karte</span></h3>
        <span className="sale-id">S-2026-0418</span>
      </div>
      <CustomerChip/>
      <div className="items" style={{flex:"0 1 auto",maxHeight:280}}>
        <Item ic="◧" sku="SKU-991022" name="Kabel HDMI 2.1 · 2 m" qty="1" price="18.90" total="18.90"/>
        <Item ic="◐" sku="SKU-101782" name="Bohrkrone Ø 20 mm" qty="2" price="89.00" total="178.00"/>
        <Item ic="◑" sku="SKU-882244" name="Holzschutzlasur 5 L" qty="1" price="64.80" total="64.80"/>
        <Item ic="◮" sku="SKU-449128" name="Schraubenset M6" qty="3" price="24.50" total="73.50"/>
        <Item ic="◭" sku="SKU-228130" name="Dichtungsring 40 mm" qty="1" price="13.30" total="13.30"/>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 348.50</span></div>
        <div className="row discount"><span>Rabatt B2B · −5 %</span><span className="v">− CHF 17.43</span></div>
        <div className="row"><span>MwSt. 8.1 %</span><span className="v">CHF 26.84</span></div>
        <div className="row total"><span>Total</span><span className="v">CHF 357.91</span></div>
      </div>
    </div>
    <div className="pos-work">
      <div className="card-stage">
        <div className="pay-summary">
          <span>Müller AG · S-2026-0418 · 5 Pos.</span>
          <span style={{color:"var(--n-300)"}}>·</span>
          <span>Karte</span>
          <span style={{color:"var(--n-300)"}}>·</span>
          <span className="amt">CHF 357.91</span>
        </div>
        <div className="terminal-card">
          <div className="terminal-illust">
            <div className="t-led"></div>
            <div className="t-screen">
              <div className="lbl">Bitte Karte</div>
              <div className="num">357.91</div>
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
            <div className="t-keys">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </div>
          </div>
          <h2>Karte am Terminal einlesen</h2>
          <div className="status"><span className="d"></span>Wartet auf Karte · ~30 s</div>
          <div className="meta">
            <span>Wallee Terminal · #WL-22-04018</span>
            <span>·</span>
            <span>Verbindung 4G</span>
            <span>·</span>
            <span>Latenz 84 ms</span>
          </div>
          <button className="cancel">Abbrechen</button>
        </div>
      </div>
      <ShiftBar/>
    </div>
  </div>
);

// ============================================================
// 08 — Cash payment with change calc
// ============================================================
const CashScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar crumb="Verkauf · Bar"/>
    <div className="pos-cart">
      <div className="cart-head">
        <h3>Zahlung läuft <span className="count-tag">Bar</span></h3>
        <span className="sale-id">S-2026-0418</span>
      </div>
      <CustomerChip/>
      <div className="items" style={{flex:"0 1 auto",maxHeight:280}}>
        <Item ic="◧" sku="SKU-991022" name="Kabel HDMI 2.1 · 2 m" qty="1" price="18.90" total="18.90"/>
        <Item ic="◐" sku="SKU-101782" name="Bohrkrone Ø 20 mm" qty="2" price="89.00" total="178.00"/>
        <Item ic="◑" sku="SKU-882244" name="Holzschutzlasur 5 L" qty="1" price="64.80" total="64.80"/>
        <Item ic="◮" sku="SKU-449128" name="Schraubenset M6" qty="3" price="24.50" total="73.50"/>
        <Item ic="◭" sku="SKU-228130" name="Dichtungsring 40 mm" qty="1" price="13.30" total="13.30"/>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 348.50</span></div>
        <div className="row discount"><span>Rabatt B2B · −5 %</span><span className="v">− CHF 17.43</span></div>
        <div className="row"><span>MwSt. 8.1 %</span><span className="v">CHF 26.84</span></div>
        <div className="row total"><span>Total</span><span className="v">CHF 357.91</span></div>
      </div>
    </div>
    <div className="pos-work">
      <div className="cash-stage">
        <div className="cash-left">
          <div className="display">
            <div className="row total"><span>Zu zahlen</span><span className="v">CHF 357.91</span></div>
            <div className="row recv"><span>Erhalten</span><span className="v">CHF 400.00</span></div>
            <div className="row change">
              <span style={{fontFamily:"'Helvetica-Custom'",fontWeight:700,fontSize:14,color:"#1f5a18"}}>Rückgeld</span>
              <span className="v">CHF 42.09</span>
            </div>
          </div>
          <div className="quick">
            <button>50</button>
            <button>100</button>
            <button>200</button>
            <button>500</button>
            <button className="exact">Passend</button>
          </div>
          <div className="drawer">
            <div className="d-ill"></div>
            <div className="info">
              <div className="n">Schublade öffnet bei Bestätigung</div>
              <div className="s">Cashlogy · automatischer Münzauswurf · 42.09 CHF (1×20, 1×20, 1×2, 1×0.05, 4×0.01)</div>
            </div>
            <button className="open-btn">Schublade öffnen</button>
          </div>
        </div>
        <div className="cash-right">
          <div className="numpad">
            <button>1</button><button>2</button><button>3</button>
            <button>4</button><button>5</button><button>6</button>
            <button>7</button><button>8</button><button>9</button>
            <button className="op">,</button><button>0</button><button className="op">⌫</button>
            <button className="confirm">Bestätigen · Rückgeld 42.09</button>
          </div>
        </div>
      </div>
      <ShiftBar/>
    </div>
  </div>
);

// ============================================================
// 09 — Receipt / Success
// ============================================================
const ReceiptScreen = () => (
  <div className="pos-screen">
    <NavRail active="sale"/>
    <TopBar crumb="Verkauf · abgeschlossen"/>
    <div className="pos-cart">
      <div className="cart-head">
        <h3>Abgeschlossen <span className="count-tag" style={{background:"var(--p-a-100)",color:"#1f5a18"}}>✓ Bezahlt</span></h3>
        <span className="sale-id">S-2026-0418 · 14:24</span>
      </div>
      <CustomerChip/>
      <div className="items" style={{flex:"0 1 auto",maxHeight:300}}>
        <Item ic="◧" sku="SKU-991022" name="Kabel HDMI 2.1 · 2 m" qty="1" price="18.90" total="18.90"/>
        <Item ic="◐" sku="SKU-101782" name="Bohrkrone Ø 20 mm" qty="2" price="89.00" total="178.00"/>
        <Item ic="◑" sku="SKU-882244" name="Holzschutzlasur 5 L" qty="1" price="64.80" total="64.80"/>
        <Item ic="◮" sku="SKU-449128" name="Schraubenset M6" qty="3" price="24.50" total="73.50"/>
        <Item ic="◭" sku="SKU-228130" name="Dichtungsring 40 mm" qty="1" price="13.30" total="13.30"/>
      </div>
      <div className="totals">
        <div className="row"><span>Subtotal</span><span className="v">CHF 348.50</span></div>
        <div className="row discount"><span>Rabatt B2B · −5 %</span><span className="v">− CHF 17.43</span></div>
        <div className="row"><span>MwSt. 8.1 %</span><span className="v">CHF 26.84</span></div>
        <div className="row total"><span style={{color:"var(--sem-success)"}}>Bezahlt · Karte</span><span className="v">CHF 357.91</span></div>
      </div>
    </div>
    <div className="pos-work">
      <div className="receipt-stage">
        <div className="receipt-success">
          <div className="check-ill">✓</div>
          <h1>Verkauf abgeschlossen.</h1>
          <p>Wallee hat CHF 357.91 erfolgreich belastet. Quittung an <strong>billing@mueller.ch</strong> versendet. Bestand und Buchhaltung sind aktualisiert.</p>
          <div className="sale-meta">
            <div className="group"><div className="k">Beleg</div><div className="v">S-2026-0418</div></div>
            <div className="group"><div className="k">Zahlung</div><div className="v">Karte · Mastercard ··6418</div></div>
            <div className="group"><div className="k">Auth</div><div className="v">AUTH-882441</div></div>
            <div className="group"><div className="k">Dauer</div><div className="v">2 min 04 s</div></div>
            <div className="group"><div className="k">Kassierer</div><div className="v">Nadia D.</div></div>
          </div>
          <div className="actions">
            <button className="primary"><Icon d={ICONS.plus} size={14}/> Neuer Verkauf <span style={{fontFamily:"var(--mono)",background:"rgba(255,255,255,.18)",padding:"1px 6px",borderRadius:3,fontSize:11,marginLeft:6}}>Enter</span></button>
            <button><Icon d={ICONS.printer} size={14}/> Bon drucken</button>
            <button><Icon d={ICONS.mail} size={14}/> Per Mail</button>
            <button>Per SMS</button>
            <button><Icon d={ICONS.copy} size={14}/> Duplizieren</button>
          </div>
        </div>
        <div className="receipt-paper">
          <div className="rp-head">
            <h6>BEDAYA AG</h6>
            <div className="addr">
              Industriestrasse 8 · 8618 Oetwil am See<br/>
              mail@gabig.app · +41 76 558 20 80<br/>
              MwSt CHE-148.221.882
            </div>
          </div>
          <div className="rp-meta">
            <span>S-2026-0418</span>
            <span>20.05.26 14:24</span>
          </div>
          <div className="rp-meta" style={{marginBottom:8}}>
            <span>Kasse 02 · Nadia D.</span>
            <span>Müller AG (B2B)</span>
          </div>
          <div className="rp-items">
            <div className="rp-item"><span className="n">Kabel HDMI 2.1</span><span className="q">1</span><span className="px">18.90</span></div>
            <div className="rp-item"><span className="n">Bohrkrone Ø 20 mm</span><span className="q">2</span><span className="px">178.00</span></div>
            <div className="rp-item"><span className="n">Holzschutzlasur 5 L</span><span className="q">1</span><span className="px">64.80</span></div>
            <div className="rp-item"><span className="n">Schraubenset M6</span><span className="q">3</span><span className="px">73.50</span></div>
            <div className="rp-item"><span className="n">Dichtungsring 40 mm</span><span className="q">1</span><span className="px">13.30</span></div>
          </div>
          <div className="rp-totals">
            <div className="row"><span>Subtotal</span><span>348.50</span></div>
            <div className="row"><span>Rabatt B2B −5 %</span><span>−17.43</span></div>
            <div className="row"><span>MwSt 8.1 %</span><span>26.84</span></div>
            <div className="row t"><span>TOTAL CHF</span><span>357.91</span></div>
            <div className="row paid"><span>Karte ··6418</span><span>357.91</span></div>
          </div>
          <div className="rp-foot">
            Danke für Deinen Einkauf bei Bedaya AG.<br/>
            Umtausch innert 30 Tagen mit Beleg.<br/>
            <div className="qr-tiny"></div>
          </div>
        </div>
      </div>
      <ShiftBar count={39} sales="CHF 5'178.41" twint={14} card={19} cash={6}/>
    </div>
  </div>
);

// ============================================================
// App
// ============================================================
const App = () => (
  <DesignCanvas>
    <DCSection
      id="pos-flow"
      title="Gäbig POS · Prototyp"
      subtitle="Browser-basiert, 1440×900, Login → Standort → Verkauf → Zahlung → Quittung"
    >
      <DCArtboard id="01" label="01 · Login" width={1440} height={900}>
        <LoginScreen/>
      </DCArtboard>
      <DCArtboard id="02" label="02 · Standort wählen" width={1440} height={900}>
        <StationSelectScreen/>
      </DCArtboard>
      <DCArtboard id="03" label="03 · Verkauf · bereit" width={1440} height={900}>
        <SaleEmptyScreen/>
      </DCArtboard>
      <DCArtboard id="04" label="04 · Verkauf · 5 Positionen" width={1440} height={900}>
        <SaleActiveScreen/>
      </DCArtboard>
      <DCArtboard id="05" label="05 · Kunde wählen" width={1440} height={900}>
        <CustomerPickerScreen/>
      </DCArtboard>
      <DCArtboard id="06" label="06 · Zahlung wählen" width={1440} height={900}>
        <PaymentSelectScreen/>
      </DCArtboard>
      <DCArtboard id="07" label="07 · Karten­zahlung" width={1440} height={900}>
        <CardPaymentScreen/>
      </DCArtboard>
      <DCArtboard id="08" label="08 · Bar­zahlung" width={1440} height={900}>
        <CashScreen/>
      </DCArtboard>
      <DCArtboard id="09" label="09 · Quittung" width={1440} height={900}>
        <ReceiptScreen/>
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

// expose screens for other entry points (e.g. flat slide export)
Object.assign(window, {
  LoginScreen, StationSelectScreen, SaleEmptyScreen, SaleActiveScreen,
  CustomerPickerScreen, PaymentSelectScreen, CardPaymentScreen,
  CashScreen, ReceiptScreen,
});

if (!window.__POS_NO_AUTO_RENDER) {
  ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
}

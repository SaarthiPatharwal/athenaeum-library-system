<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Athenaeum — Library Management System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:        #1C2321;
    --forest:     #2F4A3D;
    --forest-2:   #22362C;
    --parchment:  #F3E9D3;
    --card:       #FBF6EA;
    --brass:      #AD8A4E;
    --brass-dark: #8C6E38;
    --moss:       #5C7A56;
    --burgundy:   #7A3030;
    --rule:       rgba(28,35,33,0.16);
    --shadow:     0 6px 18px rgba(28,35,33,0.10);
    --shadow-lg:  0 14px 32px rgba(28,35,33,0.16);
  }

  *{ box-sizing:border-box; margin:0; padding:0; }
  html{ scroll-behavior:smooth; }

  body{
    background:
      radial-gradient(1200px 500px at 10% -10%, rgba(173,138,78,0.10), transparent),
      var(--parchment);
    color: var(--ink);
    font-family:'Source Sans 3', sans-serif;
    line-height:1.5;
  }

  h1,h2,h3,.display{ font-family:'Fraunces', serif; font-weight:600; letter-spacing:-0.01em; }
  .mono{ font-family:'IBM Plex Mono', monospace; }
  a{ color:inherit; text-decoration:none; }
  ul{ list-style:none; }
  .wrap{ max-width:1180px; margin:0 auto; padding:0 clamp(16px,4vw,48px); }

  /* ============================= NAV ============================= */
  header.nav{
    background: var(--forest);
    position: sticky;
    top:0;
    z-index:100;
  }
  .nav-row{
    max-width:1180px;
    margin:0 auto;
    padding: 18px clamp(16px,4vw,48px) 0;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:20px;
  }
  .brand{ display:flex; align-items:center; gap:14px; color:#F6F1E4; }
  .brand .wordmark{ display:flex; flex-direction:column; line-height:1.05; }
  .brand .mark{ font-family:'Fraunces', serif; font-weight:700; font-size:1.22rem; }
  .brand .sub{ font-family:'IBM Plex Mono', monospace; font-size:0.6rem; letter-spacing:0.12em; text-transform:uppercase; color:rgba(246,241,228,0.5); margin-top:2px; }

  .nav-links{ display:flex; align-items:center; gap:28px; font-size:0.9rem; font-weight:500; color:#F6F1E4; }
  .nav-links a{ opacity:0.82; padding-bottom:4px; position:relative; }
  .nav-links a:hover{ opacity:1; }
  .nav-links a.active{ opacity:1; font-weight:600; }
  .nav-links a.active::after{ content:""; position:absolute; left:0; right:0; bottom:-6px; height:2px; background:var(--brass); border-radius:2px; }

  .nav-right{ display:flex; align-items:center; gap:16px; }
  .btn-nav-primary{
    background: var(--brass); color: var(--ink); font-weight:700; font-size:0.86rem;
    padding:9px 18px; border-radius:999px; border:none; cursor:pointer;
    transition: background 0.15s ease;
  }
  .btn-nav-primary:hover{ background:#c7a262; }
  .login-link{ font-size:0.88rem; font-weight:600; color:#F6F1E4; opacity:0.85; white-space:nowrap; }
  .login-link:hover{ opacity:1; }
  .hamburger{ display:none; background:none; border:none; color:#F6F1E4; font-size:1.3rem; cursor:pointer; }

  .drawer-nav{ max-width:1180px; margin:14px auto 0; padding:0 clamp(16px,4vw,48px); display:flex; gap:6px; }
  .drawer-tab{
    font-family:'IBM Plex Mono', monospace; font-size:0.76rem; letter-spacing:0.05em;
    color:#F6F1E4; background:rgba(246,241,228,0.08); border:1px solid rgba(246,241,228,0.18); border-bottom:none;
    padding:9px 18px 10px; border-radius:6px 6px 0 0; transform:translateY(1px);
  }
  .drawer-tab.active{ background:var(--brass); color:var(--ink); border-color:var(--brass); }
  .header-shelf{ max-width:1180px; margin:0 auto; padding:0 clamp(16px,4vw,48px); }
  .header-shelf::after{ content:""; display:block; height:4px; background:linear-gradient(90deg,var(--brass),var(--brass-dark)); border-radius:2px 2px 0 0; }

  @media (max-width:860px){
    .nav-links{ display:none; }
    .hamburger{ display:block; }
  }

  /* ============================= HERO ============================= */
  .hero{ padding: clamp(48px,7vw,76px) 0 clamp(36px,5vw,56px); }
  .hero-grid{ display:grid; grid-template-columns: 1.05fr 0.95fr; gap:44px; align-items:center; }

  .badge{
    display:inline-flex; align-items:center; gap:8px;
    font-family:'IBM Plex Mono', monospace; font-size:0.7rem; letter-spacing:0.06em; text-transform:uppercase;
    color: var(--moss); background: rgba(92,122,86,0.12); border:1px solid rgba(92,122,86,0.3);
    padding:7px 14px; border-radius:999px; margin-bottom:20px;
  }
  .badge .dot{ width:6px; height:6px; border-radius:50%; background:var(--moss); animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .hero h1{ font-size: clamp(2.1rem, 4.2vw, 3.3rem); line-height:1.1; }
  .hero h1 .accent{ color: var(--brass-dark); }
  .hero p.lead{ max-width:48ch; color:rgba(28,35,33,0.75); font-size:1.04rem; margin-top:18px; }

  .hero-ctas{ display:flex; gap:14px; margin-top:30px; flex-wrap:wrap; }
  .btn-primary{
    background:var(--brass); color:var(--ink); font-weight:700; font-size:0.95rem;
    padding:13px 22px; border-radius:999px; border:none; cursor:pointer;
    display:inline-flex; align-items:center; gap:8px;
    box-shadow: 0 10px 24px rgba(173,138,78,0.28);
    transition: background 0.15s ease, transform 0.1s ease;
  }
  .btn-primary:hover{ background:var(--brass-dark); color:#fff; }
  .btn-primary:active{ transform: translateY(1px); }
  .btn-secondary{
    background:var(--card); border:1px solid rgba(28,35,33,0.24); color:var(--ink);
    font-weight:700; font-size:0.95rem; padding:13px 22px; border-radius:999px; cursor:pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .btn-secondary:hover{ background:#f1e9d8; border-color: var(--ink); }

  .hero-stats{ display:flex; gap:42px; margin-top:44px; flex-wrap:wrap; }
  .hero-stats .stat-num{ font-family:'IBM Plex Mono', monospace; font-size:1.7rem; font-weight:700; color:var(--forest); }
  .hero-stats .stat-label{ font-size:0.78rem; color:rgba(28,35,33,0.55); text-transform:uppercase; letter-spacing:0.05em; margin-top:2px; }

  /* Hero visual: an open-book button with circular ripples radiating outward from its center */
  .hero-visual{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:380px; position:relative; }
  .catalog-stack{ position:relative; width:300px; height:300px; display:flex; align-items:center; justify-content:center; }

  .ring{
    position:absolute;
    top:50%; left:50%;
    width:170px; height:170px;
    border-radius: 50%;
    border: 2.5px solid var(--brass);
    transform: translate(-50%, -50%) scale(0.55);
    opacity:0;
    animation: ripple 2.2s cubic-bezier(0.15,0.6,0.35,1) infinite;
  }
  .ring.r1{ animation-delay:0s; }
  .ring.r2{ animation-delay:0.55s; }
  .ring.r3{ animation-delay:1.1s; }
  .ring.r4{ animation-delay:1.65s; }
  @keyframes ripple{
    0%{   transform: translate(-50%, -50%) scale(0.55); opacity:0.9;  border-width: 3px; }
    60%{  opacity:0.35; }
    100%{ transform: translate(-50%, -50%) scale(2.05); opacity:0; border-width: 0.5px; }
  }

  /* The book itself: two "pages" meeting at a spine, tilted slightly like an open book cover */
  .catalog-core{
    position:relative; z-index:2;
    width:190px; height:140px;
    display:flex;
    cursor:pointer;
    border:none; background:none; padding:0; font:inherit;
    filter: drop-shadow(0 14px 26px rgba(28,35,33,0.28));
    transition: transform 0.2s ease;
    animation: breathe 3.2s ease-in-out infinite;
  }
  .catalog-core:hover{ transform: translateY(-3px); animation-play-state: paused; }
  @keyframes breathe{
    0%, 100%{ transform: scale(1); filter: drop-shadow(0 14px 26px rgba(28,35,33,0.28)); }
    50%{ transform: scale(1.035); filter: drop-shadow(0 16px 30px rgba(173,138,78,0.32)); }
  }
  .catalog-core .page{
    flex:1;
    background: linear-gradient(155deg, #3b5c4c, var(--forest) 55%, var(--forest-2) 100%);
    border: 2px solid var(--brass);
    display:flex; align-items:center; justify-content:center;
    color:#F6F1E4;
  }
  .catalog-core .page.left{
    border-radius: 10px 2px 2px 10px;
    border-right: none;
  }
  .catalog-core .page.right{
    border-radius: 2px 10px 10px 2px;
    border-left: 1px solid rgba(173,138,78,0.5);
  }
  .catalog-core .spine{
    position:absolute; left:50%; top:6px; bottom:6px;
    width:6px; transform: translateX(-50%);
    background: linear-gradient(180deg, var(--brass), var(--brass-dark));
    border-radius: 3px;
    z-index:3;
  }
  .catalog-core .page svg{ opacity:0.9; }
  .catalog-core .label{
    position:absolute; left:0; right:0; bottom:-30px; text-align:center;
    font-family:'IBM Plex Mono', monospace; font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase;
    color: rgba(28,35,33,0.6);
  }

  .shelf-pill{
    margin-top:46px; display:flex; align-items:center; gap:8px;
    font-family:'IBM Plex Mono', monospace; font-size:0.76rem; color: rgba(28,35,33,0.7);
    background: var(--card); border:1px solid var(--rule); padding:8px 14px; border-radius:999px;
  }
  .shelf-pill .dot{ width:6px; height:6px; border-radius:50%; background:var(--moss); animation:pulse 1.6s ease-in-out infinite; }

  @media (max-width:900px){
    .hero-grid{ grid-template-columns:1fr; }
    .hero-visual{ margin-top:12px; }
  }

  /* ============================= SECTIONS ============================= */
  section{ padding: 74px 0; }
  .section-head{ max-width:620px; margin:0 auto 46px; text-align:center; }
  .eyebrow{ font-family:'IBM Plex Mono', monospace; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--brass-dark); margin-bottom:12px; }
  .section-head h2{ font-size: clamp(1.55rem, 3vw, 2rem); }
  .section-head p{ color:rgba(28,35,33,0.72); margin-top:12px; font-size:0.98rem; }

  .reveal{ opacity:0; transform:translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .reveal.in{ opacity:1; transform:none; }

  /* ============================= HOW IT WORKS ============================= */
  .steps{ display:grid; grid-template-columns: repeat(4,1fr); gap:18px; }
  .step-card{ background:var(--card); border:1px solid var(--rule); border-radius:14px; padding:26px 20px; position:relative; box-shadow: var(--shadow); }
  .step-num{ font-family:'IBM Plex Mono', monospace; font-size:0.78rem; color:var(--brass-dark); margin-bottom:14px; }
  .step-card h3{ font-size:1.02rem; font-weight:700; margin-bottom:8px; font-family:'Fraunces', serif; }
  .step-card p{ font-size:0.88rem; color:rgba(28,35,33,0.7); }
  .step-arrow{ position:absolute; right:-16px; top:50%; transform:translateY(-50%); color:rgba(28,35,33,0.3); font-size:1.2rem; }
  @media (max-width:900px){ .steps{ grid-template-columns:1fr 1fr; } .step-arrow{ display:none; } }
  @media (max-width:540px){ .steps{ grid-template-columns:1fr; } }

  /* ============================= FEATURES ============================= */
  .features-grid{ display:grid; grid-template-columns: repeat(3,1fr); gap:20px; }
  .feature-card{ background:var(--card); border:1px solid var(--rule); border-radius:16px; padding:28px 24px; box-shadow: var(--shadow); transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease; }
  .feature-card:hover{ box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: rgba(173,138,78,0.4); }
  .feature-icon{ width:42px; height:42px; border-radius:11px; background: rgba(173,138,78,0.14); display:flex; align-items:center; justify-content:center; color:var(--brass-dark); margin-bottom:18px; }
  .feature-card h3{ font-size:1.04rem; font-weight:700; margin-bottom:8px; font-family:'Fraunces', serif; }
  .feature-card p{ font-size:0.88rem; color:rgba(28,35,33,0.72); }
  @media (max-width:900px){ .features-grid{ grid-template-columns:1fr 1fr; } }
  @media (max-width:560px){ .features-grid{ grid-template-columns:1fr; } }

  /* ============================= TRUST STRIP ============================= */
  .trust{ background: var(--forest); color:#F6F1E4; }
  .trust-grid{ display:grid; grid-template-columns: repeat(4,1fr); gap:18px; }
  .trust-card{ text-align:center; padding:10px; }
  .trust-card .t-icon{ color:var(--brass); margin-bottom:12px; display:flex; justify-content:center; }
  .trust-card h4{ font-size:0.95rem; font-weight:700; margin-bottom:6px; font-family:'Fraunces', serif; }
  .trust-card p{ font-size:0.82rem; color:rgba(246,241,228,0.65); }
  @media (max-width:900px){ .trust-grid{ grid-template-columns:1fr 1fr; } }
  @media (max-width:540px){ .trust-grid{ grid-template-columns:1fr; } }

  /* ============================= CTA BANNER ============================= */
  .cta-banner{
    background: linear-gradient(135deg, rgba(173,138,78,0.16), rgba(173,138,78,0.02));
    border:1px solid rgba(173,138,78,0.32); border-radius:22px;
    padding: 52px clamp(24px,5vw,60px); text-align:center;
  }
  .cta-banner h2{ font-size: clamp(1.5rem,3vw,2rem); }
  .cta-banner p{ color:rgba(28,35,33,0.72); margin:14px auto 28px; max-width:50ch; }
  .cta-actions{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

  /* ============================= FOOTER ============================= */
  footer{ padding:60px 0 30px; border-top:1px solid var(--rule); }
  .footer-grid{ display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap:32px; margin-bottom:40px; }
  .footer-brand p{ color:rgba(28,35,33,0.6); font-size:0.86rem; margin-top:14px; max-width:32ch; }
  .footer-col h5{ font-size:0.82rem; text-transform:uppercase; letter-spacing:0.06em; color:rgba(28,35,33,0.55); margin-bottom:16px; font-family:'IBM Plex Mono', monospace; }
  .footer-col ul li{ margin-bottom:10px; }
  .footer-col a{ font-size:0.9rem; color:rgba(28,35,33,0.75); }
  .footer-col a:hover{ color:var(--ink); }
  .footer-bottom{
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
    padding-top:26px; border-top:1px solid var(--rule); font-size:0.8rem; color:rgba(28,35,33,0.55);
  }

  @media (max-width:780px){ .footer-grid{ grid-template-columns:1fr 1fr; } }
  @media (max-width:480px){ .footer-grid{ grid-template-columns:1fr; } }

  @media (prefers-reduced-motion: reduce){ *{ transition:none !important; animation:none !important; } }
</style>
</head>
<body>

  <!-- ============================= NAV ============================= -->
  <header class="nav">
    <div class="nav-row">
      <div class="brand">
        <span class="wordmark">
          <span class="mark">Athenaeum</span>
          <span class="sub">Library System</span>
        </span>
      </div>
      <nav class="nav-links">
        <a href="#top" class="active">Home</a>
        <a href="athenaeum-library.html">Catalog</a>
        <a href="#how-it-works">How it works</a>
        <a href="#features">Features</a>
      </nav>
      <div class="nav-right">
        <button class="btn-nav-primary" onclick="location.href='athenaeum-library.html'">Open Catalog</button>
        <a class="login-link" href="athenaeum-login.html">Log in</a>
        <button class="hamburger" aria-label="Menu">☰</button>
      </div>
    </div>
    <div class="drawer-nav">
      <a class="drawer-tab active" href="#top">Home</a>
      <a class="drawer-tab" href="athenaeum-library.html">Catalog</a>
      <a class="drawer-tab" href="athenaeum-login.html">Sign In</a>
    </div>
    <div class="header-shelf"></div>
  </header>

  <!-- ============================= HERO ============================= -->
  <section class="hero" id="top">
    <div class="wrap hero-grid">
      <div>
        <div class="badge"><span class="dot"></span> Every book, tracked in real time</div>
        <h1>A place for every book, and every <span class="accent">book in its place.</span></h1>
        <p class="lead">Athenaeum is a lightweight library management system for small collections — built to catalog titles, track loans, and keep every copy accounted for without the overhead of enterprise software.</p>
        <div class="hero-ctas">
          <button class="btn-primary" onclick="location.href='athenaeum-library.html'">Open the catalog →</button>
          <button class="btn-secondary" onclick="location.href='athenaeum-login.html'">Sign in</button>
        </div>
        <div class="hero-stats">
          <div><div class="stat-num">8</div><div class="stat-label">Titles catalogued</div></div>
          <div><div class="stat-num">21</div><div class="stat-label">Copies on shelf</div></div>
          <div><div class="stat-num">O(log n)</div><div class="stat-label">Lookup by ISBN</div></div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="catalog-stack">
          <div class="ring r1"></div>
          <div class="ring r2"></div>
          <div class="ring r3"></div>
          <div class="ring r4"></div>
          <button class="catalog-core" onclick="location.href='athenaeum-library.html'" aria-label="Open the catalog">
            <span class="spine"></span>
            <span class="page left">
              <svg width="26" height="30" viewBox="0 0 24 28" fill="none"><path d="M2 2h11a3 3 0 0 1 3 3v21H5a3 3 0 0 1-3-3V2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 8h7M6 13h7M6 18h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            </span>
            <span class="page right">
              <svg width="26" height="30" viewBox="0 0 24 28" fill="none"><path d="M22 2H11a3 3 0 0 0-3 3v21h11a3 3 0 0 0 3-3V2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M11 8h7M11 13h7M11 18h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            </span>
            <span class="label">Open Catalog</span>
          </button>
        </div>
        <div class="shelf-pill"><span class="dot"></span> Syncing shelf status…</div>
      </div>
    </div>
  </section>

  <!-- ============================= HOW IT WORKS ============================= -->
  <section id="how-it-works">
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">The Process</div>
        <h2>From accession to return, in four steps</h2>
        <p>Athenaeum mirrors how a real front desk works — quick to add, quick to find, quick to check in and out.</p>
      </div>
      <div class="steps">
        <div class="step-card reveal">
          <div class="step-num">01</div>
          <h3>Add a title</h3>
          <p>Enter title, author, ISBN, and copy count — the system assigns a call number instantly.</p>
          <span class="step-arrow">→</span>
        </div>
        <div class="step-card reveal">
          <div class="step-num">02</div>
          <h3>Search the shelf</h3>
          <p>Look up any book by title, author, or ISBN in O(log n) time using indexed lookups.</p>
          <span class="step-arrow">→</span>
        </div>
        <div class="step-card reveal">
          <div class="step-num">03</div>
          <h3>Issue a copy</h3>
          <p>One click reduces available copies and flips the status the moment a book leaves the shelf.</p>
          <span class="step-arrow">→</span>
        </div>
        <div class="step-card reveal">
          <h3>Return & restock</h3>
          <p>Returning a copy restores availability automatically — never exceeding the total owned.</p>
          <div class="step-num" style="margin-top:14px;">04</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================= FEATURES ============================= -->
  <section id="features" style="background:var(--card); border-top:1px solid var(--rule); border-bottom:1px solid var(--rule);">
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">What's Inside</div>
        <h2>Everything a small library actually needs</h2>
        <p>No bloat, no unused modules — just the tools a single librarian needs at the front desk.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card reveal">
          <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H12v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" stroke="currentColor" stroke-width="1.7"/><path d="M20 4.5A2.5 2.5 0 0 0 17.5 2H12v20h5.5a2.5 2.5 0 0 0 2.5-2.5v-15Z" stroke="currentColor" stroke-width="1.7"/></svg></div>
          <h3>Full book catalog</h3>
          <p>Add, edit, and remove titles with title, author, ISBN, and quantity tracked for every entry.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7"/><path d="M20 20l-4.3-4.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></div>
          <h3>Instant search</h3>
          <p>Find any book by title, author, or ISBN using indexed <code>std::map</code> lookups — no scanning required.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h10M14 12l-3-3m3 3l-3 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6v12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></div>
          <h3>Issue & return tracking</h3>
          <p>Available copies update instantly on issue or return, with guards so counts never go out of bounds.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h12M3 18h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></div>
          <h3>Sortable views</h3>
          <p>Browse the full shelf sorted by title, author, or recently added, using <code>std::sort</code> under the hood.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 3v18M19 3v18M5 8h14M5 16h14" stroke="currentColor" stroke-width="1.7"/></svg></div>
          <h3>File-backed persistence</h3>
          <p>Every change is saved to disk with <code>fstream</code>, so the catalog survives restarts automatically.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h3>Validated input, always</h3>
          <p>Every menu choice and quantity is range-checked, so bad input never crashes or hangs the system.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================= TRUST / TECH STRIP ============================= -->
  <section class="trust">
    <div class="wrap">
      <div class="trust-grid">
        <div class="trust-card reveal">
          <div class="t-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8"/></svg></div>
          <h4>Local & offline</h4>
          <p>Runs entirely on your own machine — no server, no account, no data leaving your desk.</p>
        </div>
        <div class="trust-card reveal">
          <div class="t-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 3.5v6c0 5-3.5 8.5-8 10.5-4.5-2-8-5.5-8-10.5v-6L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h4>Built on the STL</h4>
          <p><code>std::map</code>, <code>std::vector</code>, and <code>std::sort</code> keep every operation fast and predictable.</p>
        </div>
        <div class="trust-card reveal">
          <div class="t-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 12h4l3 8 4-16 3 8h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h4>Crash-resistant input</h4>
          <p>Robust validation on every prompt means a stray keystroke never brings the system down.</p>
        </div>
        <div class="trust-card reveal">
          <div class="t-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></div>
          <h4>Always up to date</h4>
          <p>Every issue, return, add, or delete is saved the moment it happens.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================= CTA BANNER ============================= -->
  <section>
    <div class="wrap">
      <div class="cta-banner reveal">
        <h2>Your shelf, organized in minutes.</h2>
        <p>Sign in to start cataloguing, issuing, and tracking your library's collection today.</p>
        <div class="cta-actions">
          <button class="btn-primary" onclick="location.href='athenaeum-login.html'">Sign in to get started →</button>
          <button class="btn-secondary" onclick="location.href='athenaeum-library.html'">Browse the catalog</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================= FOOTER ============================= -->
  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand" style="color:var(--ink);">
            <span class="wordmark">
              <span class="mark">Athenaeum</span>
              <span class="sub" style="color:rgba(28,35,33,0.45);">Library System</span>
            </span>
          </div>
          <p>A lightweight, C++ powered library management system — built for small collections that need to stay organized.</p>
        </div>
        <div class="footer-col">
          <h5>Product</h5>
          <ul>
            <li><a href="#top">Home</a></li>
            <li><a href="athenaeum-library.html">Catalog</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it works</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Account</h5>
          <ul>
            <li><a href="athenaeum-login.html">Log in</a></li>
            <li><a href="athenaeum-login.html">Create account</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Legal</h5>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Athenaeum. A small-library catalog system.</span>
        <span>Built with C++, STL, and fstream.</span>
      </div>
    </div>
  </footer>

<script>
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced){
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }
</script>
</body>
</html>

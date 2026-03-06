import { useState, useEffect } from "react";

// ── VERSION ────────────────────────────────────────────────────────────────────
const APP_VERSION = "1.1.0";
const VERSION_URL = "https://gist.githubusercontent.com/magegod569-collab/163e4d1b346561aa77f0351ea4848d4d/raw/c4967d5474b239fd2d32377f7fb85203ece00739/json";

// ── LOCAL STORAGE HELPERS ──────────────────────────────────────────────────────
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── STYLES ─────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Barlow:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #111; --surface2: #1a1a1a; --surface3: #222;
    --border: #2a2a2a; --accent: #e63c2f; --gold: #c9a84c;
    --text: #f0ece4; --muted: #666;
    --bjj: #2e7dcc; --bjj-bg: #1a3a5c;
    --wres: #cc4e2e; --wres-bg: #3a1a1a;
    --lift: #4ecc6e;
  }
  html, body { background: var(--bg); color: var(--text); font-family: 'Barlow', sans-serif; height: 100%; overflow: hidden; }
  #root { height: 100%; }

  /* ── LAYOUT ── */
  .shell { display: flex; height: 100vh; overflow: hidden; }
  .left { width: 390px; min-width: 390px; background: var(--bg); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; position: relative; }
  .right { flex: 1; background: var(--surface2); display: flex; flex-direction: column; overflow: hidden; }

  @media (max-width: 768px) {
    .shell { display: block; }
    .left { width: 100%; min-width: 0; height: 100vh; }
    .right { display: none; position: fixed; inset: 0; z-index: 100; }
    .right.open { display: flex; }
  }

  /* ── HEADER ── */
  .hdr { padding: 16px 18px 0; flex-shrink: 0; }
  .hdr-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 3px; line-height: 1; }
  .logo span { color: var(--accent); }
  .datebadge { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; padding-top: 5px; }
  .update-banner { display: flex; align-items: center; justify-content: space-between; background: #1a3a1a; border: 1px solid var(--lift); border-radius: 3px; padding: 7px 11px; margin-top: 8px; text-decoration: none; gap: 8px; }
  .update-txt { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--lift); }
  .update-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; color: #4ecc6e88; letter-spacing: 1px; margin-top: 1px; }
  .update-arrow { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; color: var(--lift); letter-spacing: 1px; flex-shrink: 0; }

  /* ── SCROLL AREA ── */
  .scroll { flex: 1; overflow-y: auto; padding: 14px 18px 88px; }
  .scroll::-webkit-scrollbar { width: 2px; }
  .scroll::-webkit-scrollbar-thumb { background: var(--border); }

  /* ── BOTTOM NAV ── */
  .bnav { position: absolute; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); display: flex; z-index: 10; }
  .nbtn { flex: 1; padding: 9px 2px 7px; background: none; border: none; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 8px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; transition: color 0.2s; }
  .nbtn .ico { font-size: 16px; }
  .nbtn.on { color: var(--accent); }

  /* ── FAB ── */
  .fab { position: absolute; bottom: 66px; right: 14px; width: 46px; height: 46px; background: var(--accent); border: none; border-radius: 50%; color: #fff; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(230,60,47,0.4); transition: transform 0.2s; z-index: 10; }
  .fab:hover { transform: scale(1.06); }

  /* ── RIGHT PANEL ── */
  .rhdr { padding: 18px 24px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .rhdr-row { display: flex; justify-content: space-between; align-items: flex-start; }
  .rtitle { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 4px; }
  .rsub { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .rbody { flex: 1; overflow-y: auto; padding: 20px 24px; }
  .rbody::-webkit-scrollbar { width: 2px; }
  .rbody::-webkit-scrollbar-thumb { background: var(--border); }
  .rempty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--muted); gap: 10px; }
  .rempty-ico { font-size: 44px; opacity: 0.2; }
  .rempty-txt { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
  .back-btn { display: none; background: none; border: 1px solid var(--border); border-radius: 3px; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 10px; cursor: pointer; margin-bottom: 10px; }
  @media (max-width: 768px) { .back-btn { display: inline-flex; align-items: center; gap: 5px; } }

  /* ── CARDS ── */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 12px 14px; margin-bottom: 9px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }
  .cl::before { background: var(--lift); }
  .cb::before { background: var(--bjj); }
  .cw::before { background: var(--wres); }
  .cg::before { background: var(--gold); }

  /* ── SECTION TITLE ── */
  .sec { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 3px; margin-bottom: 11px; display: flex; align-items: center; gap: 8px; }
  .sec::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── STATS ── */
  .s3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 12px; }
  .s4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-bottom: 12px; }
  .s5 { display: grid; grid-template-columns: repeat(5,1fr); gap: 5px; margin-bottom: 12px; }
  .sbox { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 8px 5px; text-align: center; }
  .sval { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; line-height: 1; }
  .slbl { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }

  /* ── FORMS ── */
  .inp { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 3px; color: var(--text); font-family: 'Barlow', sans-serif; font-size: 14px; padding: 9px 11px; outline: none; transition: border-color 0.2s; }
  .inp:focus { border-color: var(--accent); }
  .inp::placeholder { color: var(--muted); }
  select.inp option { background: var(--surface2); }
  textarea.inp { resize: none; min-height: 68px; }
  .lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; display: block; }
  .fg { margin-bottom: 10px; }
  .r2 { display: flex; gap: 9px; }
  .r2 .fg { flex: 1; }
  .search-bar { display: flex; align-items: center; background: var(--surface2); border: 1px solid var(--border); border-radius: 3px; padding: 0 11px; margin-bottom: 12px; gap: 8px; }
  .search-bar input { flex: 1; background: none; border: none; color: var(--text); font-family: 'Barlow', sans-serif; font-size: 13px; padding: 8px 0; outline: none; }
  .search-bar input::placeholder { color: var(--muted); }
  .search-ico { color: var(--muted); font-size: 13px; }

  /* ── BUTTONS ── */
  .btn { padding: 9px 16px; border: none; border-radius: 3px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; }
  .bprim { background: var(--accent); color: #fff; width: 100%; }
  .bprim:hover { background: #c92e22; }
  .bsm { padding: 5px 10px; font-size: 11px; }
  .bgh { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .bgh:hover { color: var(--text); }
  .bdel { background: transparent; color: var(--accent); border: 1px solid var(--accent); }

  /* ── TABLES ── */
  .stbl { width: 100%; border-collapse: collapse; margin: 7px 0; }
  .stbl th { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); text-align: left; padding: 3px 5px; border-bottom: 1px solid var(--border); }
  .stbl td { padding: 5px; font-size: 13px; border-bottom: 1px solid #161616; }
  .stbl tr:last-child td { border-bottom: none; }
  .snum { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--muted); font-weight: 700; }
  .prp { display: inline-block; background: var(--gold); color: #000; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 1px; padding: 1px 4px; border-radius: 2px; margin-left: 4px; }

  /* ── CHART ── */
  .chart { display: flex; align-items: flex-end; gap: 3px; height: 48px; margin: 7px 0 2px; }
  .bar { flex: 1; border-radius: 2px 2px 0 0; transition: height 0.4s; min-height: 2px; }
  .blift { background: var(--lift); }
  .bdim { opacity: 0.35; }
  .clbls { display: flex; gap: 3px; }
  .clbl { flex: 1; text-align: center; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; color: var(--muted); white-space: nowrap; overflow: hidden; }

  /* ── PROGRESS BAR ── */
  .pbar { height: 3px; background: var(--surface3); border-radius: 2px; overflow: hidden; margin-top: 5px; }
  .pfill { height: 100%; border-radius: 2px; }
  .pfbjj { background: var(--bjj); }
  .pfwres { background: var(--wres); }

  /* ── DISCIPLINE PILLS ── */
  .dpills { display: flex; gap: 7px; margin-bottom: 12px; }
  .dpill { padding: 5px 14px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--muted); transition: all 0.2s; }
  .dpill-b { background: #1a3a5c; border-color: var(--bjj); color: var(--bjj); }
  .dpill-w { background: #3a1a1a; border-color: var(--wres); color: var(--wres); }

  /* ── SUB TABS ── */
  .stabs { display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap; }
  .stab { padding: 4px 10px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--muted); transition: all 0.2s; }
  .stab-b { background: #1a3a5c; border-color: var(--bjj); color: var(--bjj); }
  .stab-w { background: #3a1a1a; border-color: var(--wres); color: var(--wres); }

  /* ── TAGS ── */
  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
  .tag { background: var(--surface3); border: 1px solid var(--border); border-radius: 2px; padding: 2px 6px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .tbjj { border-color: var(--bjj); color: var(--bjj); }
  .twres { border-color: var(--wres); color: var(--wres); }

  /* ── COMPETITION ── */
  .comprow { display: flex; align-items: flex-start; gap: 11px; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .comprow:last-child { border-bottom: none; }
  .cbadge { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 13px; flex-shrink: 0; margin-top: 1px; }
  .cW { background: #1a3a1a; color: var(--lift); border: 1px solid var(--lift); }
  .cL { background: #3a1a1a; color: var(--accent); border: 1px solid var(--accent); }
  .cD { background: #2a2a1a; color: var(--gold); border: 1px solid var(--gold); }

  /* ── MODAL ── */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-bottom: none; border-radius: 8px 8px 0 0; width: 100%; max-width: 430px; padding: 20px 18px 34px; max-height: 90vh; overflow-y: auto; }
  .modal::-webkit-scrollbar { width: 2px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 21px; letter-spacing: 3px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .xbtn { background: none; border: none; color: var(--muted); font-size: 19px; cursor: pointer; line-height: 1; padding: 0 4px; }
  .xbtn:hover { color: var(--text); }
  .divider { height: 1px; background: var(--border); margin: 12px 0; }
  .snotes { font-size: 12px; color: #aaa; margin-top: 5px; line-height: 1.4; }
  .empty { text-align: center; padding: 28px 16px; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .eico { font-size: 26px; margin-bottom: 7px; opacity: 0.4; }

  /* ── VIDEO CARDS ── */
  .vgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .vcard { background: var(--surface); border: 1px solid var(--border); border-radius: 5px; overflow: hidden; position: relative; }
  .vcard::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 1; }
  .vcard.bjj::before { background: var(--bjj); }
  .vcard.wrestling::before { background: var(--wres); }
  .vthumb { width: 100%; aspect-ratio: 16/9; background: var(--surface3); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; }
  .vthumb img { width: 100%; height: 100%; object-fit: cover; }
  .vthumb-ph { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
  .play-btn { position: absolute; width: 46px; height: 46px; border-radius: 50%; background: rgba(230,60,47,0.9); display: flex; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 4px 18px rgba(0,0,0,0.6); transition: transform 0.2s; }
  .vthumb:hover .play-btn { transform: scale(1.1); }
  .vplayer { width: 100%; aspect-ratio: 16/9; background: #000; }
  .vplayer iframe { width: 100%; height: 100%; border: none; display: block; }
  .vbody { padding: 11px 13px 9px; }
  .vtitle { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px; }
  .vnotes { font-size: 12px; color: #aaa; margin-bottom: 7px; line-height: 1.4; }
  .vactions { display: flex; gap: 7px; padding: 0 13px 11px; }
  .pbadge { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .pb-yt { background: rgba(255,0,0,0.1); color: #ff4444; border: 1px solid rgba(255,0,0,0.2); }
  .pb-bb { background: rgba(0,160,220,0.1); color: #00a0dc; border: 1px solid rgba(0,160,220,0.2); }
  .pb-ot { background: var(--surface3); color: var(--muted); border: 1px solid var(--border); }

  /* ── STRATEGY ── */
  .cat-filter { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 12px; }
  .catpill { padding: 4px 10px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--muted); transition: all 0.2s; }
  .catpill.on { background: #1a3a5c; border-color: var(--bjj); color: var(--bjj); }
  .strat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 12px 14px; margin-bottom: 8px; position: relative; overflow: hidden; cursor: pointer; transition: border-color 0.2s; }
  .strat-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: var(--bjj); }
  .strat-card:hover { border-color: #444; }
  .strat-card.sel { border-color: var(--bjj); background: #0d1e2e; }
  .diff-dots { display: flex; gap: 3px; }
  .diff-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--surface3); }
  .diff-dot.on { background: var(--gold); }
  .seq-flow { display: flex; flex-direction: column; }
  .seq-step { display: flex; gap: 14px; align-items: flex-start; }
  .seq-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 32px; }
  .seq-num { width: 32px; height: 32px; border-radius: 50%; background: var(--bjj); color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .seq-line { width: 2px; flex: 1; min-height: 18px; background: var(--border); margin: 2px 0; }
  .seq-body { padding-bottom: 18px; flex: 1; }
  .seq-step-name { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 2px; }
  .seq-step-note { font-size: 12px; color: #aaa; line-height: 1.5; }
  .seq-tip { display: inline-block; margin-top: 5px; padding: 2px 9px; background: rgba(46,125,204,0.1); border: 1px solid rgba(46,125,204,0.2); border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; color: var(--bjj); letter-spacing: 1px; }
  .drill-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; background: var(--surface); border: 1px solid var(--bjj); border-radius: 3px; color: var(--bjj); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .drill-btn:hover { background: #0d1e2e; }
  .notes-box { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 13px; margin-top: 16px; }
  .notes-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .dstats { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .dstat { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 9px 14px; text-align: center; }
  .dstat-val { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; line-height: 1; }
  .dstat-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
  .vlink { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 11px 14px; margin-top: 12px; text-decoration: none; transition: border-color 0.2s; }
  .vlink:hover { border-color: var(--bjj); }
`;

// ── INITIAL DATA ───────────────────────────────────────────────────────────────
const INIT_W = [
  { id:1, date:"2025-03-01", name:"Push Day", exercises:[
    { name:"Bench Press", sets:[{reps:5,weight:100},{reps:5,weight:102.5},{reps:4,weight:105}], pr:105 },
    { name:"Overhead Press", sets:[{reps:8,weight:60},{reps:8,weight:60},{reps:7,weight:60}], pr:65 },
  ]},
  { id:2, date:"2025-03-03", name:"Pull Day", exercises:[
    { name:"Deadlift", sets:[{reps:5,weight:160},{reps:5,weight:162.5},{reps:5,weight:165}], pr:165 },
    { name:"Pull-ups", sets:[{reps:8,weight:0},{reps:7,weight:0},{reps:6,weight:0}], pr:0 },
  ]},
];
const INIT_G = [
  { id:1, type:"bjj", date:"2025-03-02", duration:90, subtype:"Gi", techniques:["Guard Pass","Triangle Choke","X-Guard"], notes:"Drilled triangle from closed guard. Tapped 3x by blue belt.", rounds:6 },
  { id:2, type:"wrestling", date:"2025-02-28", duration:60, subtype:"Freestyle", techniques:["Double Leg","Snap Down","Sprawl"], notes:"Focused on shots. Level change improving.", rounds:4 },
  { id:3, type:"bjj", date:"2025-02-25", duration:75, subtype:"No-Gi", techniques:["Rear Naked Choke","Body Lock Pass"], notes:"No-gi comp prep. Leg entanglements.", rounds:5 },
];
const INIT_C = [
  { id:1, type:"bjj", name:"City Open 2025", date:"2025-02-15", result:"W", opponent:"John D.", method:"Points", notes:"Won on advantages" },
  { id:2, type:"wrestling", name:"Regional Duals", date:"2025-01-20", result:"L", opponent:"Mike S.", method:"Tech Fall", notes:"Need to work takedown defense" },
  { id:3, type:"bjj", name:"City Open 2025", date:"2025-02-15", result:"W", opponent:"Carlos M.", method:"Submission", notes:"Guillotine in round 2" },
];
const INIT_V = [
  { id:1, title:"Gordon Ryan Guard Passing", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", discipline:"bjj", techniques:["Guard Pass","Torreando"], notes:"Essential reference for passing", platform:"youtube" },
  { id:2, title:"Penetration Step Breakdown", url:"https://www.bilibili.com/video/BV1xx411c7mD", discipline:"wrestling", techniques:["Double Leg","Level Change"], notes:"Great timing breakdown", platform:"bilibili" },
];
const INIT_MOB = [
  { id:1, title:"GMB Mobility — Hip Opening", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category:"Hips", duration:"12 min", notes:"Great pre-roll warmup.", platform:"youtube" },
  { id:2, title:"Tom Merrick — Full Body Flexibility", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category:"Full Body", duration:"20 min", notes:"Do this on rest days.", platform:"youtube" },
];
const INIT_STRATS = [
  { id:1, name:"Closed Guard Triangle Setup", category:"Guard attacks & submissions", difficulty:3, drilled:12,
    description:"Classic closed guard triangle from arm trap. Works when opponent tries to posture up with one arm inside.",
    steps:[
      { name:"Establish closed guard", note:"Hips high, break their posture down. Grab head or collar.", tip:"Keep elbows tight to their arms" },
      { name:"Trap one arm across", note:"Overhook their right arm, push it across your centerline with your hip.", tip:"Use your whole body, not just arms" },
      { name:"Open guard & shoot hips", note:"Open guard, turn on your side, shoot hips up toward their shoulder.", tip:"The angle is everything — be perpendicular" },
      { name:"Throw leg over neck", note:"Throw your left leg over the back of their neck, lock the figure-4.", tip:null },
      { name:"Finish — squeeze & pull", note:"Squeeze knees together, pull down on their head, extend hips upward.", tip:"Rotate toward the trapped arm for tighter squeeze" },
    ], notes:"Most common failure: not getting perpendicular. If they stack, grab their ankle and keep rotating.", videoUrl:null },
  { id:2, name:"Torreando Pass to Side Control", category:"Passing sequences", difficulty:2, drilled:8,
    description:"Fast, pressure-based guard pass using pants grips to clear the legs and land in side control.",
    steps:[
      { name:"Grip both pants at the knee", note:"Stand in base, grab both knees firmly.", tip:"Wrists turned inward for better grip" },
      { name:"Push knees to one side", note:"Shove their legs to your left while you move right.", tip:null },
      { name:"Clear the hips", note:"Step around, do not hop over — keep your hips low.", tip:"Be fast — no pause between clearing and pinning" },
      { name:"Drive shoulder into far armpit", note:"Land with crossface, shoulder in, hip on hip.", tip:null },
      { name:"Secure side control", note:"Underhook the far arm, block the hip with your knee.", tip:"Kill their inside elbow immediately" },
    ], notes:"If they re-guard with their knees, immediately redirect to the other side.", videoUrl:null },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtD = d => new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtShort = d => new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"});

function getPlatform(url) {
  if (!url) return "other";
  if (url.includes("youtube.com")||url.includes("youtu.be")) return "youtube";
  if (url.includes("bilibili.com")) return "bilibili";
  return "other";
}
function getYTId(url) { const m=url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/); return m?m[1]:null; }
function thumbUrl(url) { const id=getYTId(url); return id?`https://img.youtube.com/vi/${id}/mqdefault.jpg`:null; }
function embedUrl(url) { const id=getYTId(url); return id?`https://www.youtube.com/embed/${id}?autoplay=1`:null; }

function calcStreak(workouts, grapple) {
  const allDates = [...new Set([...workouts.map(w=>w.date), ...grapple.map(g=>g.date)])].sort((a,b)=>b.localeCompare(a));
  if (!allDates.length) return 0;
  let streak = 0;
  let check = new Date(); check.setHours(0,0,0,0);
  for (const d of allDates) {
    const dt = new Date(d+"T00:00:00"); dt.setHours(0,0,0,0);
    const diff = Math.round((check-dt)/86400000);
    if (diff <= 1) { streak++; check = dt; }
    else break;
  }
  return streak;
}

// ── APP ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [workouts, setWorkoutsRaw] = useState(() => load("im_workouts", INIT_W));
  const [grapple, setGrappleRaw] = useState(() => load("im_grapple", INIT_G));
  const [comps, setCompsRaw] = useState(() => load("im_comps", INIT_C));
  const [videos, setVideosRaw] = useState(() => load("im_videos", INIT_V));
  const [mobVideos, setMobVideosRaw] = useState(() => load("im_mob", INIT_MOB));
  const [strategies, setStrategiesRaw] = useState(() => load("im_strats", INIT_STRATS));
  const [modal, setModal] = useState(null);
  const [rightMode, setRightMode] = useState("welcome");
  const [rightDisc, setRightDisc] = useState("bjj");
  const [selectedStrat, setSelectedStrat] = useState(null);
  const [activeMobVideo, setActiveMobVideo] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(null);

  // Persist to localStorage on every change
  const setWorkouts = v => { const d = typeof v==="function"?v(workouts):v; save("im_workouts",d); setWorkoutsRaw(d); };
  const setGrapple = v => { const d = typeof v==="function"?v(grapple):v; save("im_grapple",d); setGrappleRaw(d); };
  const setComps = v => { const d = typeof v==="function"?v(comps):v; save("im_comps",d); setCompsRaw(d); };
  const setVideos = v => { const d = typeof v==="function"?v(videos):v; save("im_videos",d); setVideosRaw(d); };
  const setMobVideos = v => { const d = typeof v==="function"?v(mobVideos):v; save("im_mob",d); setMobVideosRaw(d); };
  const setStrategies = v => { const d = typeof v==="function"?v(strategies):v; save("im_strats",d); setStrategiesRaw(d); };

  // Update selectedStrat when strategies change
  useEffect(() => {
    if (selectedStrat) {
      const updated = strategies.find(s=>s.id===selectedStrat.id);
      if (updated) setSelectedStrat(updated);
    }
  }, [strategies]);

  // Check for updates
  useEffect(() => {
    fetch(VERSION_URL)
      .then(r=>r.json())
      .then(d=>{ if (d.version && d.version!==APP_VERSION) setUpdateAvailable(d); })
      .catch(()=>{});
  }, []);

  const allPRs = workouts.flatMap(w=>w.exercises.map(e=>({name:e.name,pr:e.pr})))
    .reduce((a,c)=>{ if (!a[c.name]||c.pr>a[c.name]) a[c.name]=c.pr; return a; },{});

  const openVideos = (disc) => { setRightDisc(disc); setRightMode("videos"); };
  const openStrategy = (s) => { setSelectedStrat(s); setRightMode("strategy"); };
  const openMobVideo = (v) => { setActiveMobVideo(v); setRightMode("mobility"); };

  const isRightOpen = rightMode==="strategy"||rightMode==="videos"||rightMode==="mobility";

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">
        {/* ── LEFT ── */}
        <div className="left">
          <div className="hdr">
            <div className="hdr-top">
              <div className="logo">IRON<span>&amp;</span>MAT</div>
              <div className="datebadge">{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
            </div>
            {updateAvailable && (
              <a href={updateAvailable.downloadUrl} target="_blank" rel="noopener noreferrer" className="update-banner">
                <div>
                  <div className="update-txt">Update Available — v{updateAvailable.version}</div>
                  <div className="update-sub">{updateAvailable.notes||"Tap to download"}</div>
                </div>
                <div className="update-arrow">Download ↗</div>
              </a>
            )}
          </div>

          <div className="scroll">
            {tab==="dashboard" && <Dashboard workouts={workouts} grapple={grapple} comps={comps} allPRs={allPRs} setTab={setTab} />}
            {tab==="lift" && <LiftTab workouts={workouts} setWorkouts={setWorkouts} allPRs={allPRs} />}
            {tab==="grapple" && <GrappleTab grapple={grapple} setGrapple={setGrapple} comps={comps} setComps={setComps} videos={videos} setModal={setModal} openVideos={openVideos} />}
            {tab==="strategies" && <StrategiesTab strategies={strategies} setStrategies={setStrategies} videos={videos} selectedStrat={selectedStrat} onSelect={openStrategy} setModal={setModal} />}
            {tab==="mobility" && <MobilityTab mobVideos={mobVideos} setMobVideos={setMobVideos} activeMobVideo={activeMobVideo} onSelect={openMobVideo} setModal={setModal} />}
            {tab==="prs" && <PRsTab allPRs={allPRs} workouts={workouts} />}
          </div>

          {/* Modals */}
          {modal==="new-workout" && <NewWorkoutModal onClose={()=>setModal(null)} onSave={w=>{setWorkouts(p=>[w,...p]);setModal(null);}} allPRs={allPRs} />}
          {modal==="new-session" && <NewSessionModal onClose={()=>setModal(null)} onSave={s=>{setGrapple(p=>[s,...p]);setModal(null);}} />}
          {modal==="new-comp" && <NewCompModal onClose={()=>setModal(null)} onSave={c=>{setComps(p=>[c,...p]);setModal(null);}} />}
          {modal==="new-video" && <NewVideoModal onClose={()=>setModal(null)} onSave={v=>{setVideos(p=>[v,...p]);setModal(null);}} />}
          {modal==="new-mob-video" && <NewMobVideoModal onClose={()=>setModal(null)} onSave={v=>{setMobVideos(p=>[v,...p]);setModal(null);}} />}
          {modal==="new-strategy" && <NewStrategyModal onClose={()=>setModal(null)} videos={videos} onSave={s=>{setStrategies(p=>[s,...p]);setModal(null);openStrategy(s);}} />}

          {tab==="lift" && <button className="fab" onClick={()=>setModal("new-workout")}>+</button>}
          {tab==="grapple" && <button className="fab" onClick={()=>setModal("new-session")}>+</button>}
          {tab==="strategies" && <button className="fab" onClick={()=>setModal("new-strategy")}>+</button>}
          {tab==="mobility" && <button className="fab" onClick={()=>setModal("new-mob-video")}>+</button>}

          <nav className="bnav">
            {[{id:"dashboard",ico:"⚡",lbl:"Home"},{id:"lift",ico:"🏋️",lbl:"Lift"},{id:"grapple",ico:"🥋",lbl:"Grapple"},{id:"strategies",ico:"📖",lbl:"Plans"},{id:"mobility",ico:"🧘",lbl:"Mobility"},{id:"prs",ico:"🏆",lbl:"PRs"}].map(n=>(
              <button key={n.id} className={`nbtn ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
                <span className="ico">{n.ico}</span>{n.lbl}
              </button>
            ))}
          </nav>
        </div>

        {/* ── RIGHT ── */}
        <div className={`right ${isRightOpen?"open":""}`}>
          {rightMode==="welcome" && (
            <div className="rempty" style={{height:"100%"}}>
              <div className="rempty-ico">📖</div>
              <div className="rempty-txt">Select a strategy, video or mobility routine</div>
            </div>
          )}

          {rightMode==="videos" && (
            <>
              <div className="rhdr">
                <button className="back-btn" onClick={()=>setRightMode("welcome")}>← Back</button>
                <div className="rhdr-row">
                  <div>
                    <div className="rtitle">{rightDisc==="bjj"?"BJJ":"Wrestling"} Videos</div>
                    <div className="rsub">{videos.filter(v=>v.discipline===rightDisc).length} saved</div>
                  </div>
                  <button className="btn bgh bsm" onClick={()=>setModal("new-video")}>+ Add</button>
                </div>
              </div>
              <div className="rbody">
                <VideoGrid videos={videos.filter(v=>v.discipline===rightDisc)} discipline={rightDisc} onDelete={id=>setVideos(p=>p.filter(x=>x.id!==id))} onAdd={()=>setModal("new-video")} />
              </div>
            </>
          )}

          {rightMode==="strategy" && selectedStrat && (
            <>
              <div className="rhdr">
                <button className="back-btn" onClick={()=>setRightMode("welcome")}>← Back</button>
                <div className="rhdr-row">
                  <div>
                    <div className="rtitle" style={{fontSize:18,letterSpacing:2}}>{selectedStrat.name}</div>
                    <div className="rsub">{selectedStrat.category} · {selectedStrat.drilled}x drilled</div>
                  </div>
                  <button className="btn bgh bsm" onClick={()=>{const u={...selectedStrat,drilled:selectedStrat.drilled+1};setStrategies(p=>p.map(s=>s.id===u.id?u:s));}}>+ Drilled</button>
                </div>
              </div>
              <div className="rbody">
                <StrategyDetail strat={selectedStrat} videos={videos} onDrilled={()=>{const u={...selectedStrat,drilled:selectedStrat.drilled+1};setStrategies(p=>p.map(s=>s.id===u.id?u:s));}} />
              </div>
            </>
          )}

          {rightMode==="mobility" && activeMobVideo && (
            <>
              <div className="rhdr">
                <button className="back-btn" onClick={()=>{setRightMode("welcome");setActiveMobVideo(null);}}>← Back</button>
                <div className="rhdr-row">
                  <div>
                    <div className="rtitle" style={{fontSize:17,letterSpacing:2}}>{activeMobVideo.title}</div>
                    <div className="rsub">{activeMobVideo.category} · {activeMobVideo.duration}</div>
                  </div>
                  <a href={activeMobVideo.url} target="_blank" rel="noopener noreferrer" className="btn bgh bsm" style={{textDecoration:"none"}}>YouTube ↗</a>
                </div>
              </div>
              <div className="rbody" style={{padding:0,display:"flex",flexDirection:"column"}}>
                <MobPlayer video={activeMobVideo} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── VIDEO GRID ─────────────────────────────────────────────────────────────────
function VideoGrid({ videos, discipline, onDelete, onAdd }) {
  if (!videos.length) return (
    <div className="rempty" style={{paddingTop:60}}>
      <div className="rempty-ico">📺</div>
      <div className="rempty-txt">No videos saved yet</div>
      <button className="btn bprim" style={{width:"auto",padding:"10px 22px",marginTop:10}} onClick={onAdd}>+ Save First Video</button>
    </div>
  );
  return <div className="vgrid">{videos.map(v=><VideoCard key={v.id} video={v} discipline={discipline} onDelete={()=>onDelete(v.id)} />)}</div>;
}

function VideoCard({ video, discipline, onDelete }) {
  const [playing, setPlaying] = useState(false);
  const p = video.platform || getPlatform(video.url);
  const isBB = p==="bilibili";
  const em = !isBB ? embedUrl(video.url) : null;
  const th = thumbUrl(video.url);

  if (isBB) return (
    <div className={`vcard ${discipline}`}>
      <a href={video.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
        <div style={{background:"var(--surface3)",aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer"}}>
          <div style={{fontSize:32}}>📺</div>
          <div style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Open on Bilibili ↗</div>
        </div>
      </a>
      <div className="vbody">
        <div className="vtitle">{video.title}</div>
        {video.notes&&<div className="vnotes">{video.notes}</div>}
        <span className="pbadge pb-bb">Bilibili</span>
        {video.techniques?.length>0&&<div className="tags">{video.techniques.map(t=><span key={t} className={`tag ${discipline==="bjj"?"tbjj":"twres"}`}>{t}</span>)}</div>}
      </div>
      <div className="vactions">
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn bprim bsm" style={{textDecoration:"none",flex:1,textAlign:"center"}}>Watch on Bilibili ↗</a>
        <button className="btn bsm bdel" onClick={onDelete}>✕</button>
      </div>
    </div>
  );

  return (
    <div className={`vcard ${discipline}`}>
      {playing&&em ? (
        <div className="vplayer"><iframe src={em} allowFullScreen allow="autoplay; encrypted-media" title={video.title} /></div>
      ) : (
        <div className="vthumb" onClick={()=>setPlaying(true)}>
          {th?<img src={th} alt={video.title} />:<div className="vthumb-ph"><div style={{fontSize:28,opacity:0.35}}>▶</div></div>}
          <div className="play-btn">▶</div>
        </div>
      )}
      <div className="vbody">
        <div className="vtitle">{video.title}</div>
        {video.notes&&<div className="vnotes">{video.notes}</div>}
        <span className={`pbadge ${p==="youtube"?"pb-yt":"pb-ot"}`}>{p==="youtube"?"YouTube":"URL"}</span>
        {video.techniques?.length>0&&<div className="tags">{video.techniques.map(t=><span key={t} className={`tag ${discipline==="bjj"?"tbjj":"twres"}`}>{t}</span>)}</div>}
      </div>
      <div className="vactions">
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn bgh bsm" style={{textDecoration:"none"}}>Open ↗</a>
        <button className="btn bsm bdel" onClick={onDelete}>✕</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ workouts, grapple, comps, allPRs, setTab }) {
  const bjj = grapple.filter(g=>g.type==="bjj").length;
  const wres = grapple.filter(g=>g.type==="wrestling").length;
  const wins = comps.filter(c=>c.result==="W").length;
  const streak = calcStreak(workouts, grapple);
  const totalMins = grapple.reduce((s,g)=>s+(g.duration||0),0);
  const recent = [...workouts,...grapple].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  const now = new Date();
  const week = ["M","T","W","T","F","S","S"].map((d,i)=>{
    const dt = new Date(now); dt.setDate(now.getDate()-(6-i));
    const ds = dt.toISOString().split("T")[0];
    return {d, hasL:workouts.some(w=>w.date===ds), gr:grapple.find(g=>g.date===ds)};
  });

  return (
    <>
      <div className="s5" style={{gap:5}}>
        {[{v:workouts.length,l:"Lifts",c:"var(--lift)"},{v:bjj,l:"BJJ",c:"var(--bjj)"},{v:wres,l:"Wrestl",c:"var(--wres)"},{v:wins,l:"Wins",c:"var(--gold)"},{v:streak,l:"Streak",c:"var(--accent)"}].map(s=>(
          <div key={s.l} className="sbox"><div className="sval" style={{color:s.c,fontSize:20}}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>

      <div className="card" style={{marginBottom:11}}>
        <div className="lbl" style={{marginBottom:7}}>This Week</div>
        <div style={{display:"flex",gap:5}}>
          {week.map((d,i)=>(
            <div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{height:28,borderRadius:3,marginBottom:4,background:d.hasL?"var(--lift)":d.gr?d.gr.type==="wrestling"?"var(--wres)":"var(--bjj)":"var(--surface3)",opacity:(d.hasL||d.gr)?0.85:0.2}} />
              <span style={{fontSize:9,color:"var(--muted)",fontFamily:"Barlow Condensed",fontWeight:700}}>{d.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border)",marginBottom:12}}>
        <span style={{fontFamily:"Barlow Condensed",fontSize:12,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>Total mat time</span>
        <span style={{fontFamily:"Bebas Neue",fontSize:18,color:"var(--bjj)",letterSpacing:2}}>{Math.floor(totalMins/60)}h {totalMins%60}m</span>
      </div>

      <div className="sec">Recent Activity</div>
      {recent.length===0&&<div className="empty"><div className="eico">⚡</div>No activity yet — start logging!</div>}
      {recent.map((item,i)=>(
        <div key={i} className={`card ${item.exercises?"cl":item.type==="bjj"?"cb":"cw"}`} style={{marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700}}>{item.name||(item.type?.toUpperCase()+" — "+item.subtype)}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{fmtShort(item.date)}{item.duration?` · ${item.duration}min`:""}</div>
            </div>
            <div style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:item.exercises?"var(--lift)":item.type==="bjj"?"var(--bjj)":"var(--wres)"}}>
              {item.exercises?"LIFT":item.type}
            </div>
          </div>
        </div>
      ))}

      {Object.keys(allPRs).length>0&&(
        <>
          <div className="sec" style={{marginTop:14}}>Top PRs</div>
          {Object.entries(allPRs).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([name,pr])=>(
            <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontFamily:"Barlow Condensed",fontSize:13,fontWeight:700}}>{name}</span>
              <span style={{fontFamily:"Bebas Neue",fontSize:18,color:"var(--gold)",letterSpacing:2}}>{pr>0?`${pr}kg`:"BW"}</span>
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ── LIFT TAB ───────────────────────────────────────────────────────────────────
function LiftTab({ workouts, setWorkouts, allPRs }) {
  // Build real weekly volume from actual workout data
  const weeks = [];
  for (let i=4; i>=0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i*7);
    const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate()+6);
    const label = weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"});
    const vol = workouts
      .filter(w=>{ const wd=new Date(w.date+"T00:00:00"); return wd>=weekStart&&wd<=weekEnd; })
      .reduce((s,w)=>s+w.exercises.reduce((es,e)=>es+e.sets.reduce((ss,set)=>ss+set.reps*(set.weight||1),0),0),0);
    weeks.push({label, vol});
  }
  const mx = Math.max(...weeks.map(w=>w.vol), 1);

  return (
    <>
      <div className="sec">Strength</div>
      <div className="card cl">
        <div className="lbl">Weekly Volume (kg)</div>
        <div className="chart">
          {weeks.map((w,i)=><div key={i} className={`bar blift ${i<weeks.length-1?"bdim":""}`} style={{height:`${Math.max((w.vol/mx)*100,w.vol>0?4:0)}%`}} />)}
        </div>
        <div className="clbls">{weeks.map((w,i)=><div key={i} className="clbl">{w.label}</div>)}</div>
      </div>
      <div className="sec">Workout Log</div>
      {workouts.length===0&&<div className="empty"><div className="eico">🏋️</div>No workouts yet — tap + to log one</div>}
      {workouts.map(w=><WCard key={w.id} workout={w} onDelete={()=>setWorkouts(p=>p.filter(x=>x.id!==w.id))} />)}
    </>
  );
}

function WCard({ workout, onDelete }) {
  const [open, setOpen] = useState(false);
  const vol = workout.exercises.reduce((s,e)=>s+e.sets.reduce((ss,st)=>ss+st.reps*(st.weight||1),0),0);
  return (
    <div className="card cl">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <div>
          <div style={{fontFamily:"Bebas Neue",fontSize:17,letterSpacing:2}}>{workout.name}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{fmtD(workout.date)} · {workout.exercises.length} exercises · {vol.toLocaleString()}kg vol</div>
        </div>
        <span style={{color:"var(--muted)",fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <>
          <div className="divider" />
          {workout.exercises.map((ex,i)=>(
            <div key={i} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:"Barlow Condensed",fontSize:13,fontWeight:700}}>{ex.name}</span>
                <span style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--gold)"}}>PR: {ex.pr>0?`${ex.pr}kg`:"BW"}</span>
              </div>
              <table className="stbl">
                <thead><tr><th>Set</th><th>Reps</th><th>Weight</th></tr></thead>
                <tbody>
                  {ex.sets.map((s,j)=>(
                    <tr key={j}>
                      <td><span className="snum">S{j+1}</span></td>
                      <td>{s.reps}</td>
                      <td>{s.weight>0?`${s.weight}kg`:"BW"}{s.weight===ex.pr&&ex.pr>0&&<span className="prp">PR</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button className="btn bsm bdel" onClick={onDelete}>Delete Workout</button>
        </>
      )}
    </div>
  );
}

// ── GRAPPLE TAB ────────────────────────────────────────────────────────────────
function GrappleTab({ grapple, setGrapple, comps, setComps, videos, setModal, openVideos }) {
  const [view, setView] = useState("sessions");
  const [disc, setDisc] = useState("bjj");
  const filtered = grapple.filter(g=>g.type===disc);
  const fComps = comps.filter(c=>c.type===disc);
  const allTechs = [...new Set(filtered.flatMap(g=>g.techniques||[]))];
  const wins = fComps.filter(c=>c.result==="W").length;
  const losses = fComps.filter(c=>c.result==="L").length;
  const totalMins = filtered.reduce((s,g)=>s+(g.duration||0),0);

  const handleDisc = d => { setDisc(d); if (view==="videos") openVideos(d); };
  const handleView = v => { setView(v); if (v==="videos") openVideos(disc); };

  return (
    <>
      <div className="dpills">
        <button className={`dpill ${disc==="bjj"?"dpill-b":""}`} onClick={()=>handleDisc("bjj")}>BJJ</button>
        <button className={`dpill ${disc==="wrestling"?"dpill-w":""}`} onClick={()=>handleDisc("wrestling")}>Wrestling</button>
      </div>
      <div className="stabs">
        {["sessions","techniques","videos","competitions"].map(v=>(
          <button key={v} className={`stab ${view===v?(disc==="bjj"?"stab-b":"stab-w"):""}`} onClick={()=>handleView(v)}>{v}</button>
        ))}
      </div>
      <div className="s4" style={{gap:5}}>
        <div className="sbox"><div className="sval" style={{color:disc==="bjj"?"var(--bjj)":"var(--wres)",fontSize:20}}>{filtered.length}</div><div className="slbl">Sessions</div></div>
        <div className="sbox"><div className="sval" style={{color:"var(--lift)",fontSize:20}}>{wins}</div><div className="slbl">Wins</div></div>
        <div className="sbox"><div className="sval" style={{color:"var(--accent)",fontSize:20}}>{losses}</div><div className="slbl">Losses</div></div>
        <div className="sbox"><div className="sval" style={{color:"var(--muted)",fontSize:16}}>{Math.floor(totalMins/60)}h{totalMins%60}m</div><div className="slbl">Mat Time</div></div>
      </div>

      {view==="sessions"&&(
        <>
          <div className="sec">Sessions</div>
          {filtered.length===0&&<div className="empty"><div className="eico">🥋</div>No sessions yet — tap + to log one</div>}
          {filtered.map(s=>(
            <div key={s.id} className={`card ${s.type==="bjj"?"cb":"cw"}`}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <div style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700}}>{s.subtype} · {s.duration}min · {s.rounds} rounds</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{fmtD(s.date)}</div>
                </div>
                <button className="btn bsm bgh" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>setGrapple(p=>p.filter(x=>x.id!==s.id))}>✕</button>
              </div>
              {s.techniques?.length>0&&<div className="tags">{s.techniques.map(t=><span key={t} className={`tag ${s.type==="bjj"?"tbjj":"twres"}`}>{t}</span>)}</div>}
              {s.notes&&<div className="snotes">{s.notes}</div>}
            </div>
          ))}
        </>
      )}

      {view==="techniques"&&(
        <>
          <div className="sec">Techniques Drilled</div>
          {allTechs.length===0&&<div className="empty"><div className="eico">📋</div>Log sessions with techniques to see them here</div>}
          {allTechs.map(tech=>{
            const count = filtered.filter(s=>s.techniques?.includes(tech)).length;
            const pct = Math.round((count/Math.max(filtered.length,1))*100);
            const rv = videos.filter(v=>v.discipline===disc&&v.techniques?.includes(tech));
            return (
              <div key={tech} style={{padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontFamily:"Barlow Condensed",fontSize:13,fontWeight:700}}>{tech}</span>
                  <span style={{fontFamily:"Barlow Condensed",fontSize:11,color:"var(--muted)"}}>{count}x</span>
                </div>
                <div className="pbar"><div className={`pfill ${disc==="bjj"?"pfbjj":"pfwres"}`} style={{width:`${pct}%`}} /></div>
                {rv.length>0&&(
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                    {rv.map(v=>(
                      <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                        style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:2,background:"var(--surface2)",border:"1px solid var(--border)",textDecoration:"none",color:"var(--muted)",fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1}}>
                        ▶ {v.title.slice(0,22)}{v.title.length>22?"…":""}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {view==="videos"&&(
        <div style={{textAlign:"center",padding:"24px 0",color:"var(--muted)"}}>
          <div style={{fontSize:36,marginBottom:10,opacity:0.5}}>🎬</div>
          <div style={{fontFamily:"Barlow Condensed",fontSize:12,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Videos displayed on the right panel</div>
          <button className="btn bgh bsm" onClick={()=>setModal("new-video")}>+ Save New Video</button>
        </div>
      )}

      {view==="competitions"&&(
        <>
          <div className="sec">Competition Record</div>
          <button className="btn bprim" style={{marginBottom:11}} onClick={()=>setModal("new-comp")}>+ Log Result</button>
          {fComps.length===0&&<div className="empty"><div className="eico">🏆</div>No results yet</div>}
          {fComps.map(c=>(
            <div key={c.id} className={`card ${c.type==="bjj"?"cb":"cw"}`}>
              <div className="comprow">
                <div className={`cbadge c${c.result}`}>{c.result}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Barlow Condensed",fontSize:13,fontWeight:700}}>{c.name}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>vs {c.opponent} · {c.method} · {fmtShort(c.date)}</div>
                  {c.notes&&<div className="snotes">{c.notes}</div>}
                </div>
                <button className="btn bsm bgh" style={{fontSize:11,padding:"3px 7px",flexShrink:0}} onClick={()=>setComps(p=>p.filter(x=>x.id!==c.id))}>✕</button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ── STRATEGIES TAB ─────────────────────────────────────────────────────────────
const CATS = ["All","Guard attacks & submissions","Passing sequences","Positional escapes","Takedowns & trips"];
const CAT_SHORT = {"All":"All","Guard attacks & submissions":"Guard","Passing sequences":"Passing","Positional escapes":"Escapes","Takedowns & trips":"Takedowns"};

function StrategiesTab({ strategies, setStrategies, videos, selectedStrat, onSelect, setModal }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const filtered = strategies.filter(s=>(cat==="All"||s.category===cat)&&(!q||s.name.toLowerCase().includes(q.toLowerCase())||s.description?.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <div className="sec">Game Plans</div>
      <div className="search-bar">
        <span className="search-ico">🔍</span>
        <input placeholder="Search strategies..." value={q} onChange={e=>setQ(e.target.value)} />
        {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:14}}>✕</button>}
      </div>
      <div className="cat-filter">
        {CATS.map(c=><button key={c} className={"catpill"+(cat===c?" on":"")} onClick={()=>setCat(c)}>{CAT_SHORT[c]}</button>)}
      </div>
      {filtered.length===0&&<div className="empty"><div className="eico">📖</div>{q?"No results":"No strategies yet — tap + to create one"}</div>}
      {filtered.map(s=>(
        <div key={s.id} className={"strat-card"+(selectedStrat&&selectedStrat.id===s.id?" sel":"")} onClick={()=>onSelect(s)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{fontFamily:"Bebas Neue",fontSize:16,letterSpacing:2,flex:1,marginRight:8}}>{s.name}</div>
            <button className="btn bsm bdel" style={{padding:"3px 8px",fontSize:11,flexShrink:0}} onClick={e=>{e.stopPropagation();setStrategies(p=>p.filter(x=>x.id!==s.id));}}>✕</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
            <span style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--bjj)"}}>{CAT_SHORT[s.category]||s.category}</span>
            <div className="diff-dots">{[1,2,3,4,5].map(i=><div key={i} className={"diff-dot"+(i<=s.difficulty?" on":"")} />)}</div>
            <span style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1}}>{s.drilled}x drilled · {s.steps.length} steps</span>
          </div>
          {s.description&&<div style={{fontSize:11,color:"#666",marginTop:5,lineHeight:1.4}}>{s.description.slice(0,90)}{s.description.length>90?"…":""}</div>}
          <div style={{marginTop:7,fontSize:11,color:"var(--muted)",fontFamily:"Barlow Condensed",letterSpacing:1}}>Tap to view full sequence →</div>
        </div>
      ))}
    </>
  );
}

// ── STRATEGY DETAIL ────────────────────────────────────────────────────────────
function StrategyDetail({ strat, videos, onDrilled }) {
  const linkedVideo = strat.videoUrl ? videos.find(v=>v.url===strat.videoUrl) : null;
  const p = linkedVideo ? (linkedVideo.platform||getPlatform(linkedVideo.url)) : null;
  return (
    <div style={{maxWidth:680}}>
      <div style={{fontFamily:"Bebas Neue",fontSize:30,letterSpacing:4,marginBottom:4}}>{strat.name}</div>
      {strat.description&&<div style={{fontSize:13,color:"#aaa",lineHeight:1.6,marginBottom:18,maxWidth:600}}>{strat.description}</div>}
      <div className="dstats">
        <div className="dstat"><div className="dstat-val" style={{color:"var(--bjj)"}}>{strat.steps.length}</div><div className="dstat-lbl">Steps</div></div>
        <div className="dstat"><div className="dstat-val" style={{color:"var(--gold)"}}>{strat.drilled}</div><div className="dstat-lbl">Drilled</div></div>
        <div className="dstat">
          <div className="diff-dots" style={{justifyContent:"center",gap:4,marginTop:4}}>
            {[1,2,3,4,5].map(i=><div key={i} className={"diff-dot"+(i<=strat.difficulty?" on":"")} style={{width:8,height:8}} />)}
          </div>
          <div className="dstat-lbl" style={{marginTop:6}}>Difficulty</div>
        </div>
      </div>

      <div style={{fontFamily:"Barlow Condensed",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:14}}>Sequence</div>
      <div className="seq-flow">
        {strat.steps.map((step,i)=>(
          <div key={i} className="seq-step">
            <div className="seq-spine">
              <div className="seq-num">{i+1}</div>
              {i<strat.steps.length-1&&<div className="seq-line" />}
            </div>
            <div className="seq-body">
              <div className="seq-step-name">{step.name}</div>
              {step.note&&<div className="seq-step-note">{step.note}</div>}
              {step.tip&&<div className="seq-tip">💡 {step.tip}</div>}
            </div>
          </div>
        ))}
      </div>

      <button className="drill-btn" style={{marginTop:10}} onClick={onDrilled}>✓ Mark Drilled ({strat.drilled})</button>

      {strat.notes&&(
        <div className="notes-box">
          <div className="notes-lbl">Notes</div>
          <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>{strat.notes}</div>
        </div>
      )}
      {linkedVideo&&(
        <a href={linkedVideo.url} target="_blank" rel="noopener noreferrer" className="vlink">
          <div style={{fontSize:20}}>{p==="bilibili"?"📺":"▶"}</div>
          <div>
            <div style={{fontFamily:"Barlow Condensed",fontSize:13,fontWeight:700,color:"var(--text)"}}>{linkedVideo.title}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{p==="bilibili"?"Watch on Bilibili ↗":"Watch on YouTube ↗"}</div>
          </div>
        </a>
      )}
    </div>
  );
}

// ── MOBILITY TAB ───────────────────────────────────────────────────────────────
const MOB_CATS = ["All","Hips","Shoulders","Spine","Legs","Full Body","Warmup","Cooldown"];

function MobilityTab({ mobVideos, setMobVideos, activeMobVideo, onSelect, setModal }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const filtered = mobVideos.filter(v=>(cat==="All"||v.category===cat)&&(!q||v.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <div className="sec">Mobility</div>
      <div className="search-bar">
        <span className="search-ico">🔍</span>
        <input placeholder="Search routines..." value={q} onChange={e=>setQ(e.target.value)} />
        {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:14}}>✕</button>}
      </div>
      <div className="cat-filter">
        {MOB_CATS.map(c=><button key={c} className={"catpill"+(cat===c?" on":"")} onClick={()=>setCat(c)}>{c}</button>)}
      </div>
      {filtered.length===0&&<div className="empty"><div className="eico">🧘</div>{q?"No results":"No videos saved — tap + to add one"}</div>}
      {filtered.map(v=>{
        const th = thumbUrl(v.url);
        const isActive = activeMobVideo?.id===v.id;
        return (
          <div key={v.id} onClick={()=>onSelect(v)}
            style={{background:isActive?"#0d1e2e":"var(--surface)",border:`1px solid ${isActive?"var(--bjj)":"var(--border)"}`,borderRadius:4,marginBottom:9,overflow:"hidden",cursor:"pointer",transition:"border-color 0.2s",position:"relative"}}>
            <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:"var(--bjj)"}} />
            <div style={{display:"flex",gap:11,padding:"11px 13px 11px 16px",alignItems:"center"}}>
              {th?(
                <img src={th} alt={v.title} style={{width:68,height:38,objectFit:"cover",borderRadius:2,flexShrink:0}} />
              ):(
                <div style={{width:68,height:38,background:"var(--surface3)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16,color:"var(--muted)"}}>▶</div>
              )}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700,letterSpacing:0.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.title}</div>
                <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center"}}>
                  <span style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--bjj)"}}>{v.category}</span>
                  {v.duration&&<span style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1}}>{v.duration}</span>}
                </div>
                {v.notes&&<div style={{fontSize:11,color:"#666",marginTop:3,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical"}}>{v.notes}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0,alignItems:"flex-end"}}>
                <div style={{fontFamily:"Barlow Condensed",fontSize:10,color:isActive?"var(--bjj)":"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>{isActive?"▶ Playing":"▶ Play"}</div>
                <button className="btn bsm bdel" style={{fontSize:10,padding:"3px 7px"}}
                  onClick={e=>{e.stopPropagation();setMobVideos(p=>p.filter(x=>x.id!==v.id));}}>✕</button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── MOBILITY PLAYER ────────────────────────────────────────────────────────────
function MobPlayer({ video }) {
  const id = getYTId(video.url);
  if (!id) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:12,padding:32,color:"var(--muted)"}}>
      <div style={{fontSize:40,opacity:0.3}}>▶</div>
      <div style={{fontFamily:"Barlow Condensed",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>Cannot embed this video</div>
      <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn bprim" style={{width:"auto",padding:"10px 24px",textDecoration:"none"}}>Open in YouTube ↗</a>
    </div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{width:"100%",aspectRatio:"16/9",background:"#000",flexShrink:0}}>
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
          title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen style={{border:"none",display:"block"}} />
      </div>
      <div style={{padding:"18px 24px",flex:1,overflowY:"auto"}}>
        <div style={{fontFamily:"Bebas Neue",fontSize:24,letterSpacing:3,marginBottom:4}}>{video.title}</div>
        <div style={{display:"flex",gap:10,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontFamily:"Barlow Condensed",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--bjj)",background:"#1a3a5c",border:"1px solid var(--bjj)",padding:"2px 9px",borderRadius:2}}>{video.category}</span>
          {video.duration&&<span style={{fontFamily:"Barlow Condensed",fontSize:12,color:"var(--muted)",letterSpacing:1}}>{video.duration}</span>}
        </div>
        {video.notes&&(
          <div className="notes-box">
            <div className="notes-lbl">Notes</div>
            <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>{video.notes}</div>
          </div>
        )}
        <a href={video.url} target="_blank" rel="noopener noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:14,padding:"9px 18px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:3,textDecoration:"none",fontFamily:"Barlow Condensed",fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--text)"}}>
          ↗ Open in YouTube
        </a>
      </div>
    </div>
  );
}

// ── PRs TAB ────────────────────────────────────────────────────────────────────
function PRsTab({ allPRs, workouts }) {
  const entries = Object.entries(allPRs).sort((a,b)=>b[1]-a[1]);
  return (
    <>
      <div className="sec">Personal Records</div>
      {entries.length===0&&<div className="empty"><div className="eico">🏆</div>Log workouts to see your PRs here</div>}
      {entries.map(([name,pr])=>{
        const hist = workouts.flatMap(w=>w.exercises.filter(e=>e.name===name).flatMap(e=>e.sets.map(s=>({w:s.weight,d:w.date})))).sort((a,b)=>a.d.localeCompare(b.d));
        const maxW = hist.length ? Math.max(...hist.map(h=>h.w), 1) : 1;
        return (
          <div key={name} className="card cg" style={{marginBottom:11}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
              <div>
                <div style={{fontFamily:"Bebas Neue",fontSize:18,letterSpacing:2}}>{name}</div>
                <div style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>{hist.length} sets logged</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Bebas Neue",fontSize:26,color:"var(--gold)",letterSpacing:3,lineHeight:1}}>{pr>0?pr:"BW"}</div>
                {pr>0&&<div style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1}}>KG</div>}
              </div>
            </div>
            {hist.length>1&&(
              <>
                <div className="lbl">Progress</div>
                <div className="chart" style={{height:34}}>
                  {hist.slice(-12).map((h,j)=><div key={j} className={`bar blift ${j<hist.slice(-12).length-1?"bdim":""}`} style={{height:`${Math.max((h.w/maxW)*100,h.w>0?4:2)}%`}} />)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

// ── MODALS ─────────────────────────────────────────────────────────────────────
function NewWorkoutModal({ onClose, onSave, allPRs }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(todayStr());
  const [exercises, setExercises] = useState([{name:"",sets:[{reps:"",weight:"",bw:false}]}]);

  const addEx = () => setExercises(p=>[...p,{name:"",sets:[{reps:"",weight:"",bw:false}]}]);
  const addSet = ei => setExercises(p=>p.map((e,i)=>i===ei?{...e,sets:[...e.sets,{reps:"",weight:"",bw:false}]}:e));
  const updEx = (ei,f,v) => setExercises(p=>p.map((e,i)=>i===ei?{...e,[f]:v}:e));
  const updSet = (ei,si,f,v) => setExercises(p=>p.map((e,i)=>i===ei?{...e,sets:e.sets.map((s,j)=>j===si?{...s,[f]:v}:s)}:e));

  const save = () => {
    if (!name) return;
    const exs = exercises.filter(e=>e.name).map(e=>({
      name: e.name,
      sets: e.sets.filter(s=>s.reps).map(s=>({reps:Number(s.reps),weight:s.bw?0:Number(s.weight)||0})),
      pr: allPRs[e.name] || Math.max(...e.sets.filter(s=>!s.bw&&s.weight).map(s=>Number(s.weight)||0), 0)
    }));
    if (!exs.length) return;
    onSave({id:Date.now(),name,date,exercises:exs});
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">New Workout <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="fg"><label className="lbl">Workout Name</label><input className="inp" placeholder="Push Day" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Date</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <div className="divider" />
        {exercises.map((ex,ei)=>(
          <div key={ei} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:3,padding:"11px 12px",marginBottom:10}}>
            <div className="fg"><label className="lbl">Exercise {ei+1}</label><input className="inp" placeholder="e.g. Bench Press" value={ex.name} onChange={e=>updEx(ei,"name",e.target.value)} /></div>
            {ex.sets.map((s,si)=>(
              <div key={si} style={{display:"flex",gap:7,alignItems:"flex-end",marginBottom:7}}>
                <div className="fg" style={{flex:1,marginBottom:0}}><label className="lbl">Reps</label><input className="inp" type="number" placeholder="5" value={s.reps} onChange={e=>updSet(ei,si,"reps",e.target.value)} /></div>
                {!s.bw&&<div className="fg" style={{flex:1,marginBottom:0}}><label className="lbl">kg</label><input className="inp" type="number" placeholder="100" value={s.weight} onChange={e=>updSet(ei,si,"weight",e.target.value)} /></div>}
                <button onClick={()=>updSet(ei,si,"bw",!s.bw)} style={{padding:"9px 10px",borderRadius:3,border:`1px solid ${s.bw?"var(--lift)":"var(--border)"}`,background:s.bw?"#1a3a1a":"var(--surface2)",color:s.bw?"var(--lift)":"var(--muted)",fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1,cursor:"pointer",flexShrink:0,marginBottom:0}}>BW</button>
              </div>
            ))}
            <button className="btn bgh bsm" onClick={()=>addSet(ei)}>+ Set</button>
          </div>
        ))}
        <button className="btn bgh" style={{width:"100%",marginBottom:10}} onClick={addEx}>+ Add Exercise</button>
        <button className="btn bprim" style={{opacity:(!name)?0.5:1}} onClick={save}>Save Workout</button>
      </div>
    </div>
  );
}

function NewSessionModal({ onClose, onSave }) {
  const [type, setType] = useState("bjj");
  const [subtype, setSubtype] = useState("Gi");
  const [date, setDate] = useState(todayStr());
  const [dur, setDur] = useState("");
  const [rounds, setRounds] = useState("");
  const [tech, setTech] = useState("");
  const [notes, setNotes] = useState("");

  const save = () => {
    if (!dur) return;
    onSave({id:Date.now(),type,subtype,date,duration:Number(dur),rounds:Number(rounds)||0,techniques:tech.split(",").map(t=>t.trim()).filter(Boolean),notes});
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Log Session <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="r2">
          <div className="fg"><label className="lbl">Discipline</label>
            <select className="inp" value={type} onChange={e=>{setType(e.target.value);setSubtype(e.target.value==="bjj"?"Gi":"Freestyle");}}>
              <option value="bjj">BJJ</option><option value="wrestling">Wrestling</option>
            </select>
          </div>
          <div className="fg"><label className="lbl">Style</label>
            <select className="inp" value={subtype} onChange={e=>setSubtype(e.target.value)}>
              {type==="bjj"?<><option>Gi</option><option>No-Gi</option></>:<><option>Freestyle</option><option>Greco-Roman</option><option>Folkstyle</option></>}
            </select>
          </div>
        </div>
        <div className="r2">
          <div className="fg"><label className="lbl">Date</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
          <div className="fg"><label className="lbl">Duration (min)</label><input className="inp" type="number" placeholder="90" value={dur} onChange={e=>setDur(e.target.value)} /></div>
        </div>
        <div className="fg"><label className="lbl">Rounds</label><input className="inp" type="number" placeholder="6" value={rounds} onChange={e=>setRounds(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Techniques (comma separated)</label><input className="inp" placeholder="Triangle, Guard Pass, Sprawl" value={tech} onChange={e=>setTech(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="How did it go?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" style={{opacity:!dur?0.5:1}} onClick={save}>Save Session</button>
      </div>
    </div>
  );
}

function NewCompModal({ onClose, onSave }) {
  const [type, setType] = useState("bjj");
  const [name, setName] = useState("");
  const [date, setDate] = useState(todayStr());
  const [result, setResult] = useState("W");
  const [opp, setOpp] = useState("");
  const [method, setMethod] = useState("");
  const [notes, setNotes] = useState("");

  const save = () => { if (!name||!opp) return; onSave({id:Date.now(),type,name,date,result,opponent:opp,method,notes}); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Log Competition <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="r2">
          <div className="fg"><label className="lbl">Discipline</label><select className="inp" value={type} onChange={e=>setType(e.target.value)}><option value="bjj">BJJ</option><option value="wrestling">Wrestling</option></select></div>
          <div className="fg"><label className="lbl">Result</label><select className="inp" value={result} onChange={e=>setResult(e.target.value)}><option value="W">Win</option><option value="L">Loss</option><option value="D">Draw</option></select></div>
        </div>
        <div className="fg"><label className="lbl">Event Name</label><input className="inp" placeholder="City Open 2025" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="r2">
          <div className="fg"><label className="lbl">Opponent</label><input className="inp" placeholder="Name" value={opp} onChange={e=>setOpp(e.target.value)} /></div>
          <div className="fg"><label className="lbl">Method</label><input className="inp" placeholder="Submission, Points..." value={method} onChange={e=>setMethod(e.target.value)} /></div>
        </div>
        <div className="fg"><label className="lbl">Date</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="What happened?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" style={{opacity:(!name||!opp)?0.5:1}} onClick={save}>Save Result</button>
      </div>
    </div>
  );
}

function NewVideoModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [discipline, setDiscipline] = useState("bjj");
  const [techniques, setTechniques] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");

  const p = getPlatform(url);
  const chk = v => { setUrl(v); setErr(v&&!v.startsWith("http")?"URL must start with https://":""); };

  const save = () => {
    if (!title||!url) return;
    if (!url.startsWith("http")) { setErr("Please enter a valid URL"); return; }
    onSave({id:Date.now(),title,url,discipline,platform:p,techniques:techniques.split(",").map(t=>t.trim()).filter(Boolean),notes});
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Save Video <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="fg">
          <label className="lbl">Video URL</label>
          <input className="inp" placeholder="https://www.bilibili.com/video/... or youtube.com/..." value={url} onChange={e=>chk(e.target.value)} />
          {err&&<div style={{color:"var(--accent)",fontSize:11,marginTop:3,fontFamily:"Barlow Condensed",letterSpacing:1}}>{err}</div>}
          {url&&!err&&<div style={{marginTop:6}}><span className={`pbadge ${p==="youtube"?"pb-yt":p==="bilibili"?"pb-bb":"pb-ot"}`}>{p==="bilibili"?"📺 Bilibili":p==="youtube"?"▶ YouTube":"🔗 URL"}</span></div>}
        </div>
        <div className="fg"><label className="lbl">Title</label><input className="inp" placeholder="Guard Passing Breakdown" value={title} onChange={e=>setTitle(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Discipline</label><select className="inp" value={discipline} onChange={e=>setDiscipline(e.target.value)}><option value="bjj">BJJ</option><option value="wrestling">Wrestling</option></select></div>
        <div className="fg"><label className="lbl">Techniques (comma separated)</label><input className="inp" placeholder="Guard Pass, Triangle" value={techniques} onChange={e=>setTechniques(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="What's useful about this?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" style={{opacity:(!title||!url||err)?0.5:1}} onClick={save}>Save Video</button>
      </div>
    </div>
  );
}

function NewMobVideoModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Hips");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");

  const th = thumbUrl(url);
  const chk = v => { setUrl(v); setErr(v&&!v.startsWith("http")?"URL must start with https://":""); };

  const save = () => {
    if (!title||!url) return;
    if (!url.startsWith("http")) { setErr("Please enter a valid URL"); return; }
    onSave({id:Date.now(),title,url,category,duration,notes,platform:getPlatform(url)});
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Save Mobility Video <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="fg">
          <label className="lbl">YouTube URL</label>
          <input className="inp" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={e=>chk(e.target.value)} />
          {err&&<div style={{color:"var(--accent)",fontSize:11,marginTop:3,fontFamily:"Barlow Condensed",letterSpacing:1}}>{err}</div>}
          {th&&!err&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:10}}>
            <img src={th} alt="" style={{width:78,height:44,objectFit:"cover",borderRadius:2}} />
            <span className="pbadge pb-yt">▶ YouTube</span>
          </div>}
        </div>
        <div className="fg"><label className="lbl">Title</label><input className="inp" placeholder="Hip Flexor Mobility for BJJ" value={title} onChange={e=>setTitle(e.target.value)} /></div>
        <div className="r2">
          <div className="fg"><label className="lbl">Category</label>
            <select className="inp" value={category} onChange={e=>setCategory(e.target.value)}>
              {MOB_CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fg"><label className="lbl">Duration</label><input className="inp" placeholder="15 min" value={duration} onChange={e=>setDuration(e.target.value)} /></div>
        </div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="What to focus on, when to use it..." value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" style={{opacity:(!title||!url||err)?0.5:1}} onClick={save}>Save Video</button>
      </div>
    </div>
  );
}

function NewStrategyModal({ onClose, onSave, videos }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Guard attacks & submissions");
  const [difficulty, setDifficulty] = useState(3);
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([{name:"",note:"",tip:""},{name:"",note:"",tip:""}]);
  const [notes, setNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const addStep = () => setSteps(p=>[...p,{name:"",note:"",tip:""}]);
  const updStep = (i,f,v) => setSteps(p=>p.map((s,j)=>j===i?{...s,[f]:v}:s));
  const removeStep = i => setSteps(p=>p.filter((_,j)=>j!==i));

  const save = () => {
    if (!name||!steps.filter(s=>s.name).length) return;
    onSave({id:Date.now(),name,category,difficulty,description,steps:steps.filter(s=>s.name).map(s=>({name:s.name,note:s.note||null,tip:s.tip||null})),notes,drilled:0,videoUrl:videoUrl||null});
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{maxHeight:"92vh"}} onClick={e=>e.stopPropagation()}>
        <div className="modal-title">New Strategy <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="fg"><label className="lbl">Strategy Name</label><input className="inp" placeholder="e.g. Triangle from Closed Guard" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Category</label>
          <select className="inp" value={category} onChange={e=>setCategory(e.target.value)}>
            {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg">
          <label className="lbl">Difficulty</label>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            {[1,2,3,4,5].map(i=>(
              <button key={i} onClick={()=>setDifficulty(i)}
                style={{width:32,height:32,borderRadius:"50%",border:"1px solid",borderColor:i<=difficulty?"var(--gold)":"var(--border)",background:i<=difficulty?"var(--gold)":"transparent",color:i<=difficulty?"#000":"var(--muted)",fontFamily:"Barlow Condensed",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="fg"><label className="lbl">Description</label><textarea className="inp" placeholder="When to use this, what position it starts from..." value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div className="divider" />
        <div className="lbl" style={{marginBottom:12}}>Steps (A → B → C)</div>
        {steps.map((step,i)=>(
          <div key={i} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:3,padding:"11px 12px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"var(--bjj)",color:"#fff",fontFamily:"Bebas Neue",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
              <input className="inp" style={{flex:1}} placeholder="Step name (e.g. Trap the arm)" value={step.name} onChange={e=>updStep(i,"name",e.target.value)} />
              {steps.length>1&&<button className="xbtn" onClick={()=>removeStep(i)} style={{fontSize:14}}>✕</button>}
            </div>
            <input className="inp" style={{marginBottom:6}} placeholder="Details / notes (optional)" value={step.note} onChange={e=>updStep(i,"note",e.target.value)} />
            <input className="inp" placeholder="💡 Tip (optional)" value={step.tip} onChange={e=>updStep(i,"tip",e.target.value)} />
          </div>
        ))}
        <button className="btn bgh" style={{width:"100%",marginBottom:12}} onClick={addStep}>+ Add Step</button>
        <div className="divider" />
        <div className="fg"><label className="lbl">Notes / Common Mistakes</label><textarea className="inp" placeholder="What to watch out for, common failures..." value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Link a Video (paste URL, optional)</label><input className="inp" placeholder="https://..." value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} /></div>
        <button className="btn bprim" style={{opacity:(!name||!steps.filter(s=>s.name).length)?0.5:1}} onClick={save}>Save Strategy</button>
      </div>
    </div>
  );
}

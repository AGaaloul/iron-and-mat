import { useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Barlow:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #111; --surface2: #1a1a1a; --surface3: #222;
    --border: #2a2a2a; --accent: #e63c2f; --gold: #c9a84c; --text: #f0ece4; --muted: #666;
    --bjj-accent: #2e7dcc; --bjj-bg: #1a3a5c;
    --wres-accent: #cc4e2e; --wres-bg: #3a1a1a;
    --lift-accent: #4ecc6e;
  }
  html, body { background: var(--bg); color: var(--text); font-family: 'Barlow', sans-serif; height: 100%; overflow: hidden; }
  #root { height: 100%; }

  .shell { display: flex; height: 100vh; overflow: hidden; }

  .phone-panel {
    width: 390px; min-width: 390px;
    background: var(--bg); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden; position: relative;
  }
  .phone-header { padding: 18px 20px 0; flex-shrink: 0; }
  .phone-header-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 3px; line-height: 1; }
  .logo span { color: var(--accent); }
  .datebadge { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; padding-top: 5px; }
  .phone-scroll { flex: 1; overflow-y: auto; padding: 14px 18px 88px; }
  .phone-scroll::-webkit-scrollbar { width: 2px; }
  .phone-scroll::-webkit-scrollbar-thumb { background: var(--border); }

  .right-panel { flex: 1; background: var(--surface2); display: flex; flex-direction: column; overflow: hidden; }
  .right-header { padding: 22px 28px 18px; border-bottom: 1px solid var(--border); flex-shrink: 0; display: flex; justify-content: space-between; align-items: flex-start; }
  .right-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 4px; }
  .right-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }
  .right-body { flex: 1; overflow-y: auto; padding: 22px 28px; }
  .right-body::-webkit-scrollbar { width: 2px; }
  .right-body::-webkit-scrollbar-thumb { background: var(--border); }
  .right-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--muted); gap: 10px; }
  .right-empty-icon { font-size: 44px; opacity: 0.2; }
  .right-empty-text { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

  .vgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .vcard { background: var(--surface); border: 1px solid var(--border); border-radius: 5px; overflow: hidden; position: relative; }
  .vcard::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 1; }
  .vcard.bjj::before { background: var(--bjj-accent); }
  .vcard.wrestling::before { background: var(--wres-accent); }
  .vthumb { width: 100%; aspect-ratio: 16/9; background: var(--surface3); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; }
  .vthumb img { width: 100%; height: 100%; object-fit: cover; }
  .vthumb-ph { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
  .play-btn { position: absolute; width: 48px; height: 48px; border-radius: 50%; background: rgba(230,60,47,0.9); display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 18px rgba(0,0,0,0.6); transition: transform 0.2s; }
  .vthumb:hover .play-btn { transform: scale(1.1); }
  .vplayer { width: 100%; aspect-ratio: 16/9; background: #000; }
  .vplayer iframe { width: 100%; height: 100%; border: none; display: block; }
  .vbody { padding: 12px 14px 10px; }
  .vtitle { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px; }
  .vnotes { font-size: 12px; color: #aaa; margin-bottom: 7px; line-height: 1.4; }
  .vfooter { display: flex; justify-content: space-between; align-items: center; }
  .vactions { display: flex; gap: 7px; padding: 0 14px 11px; }

  .pbadge { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .pb-yt { background: rgba(255,0,0,0.1); color: #ff4444; border: 1px solid rgba(255,0,0,0.2); }
  .pb-bb { background: rgba(0,160,220,0.1); color: #00a0dc; border: 1px solid rgba(0,160,220,0.2); }
  .pb-ot { background: var(--surface3); color: var(--muted); border: 1px solid var(--border); }

  .bottom-nav { position: absolute; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); display: flex; z-index: 10; }
  .navbtn { flex: 1; padding: 10px 4px 8px; background: none; border: none; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; transition: color 0.2s; }
  .navbtn .ico { font-size: 17px; }
  .navbtn.on { color: var(--accent); }
  .fab { position: absolute; bottom: 68px; right: 14px; width: 46px; height: 46px; background: var(--accent); border: none; border-radius: 50%; color: #fff; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(230,60,47,0.4); transition: transform 0.2s; z-index: 10; }
  .fab:hover { transform: scale(1.06); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 13px 15px; margin-bottom: 9px; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }
  .cl::before { background: var(--lift-accent); }
  .cb::before { background: var(--bjj-accent); }
  .cw::before { background: var(--wres-accent); }
  .cg::before { background: var(--gold); }

  .sec { font-family: 'Bebas Neue', sans-serif; font-size: 19px; letter-spacing: 3px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .sec::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .inp { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 3px; color: var(--text); font-family: 'Barlow', sans-serif; font-size: 14px; padding: 9px 11px; outline: none; transition: border-color 0.2s; }
  .inp:focus { border-color: var(--accent); }
  .inp::placeholder { color: var(--muted); }
  select.inp option { background: var(--surface2); }
  textarea.inp { resize: none; min-height: 68px; }
  .lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; display: block; }
  .fg { margin-bottom: 10px; }
  .r2 { display: flex; gap: 9px; }
  .r2 .fg { flex: 1; }

  .btn { padding: 9px 16px; border: none; border-radius: 3px; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; }
  .bprim { background: var(--accent); color: #fff; width: 100%; }
  .bprim:hover { background: #c92e22; }
  .bsm { padding: 5px 10px; font-size: 11px; }
  .bgh { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .bgh:hover { color: var(--text); }
  .bdel { background: transparent; color: var(--accent); border: 1px solid var(--accent); }

  .s3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 12px; }
  .s4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-bottom: 12px; }
  .sbox { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 9px 7px; text-align: center; }
  .sval { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; line-height: 1; }
  .slbl { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }

  .stbl { width: 100%; border-collapse: collapse; margin: 7px 0; }
  .stbl th { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); text-align: left; padding: 3px 5px; border-bottom: 1px solid var(--border); }
  .stbl td { padding: 5px 5px; font-size: 13px; border-bottom: 1px solid #161616; }
  .stbl tr:last-child td { border-bottom: none; }
  .snum { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: var(--muted); font-weight: 700; }
  .prp { display: inline-block; background: var(--gold); color: #000; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 1px; padding: 1px 4px; border-radius: 2px; margin-left: 4px; }

  .chart { display: flex; align-items: flex-end; gap: 3px; height: 48px; margin: 7px 0 2px; }
  .bar { flex: 1; border-radius: 2px 2px 0 0; transition: height 0.4s; }
  .blift { background: var(--lift-accent); }
  .bdim { opacity: 0.35; }
  .clbls { display: flex; gap: 3px; }
  .clbl { flex: 1; text-align: center; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; color: var(--muted); }

  .pbar { height: 3px; background: var(--surface3); border-radius: 2px; overflow: hidden; margin-top: 5px; }
  .pfill { height: 100%; border-radius: 2px; }
  .pfbjj { background: var(--bjj-accent); }
  .pfwres { background: var(--wres-accent); }

  .dpills { display: flex; gap: 7px; margin-bottom: 12px; }
  .dpill { padding: 5px 14px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--muted); transition: all 0.2s; }
  .dpill-b { background: #1a3a5c; border-color: var(--bjj-accent); color: var(--bjj-accent); }
  .dpill-w { background: #3a1a1a; border-color: var(--wres-accent); color: var(--wres-accent); }

  .stabs { display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap; }
  .stab { padding: 4px 10px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--muted); transition: all 0.2s; }
  .stab-b { background: #1a3a5c; border-color: var(--bjj-accent); color: var(--bjj-accent); }
  .stab-w { background: #3a1a1a; border-color: var(--wres-accent); color: var(--wres-accent); }

  .comprow { display: flex; align-items: flex-start; gap: 11px; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .comprow:last-child { border-bottom: none; }
  .cbadge { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 13px; flex-shrink: 0; margin-top: 1px; }
  .cW { background: #1a3a1a; color: var(--lift-accent); border: 1px solid var(--lift-accent); }
  .cL { background: #3a1a1a; color: var(--accent); border: 1px solid var(--accent); }
  .cD { background: #2a2a1a; color: var(--gold); border: 1px solid var(--gold); }

  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200; display: flex; align-items: flex-end; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-bottom: none; border-radius: 8px 8px 0 0; width: 390px; padding: 20px 18px 34px; max-height: 88vh; overflow-y: auto; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 21px; letter-spacing: 3px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .xbtn { background: none; border: none; color: var(--muted); font-size: 19px; cursor: pointer; line-height: 1; }
  .xbtn:hover { color: var(--text); }
  .divider { height: 1px; background: var(--border); margin: 12px 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
  .tag { background: var(--surface3); border: 1px solid var(--border); border-radius: 2px; padding: 2px 6px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .tbjj { border-color: var(--bjj-accent); color: var(--bjj-accent); }
  .twres { border-color: var(--wres-accent); color: var(--wres-accent); }
  .snotes { font-size: 12px; color: #aaa; margin-top: 5px; line-height: 1.4; }
  .empty { text-align: center; padding: 28px 16px; color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
  .eico { font-size: 26px; margin-bottom: 7px; opacity: 0.4; }

  /* ── STRATEGIES ── */
  .cat-filter { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
  .catpill { padding: 4px 10px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--muted); transition: all 0.2s; }
  .catpill.on { background: #1a3a5c; border-color: var(--bjj-accent); color: var(--bjj-accent); }
  .strat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 12px 14px; margin-bottom: 8px; position: relative; overflow: hidden; cursor: pointer; transition: border-color 0.2s; }
  .strat-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: var(--bjj-accent); }
  .strat-card:hover { border-color: #444; }
  .strat-card.sel { border-color: var(--bjj-accent); background: #0d1e2e; }
  .strat-title { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px; }
  .strat-meta { display: flex; align-items: center; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
  .strat-cat { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--bjj-accent); }
  .diff-dots { display: flex; gap: 3px; }
  .diff-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--surface3); }
  .diff-dot.on { background: var(--gold); }
  .strat-drilled { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; color: var(--muted); letter-spacing: 1px; }
  .seq-flow { display: flex; flex-direction: column; }
  .seq-step { display: flex; gap: 14px; align-items: flex-start; }
  .seq-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 32px; }
  .seq-num { width: 32px; height: 32px; border-radius: 50%; background: var(--bjj-accent); color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .seq-line { width: 2px; flex: 1; min-height: 18px; background: var(--border); margin: 2px 0; }
  .seq-body { padding-bottom: 18px; flex: 1; }
  .seq-step-name { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 2px; }
  .seq-step-note { font-size: 12px; color: #aaa; line-height: 1.5; }
  .seq-tip { display: inline-block; margin-top: 5px; padding: 2px 9px; background: rgba(46,125,204,0.1); border: 1px solid rgba(46,125,204,0.2); border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; color: var(--bjj-accent); letter-spacing: 1px; }
  .drill-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; background: var(--surface); border: 1px solid var(--bjj-accent); border-radius: 3px; color: var(--bjj-accent); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .drill-btn:hover { background: #0d1e2e; }
  .drill-btn.drilled { background: var(--bjj-accent); color: #fff; border-color: var(--bjj-accent); }
  .detail-title { font-family: 'Bebas Neue', sans-serif; font-size: 34px; letter-spacing: 4px; margin-bottom: 4px; }
  .detail-desc { font-size: 13px; color: #aaa; line-height: 1.6; margin-bottom: 18px; max-width: 600px; }
  .detail-stats { display: flex; gap: 10px; margin-bottom: 22px; flex-wrap: wrap; }
  .dstat { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 9px 14px; text-align: center; }
  .dstat-val { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; line-height: 1; }
  .dstat-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
  .notes-box { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 13px; margin-top: 18px; }
  .notes-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .vlink { display: flex; align-items: center; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 11px 15px; margin-top: 12px; text-decoration: none; transition: border-color 0.2s; }
  .vlink:hover { border-color: var(--bjj-accent); }
  .vlink-icon { font-size: 22px; }
  .vlink-title { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; color: var(--text); }
  .vlink-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .seq-section-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; margin-top: 4px; }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
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
  { id:1, title:"GMB Mobility for BJJ — Hip Opening", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category:"Hips", duration:"12 min", notes:"Great pre-roll warmup. Focus on the frog stretch section.", platform:"youtube" },
  { id:2, title:"Tom Merrick — Full Body Flexibility Routine", url:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", category:"Full Body", duration:"20 min", notes:"Do this on rest days.", platform:"youtube" },
];

const INIT_STRATS = [
  {
    id: 1, name: "Closed Guard Triangle Setup", category: "Guard attacks & submissions",
    difficulty: 3, drilled: 12,
    description: "Classic closed guard triangle from arm trap. Works when opponent tries to posture up with one arm inside.",
    steps: [
      { name: "Establish closed guard", note: "Hips high, break their posture down. Grab head or collar.", tip: "Keep elbows tight to their arms" },
      { name: "Trap one arm across", note: "Overhook their right arm, push it across your centerline with your hip.", tip: "Use your whole body, not just arms" },
      { name: "Open guard & shoot hips", note: "Open guard, turn on your side, shoot hips up toward their shoulder.", tip: "The angle is everything — be perpendicular" },
      { name: "Throw leg over neck", note: "Throw your left leg over the back of their neck, lock the figure-4.", tip: null },
      { name: "Finish — squeeze & pull", note: "Squeeze knees together, pull down on their head, extend hips upward.", tip: "Rotate toward the trapped arm for tighter squeeze" },
    ],
    notes: "Most common failure point: not getting perpendicular. If they stack, grab their ankle and continue rotating.",
    videoUrl: null,
  },
  {
    id: 2, name: "Torreando Pass to Side Control", category: "Passing sequences",
    difficulty: 2, drilled: 8,
    description: "Fast, pressure-based guard pass using pants grips to clear the legs and land in side control.",
    steps: [
      { name: "Grip both pants at the knee", note: "Stand in base, grab both knees firmly.", tip: "Wrists turned inward for better grip" },
      { name: "Push knees to one side", note: "Shove their legs to your left while you move right.", tip: null },
      { name: "Clear the hips", note: "Step around, do not hop over — keep your hips low.", tip: "Be fast — no pause between clearing and pinning" },
      { name: "Drive shoulder into far armpit", note: "Land with crossface, shoulder in, hip on hip.", tip: null },
      { name: "Secure side control", note: "Underhook the far arm, block the hip with your knee.", tip: "Kill their inside elbow immediately" },
    ],
    notes: "If they re-guard with their knees, immediately redirect to the other side.",
    videoUrl: null,
  },
];
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtD = d => new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

function getPlatform(url) {
  if (!url) return "other";
  if (url.includes("youtube.com")||url.includes("youtu.be")) return "youtube";
  if (url.includes("bilibili.com")) return "bilibili";
  return "other";
}
function getYTId(url) { const m=url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/); return m?m[1]:null; }
function getBVId(url) { const m=url.match(/\/video\/(BV[a-zA-Z0-9]+)/); return m?m[1]:null; }
function embedUrl(url,p) {
  if (p==="youtube") { const id=getYTId(url); return id?`https://www.youtube.com/embed/${id}?autoplay=1`:null; }

  return url;
}
function thumbUrl(url,p) {
  if (p==="youtube") { const id=getYTId(url); return id?`https://img.youtube.com/vi/${id}/mqdefault.jpg`:null; }
  return null;
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [workouts, setWorkouts] = useState(INIT_W);
  const [grapple, setGrapple] = useState(INIT_G);
  const [comps, setComps] = useState(INIT_C);
  const [videos, setVideos] = useState(INIT_V);
  const [modal, setModal] = useState(null);
  const [rightDisc, setRightDisc] = useState("bjj");
  const [showRight, setShowRight] = useState(false);
  const [strategies, setStrategies] = useState(INIT_STRATS);
  const [mobVideos, setMobVideos] = useState(INIT_MOB);
  const [activeMobVideo, setActiveMobVideo] = useState(null);
  const [selectedStrat, setSelectedStrat] = useState(null);
  const [rightMode, setRightMode] = useState("welcome"); // "welcome" | "videos" | "strategy" 

  const allPRs = workouts.flatMap(w=>w.exercises.map(e=>({name:e.name,pr:e.pr})))
    .reduce((a,c)=>{ if (!a[c.name]||c.pr>a[c.name]) a[c.name]=c.pr; return a; },{});

  const openVideos = (disc) => { setRightDisc(disc); setShowRight(true); setRightMode("videos"); };
  const openStrategy = (s) => { setSelectedStrat(s); setRightMode("strategy"); };

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">
        {/* LEFT */}
        <div className="phone-panel">
          <div className="phone-header">
            <div className="phone-header-top">
              <div className="logo">IRON<span>&amp;</span>MAT</div>
              <div className="datebadge">{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
            </div>
          </div>
          <div className="phone-scroll">
            {tab==="dashboard" && <Dashboard workouts={workouts} grapple={grapple} comps={comps} allPRs={allPRs} setTab={setTab} />}
            {tab==="lift" && <LiftTab workouts={workouts} setWorkouts={setWorkouts} />}
            {tab==="grapple" && <GrappleTab grapple={grapple} setGrapple={setGrapple} comps={comps} setComps={setComps} videos={videos} setModal={setModal} openVideos={openVideos} />}
            {tab==="mobility" && <MobilityTab mobVideos={mobVideos} setMobVideos={setMobVideos} activeMobVideo={activeMobVideo} setActiveMobVideo={setActiveMobVideo} setModal={setModal} setRightMode={setRightMode} />}
            {tab==="strategies" && <StrategiesTab strategies={strategies} setStrategies={setStrategies} videos={videos} selectedStrat={selectedStrat} onSelect={openStrategy} setModal={setModal} />}
            {tab==="prs" && <PRsTab allPRs={allPRs} workouts={workouts} />}
          </div>
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
          <nav className="bottom-nav">
            {[{id:"dashboard",ico:"⚡",lbl:"Home"},{id:"lift",ico:"🏋️",lbl:"Lift"},{id:"grapple",ico:"🥋",lbl:"Grapple"},{id:"strategies",ico:"📖",lbl:"Plans"},{id:"mobility",ico:"🧘",lbl:"Mobility"},{id:"prs",ico:"🏆",lbl:"PRs"}].map(n=>(
              <button key={n.id} className={`navbtn ${tab===n.id?"on":""}`} onClick={()=>setTab(n.id)}>
                <span className="ico">{n.ico}</span>{n.lbl}
              </button>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          {rightMode === "videos" && (
            <>
              <div className="right-header">
                <div>
                  <div className="right-title">{(rightDisc==="bjj"?"BJJ":"Wrestling")+" Videos"}</div>
                  <div className="right-sub">{videos.filter(v=>v.discipline===rightDisc).length} saved · paste any Bilibili or YouTube URL</div>
                </div>
                <button className="btn bgh bsm" onClick={()=>setModal("new-video")}>+ Save Video</button>
              </div>
              <div className="right-body">
                <VideoGrid videos={videos.filter(v=>v.discipline===rightDisc)} discipline={rightDisc} onDelete={id=>setVideos(p=>p.filter(x=>x.id!==id))} onAdd={()=>setModal("new-video")} />
              </div>
            </>
          )}
          {rightMode === "strategy" && selectedStrat && (
            <>
              <div className="right-header">
                <div>
                  <div className="right-title" style={{fontSize:20}}>{selectedStrat.name}</div>
                  <div className="right-sub">{selectedStrat.category} · {selectedStrat.drilled} times drilled</div>
                </div>
                <button className="btn bgh bsm" onClick={()=>{const upd={...selectedStrat,drilled:selectedStrat.drilled+1};setStrategies(p=>p.map(s=>s.id===upd.id?upd:s));setSelectedStrat(upd);}}>+ Drilled</button>
              </div>
              <div className="right-body">
                <StrategyDetail strat={selectedStrat} videos={videos} onDrilled={()=>{const upd={...selectedStrat,drilled:selectedStrat.drilled+1};setStrategies(p=>p.map(s=>s.id===upd.id?upd:s));setSelectedStrat(upd);}} />
              </div>
            </>
          )}
          {rightMode === "mobility" && activeMobVideo && (
            <>
              <div className="right-header">
                <div>
                  <div className="right-title" style={{fontSize:18}}>{activeMobVideo.title}</div>
                  <div className="right-sub">{activeMobVideo.category} · {activeMobVideo.duration}</div>
                </div>
                <a href={activeMobVideo.url} target="_blank" rel="noopener noreferrer" className="btn bgh bsm" style={{textDecoration:"none",marginTop:4}}>Open in YouTube ↗</a>
              </div>
              <div className="right-body" style={{padding:0, display:"flex", flexDirection:"column"}}>
                <MobPlayer video={activeMobVideo} />
              </div>
            </>
          )}
          {rightMode === "welcome" && (
            <div className="right-panel">
              <div className="right-header">
                <div>
                  <div className="right-title">Game Plans</div>
                  <div className="right-sub">Select a strategy or mobility video to get started</div>
                </div>
              </div>
              <div className="right-body">
                <div className="right-empty">
                  <div className="right-empty-icon">📖</div>
                  <div className="right-empty-text">Select a tab to get started</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── VIDEO GRID ────────────────────────────────────────────────────────────────
function VideoGrid({ videos, discipline, onDelete, onAdd }) {
  if (videos.length===0) return (
    <div className="right-empty">
      <div className="right-empty-icon">📺</div>
      <div className="right-empty-text">No videos saved yet</div>
      <button className="btn bprim" style={{width:"auto",padding:"10px 22px",marginTop:10}} onClick={onAdd}>+ Save First Video</button>
    </div>
  );
  return (
    <div className="vgrid">
      {videos.map(v=><VideoCard key={v.id} video={v} discipline={discipline} onDelete={()=>onDelete(v.id)} />)}
    </div>
  );
}

function VideoCard({ video, discipline, onDelete }) {
  const [playing, setPlaying] = useState(false);
  const p = video.platform || getPlatform(video.url);
  const isBilibili = p === "bilibili";
  const em = !isBilibili ? embedUrl(video.url, p) : null;
  const th = thumbUrl(video.url, p);

  // Bilibili: clean link card, no embed
  if (isBilibili) {
    return (
      <div className={`vcard ${discipline}`}>
        <a href={video.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
          <div style={{background:"var(--surface3)",aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#2a2a2a"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--surface3)"}>
            <div style={{fontSize:36}}>📺</div>
            <div style={{fontFamily:"Barlow Condensed",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Open on Bilibili</div>
            <div style={{fontFamily:"Barlow Condensed",fontSize:10,letterSpacing:1,color:"#444",textTransform:"uppercase"}}>↗ Opens in new tab</div>
          </div>
        </a>
        <div className="vbody">
          <div className="vtitle">{video.title}</div>
          {video.notes && <div className="vnotes">{video.notes}</div>}
          <div className="vfooter">
            <span className="pbadge pb-bb">Bilibili</span>
          </div>
          {video.techniques?.length>0 && (
            <div className="tags" style={{marginTop:7}}>
              {video.techniques.map(t=><span key={t} className={`tag ${discipline==="bjj"?"tbjj":"twres"}`}>{t}</span>)}
            </div>
          )}
        </div>
        <div className="vactions">
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn bprim bsm" style={{textDecoration:"none",flex:1,textAlign:"center"}}>Watch on Bilibili ↗</a>
          <button className="btn bsm bdel" onClick={onDelete}>Delete</button>
        </div>
      </div>
    );
  }

  // YouTube / other: embed in-app
  return (
    <div className={`vcard ${discipline}`}>
      {playing && em ? (
        <div className="vplayer"><iframe src={em} allowFullScreen allow="autoplay; encrypted-media" title={video.title} /></div>
      ) : (
        <div className="vthumb" onClick={()=>setPlaying(true)}>
          {th ? <img src={th} alt={video.title} /> : (
            <div className="vthumb-ph">
              <div style={{fontSize:30,opacity:0.35}}>▶</div>
              <div style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:2,fontWeight:700,textTransform:"uppercase"}}>{p==="youtube"?"YouTube":"Video"}</div>
            </div>
          )}
          <div className="play-btn">▶</div>
        </div>
      )}
      <div className="vbody">
        <div className="vtitle">{video.title}</div>
        {video.notes && <div className="vnotes">{video.notes}</div>}
        <div className="vfooter">
          <span className={`pbadge ${p==="youtube"?"pb-yt":"pb-ot"}`}>
            {p==="youtube"?"YouTube":"URL"}
          </span>
        </div>
        {video.techniques?.length>0 && (
          <div className="tags" style={{marginTop:7}}>
            {video.techniques.map(t=><span key={t} className={`tag ${discipline==="bjj"?"tbjj":"twres"}`}>{t}</span>)}
          </div>
        )}
      </div>
      <div className="vactions">
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn bgh bsm" style={{textDecoration:"none"}}>Open ↗</a>
        <button className="btn bsm bdel" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ workouts, grapple, comps, allPRs, setTab }) {
  const bjj=grapple.filter(g=>g.type==="bjj").length;
  const wres=grapple.filter(g=>g.type==="wrestling").length;
  const wins=comps.filter(c=>c.result==="W").length;
  const recent=[...workouts,...grapple].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  const now=new Date();
  const week=["M","T","W","T","F","S","S"].map((d,i)=>{
    const dt=new Date(now); dt.setDate(now.getDate()-(6-i));
    const ds=dt.toISOString().split("T")[0];
    return {d, hasL:workouts.some(w=>w.date===ds), gr:grapple.find(g=>g.date===ds)};
  });
  return (
    <>
      <div className="s4">
        {[{v:workouts.length,l:"Lifts",c:"var(--lift-accent)"},{v:bjj,l:"BJJ",c:"var(--bjj-accent)"},{v:wres,l:"Wrestl",c:"var(--wres-accent)"},{v:wins,l:"Wins",c:"var(--gold)"}].map(s=>(
          <div key={s.l} className="sbox"><div className="sval" style={{color:s.c}}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="lbl" style={{marginBottom:7}}>This Week</div>
        <div style={{display:"flex",gap:5}}>
          {week.map((d,i)=>(
            <div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{height:30,borderRadius:3,marginBottom:4,background:d.hasL?"var(--lift-accent)":d.gr?d.gr.type==="wrestling"?"var(--wres-accent)":"var(--bjj-accent)":"var(--surface3)",opacity:(d.hasL||d.gr)?0.85:0.22}} />
              <span style={{fontSize:9,color:"var(--muted)",fontFamily:"Barlow Condensed",fontWeight:700}}>{d.d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sec">Recent</div>
      {recent.map((item,i)=>(
        <div key={i} className={`card ${item.exercises?"cl":item.type==="bjj"?"cb":"cw"}`}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700}}>{item.name||(item.type?.toUpperCase()+" — "+item.subtype)}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{fmtD(item.date)}</div>
            </div>
            <div style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:item.exercises?"var(--lift-accent)":item.type==="bjj"?"var(--bjj-accent)":"var(--wres-accent)",paddingTop:2}}>
              {item.exercises?"LIFT":item.type}
            </div>
          </div>
        </div>
      ))}
      <div className="sec" style={{marginTop:14}}>Top PRs</div>
      {Object.entries(allPRs).slice(0,3).map(([name,pr])=>(
        <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
          <span style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700}}>{name}</span>
          <span style={{fontFamily:"Bebas Neue",fontSize:19,color:"var(--gold)",letterSpacing:2}}>{pr>0?`${pr}kg`:"BW"}</span>
        </div>
      ))}
    </>
  );
}

// ── LIFT ──────────────────────────────────────────────────────────────────────
function LiftTab({ workouts, setWorkouts }) {
  const weeks=["Feb 3","Feb 10","Feb 17","Feb 24","Mar 3"];
  const vols=[12400,13100,12800,14200,15100];
  const mx=Math.max(...vols);
  return (
    <>
      <div className="sec">Strength</div>
      <div className="card cl">
        <div className="lbl">Weekly Volume (kg)</div>
        <div className="chart">{vols.map((v,i)=><div key={i} className={`bar blift ${i<vols.length-1?"bdim":""}`} style={{height:`${(v/mx)*100}%`}} />)}</div>
        <div className="clbls">{weeks.map(w=><div key={w} className="clbl">{w}</div>)}</div>
      </div>
      <div className="sec">Workout Log</div>
      {workouts.length===0&&<div className="empty"><div className="eico">🏋️</div>No workouts yet</div>}
      {workouts.map(w=><WCard key={w.id} workout={w} onDelete={()=>setWorkouts(p=>p.filter(x=>x.id!==w.id))} />)}
    </>
  );
}
function WCard({ workout, onDelete }) {
  const [open,setOpen]=useState(false);
  const vol=workout.exercises.reduce((s,e)=>s+e.sets.reduce((ss,st)=>ss+st.reps*(st.weight||1),0),0);
  return (
    <div className="card cl">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
        <div>
          <div style={{fontFamily:"Bebas Neue",fontSize:17,letterSpacing:2}}>{workout.name}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{fmtD(workout.date)} · {workout.exercises.length} ex · {vol.toLocaleString()}kg</div>
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
                      <td>{s.weight>0?`${s.weight}kg`:"BW"}{s.weight>=ex.pr&&ex.pr>0&&<span className="prp">PR</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button className="btn bsm bdel" onClick={onDelete}>Delete</button>
        </>
      )}
    </div>
  );
}

// ── GRAPPLE ───────────────────────────────────────────────────────────────────
function GrappleTab({ grapple, setGrapple, comps, setComps, videos, setModal, openVideos }) {
  const [view,setView]=useState("sessions");
  const [disc,setDisc]=useState("bjj");
  const filtered=grapple.filter(g=>g.type===disc);
  const fComps=comps.filter(c=>c.type===disc);
  const allTechs=[...new Set(filtered.flatMap(g=>g.techniques||[]))];
  const wins=fComps.filter(c=>c.result==="W").length;
  const losses=fComps.filter(c=>c.result==="L").length;

  const handleView = (v) => {
    setView(v);
    if (v==="videos") openVideos(disc);
  };
  const handleDisc = (d) => {
    setDisc(d);
    if (view==="videos") openVideos(d);
  };

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
      <div className="s3">
        <div className="sbox"><div className="sval" style={{color:disc==="bjj"?"var(--bjj-accent)":"var(--wres-accent)"}}>{filtered.length}</div><div className="slbl">Sessions</div></div>
        <div className="sbox"><div className="sval" style={{color:"var(--lift-accent)"}}>{wins}</div><div className="slbl">Wins</div></div>
        <div className="sbox"><div className="sval" style={{color:"var(--accent)"}}>{losses}</div><div className="slbl">Losses</div></div>
      </div>

      {view==="sessions"&&(
        <>
          <div className="sec">Sessions</div>
          {filtered.length===0&&<div className="empty"><div className="eico">🥋</div>No sessions yet</div>}
          {filtered.map(s=>(
            <div key={s.id} className={`card ${s.type==="bjj"?"cb":"cw"}`}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <div style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700}}>{s.subtype} · {s.duration}min · {s.rounds}R</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{fmtD(s.date)}</div>
                </div>
                <button className="btn bsm bgh" onClick={()=>setGrapple(p=>p.filter(x=>x.id!==s.id))}>✕</button>
              </div>
              {s.techniques?.length>0&&<div className="tags">{s.techniques.map(t=><span key={t} className={`tag ${s.type==="bjj"?"tbjj":"twres"}`}>{t}</span>)}</div>}
              {s.notes&&<div className="snotes">{s.notes}</div>}
            </div>
          ))}
        </>
      )}

      {view==="techniques"&&(
        <>
          <div className="sec">Techniques</div>
          {allTechs.length===0&&<div className="empty"><div className="eico">📋</div>No techniques yet</div>}
          {allTechs.map(tech=>{
            const count=filtered.filter(s=>s.techniques?.includes(tech)).length;
            const pct=Math.round((count/Math.max(filtered.length,1))*100);
            const rv=videos.filter(v=>v.discipline===disc&&v.techniques?.includes(tech));
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
          <div style={{fontFamily:"Barlow Condensed",fontSize:12,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>
            Videos are shown in the panel on the right
          </div>
          <button className="btn bgh bsm" onClick={()=>setModal("new-video")}>+ Save New Video</button>
        </div>
      )}

      {view==="competitions"&&(
        <>
          <div className="sec">Competitions</div>
          <button className="btn bprim" style={{marginBottom:11}} onClick={()=>setModal("new-comp")}>+ Log Result</button>
          {fComps.length===0&&<div className="empty"><div className="eico">🏆</div>No results yet</div>}
          {fComps.map(c=>(
            <div key={c.id} className={`card ${c.type==="bjj"?"cb":"cw"}`}>
              <div className="comprow">
                <div className={`cbadge c${c.result}`}>{c.result}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Barlow Condensed",fontSize:13,fontWeight:700}}>{c.name}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>vs {c.opponent} · {c.method} · {fmtD(c.date)}</div>
                  {c.notes&&<div className="snotes">{c.notes}</div>}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

// ── PRs ───────────────────────────────────────────────────────────────────────
function PRsTab({ allPRs, workouts }) {
  const entries=Object.entries(allPRs).sort((a,b)=>b[1]-a[1]);
  return (
    <>
      <div className="sec">Personal Records</div>
      {entries.length===0&&<div className="empty"><div className="eico">🏆</div>No PRs yet</div>}
      {entries.map(([name,pr])=>{
        const hist=workouts.flatMap(w=>w.exercises.filter(e=>e.name===name).flatMap(e=>e.sets.map(s=>({w:s.weight,d:w.date})))).sort((a,b)=>a.d.localeCompare(b.d));
        const mx=Math.max(...hist.map(h=>h.w),1);
        return (
          <div key={name} className="card cg" style={{marginBottom:11}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
              <div>
                <div style={{fontFamily:"Bebas Neue",fontSize:19,letterSpacing:2}}>{name}</div>
                <div style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase"}}>{hist.length} sets</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"Bebas Neue",fontSize:28,color:"var(--gold)",letterSpacing:3,lineHeight:1}}>{pr>0?pr:"BW"}</div>
                {pr>0&&<div style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1}}>KG</div>}
              </div>
            </div>
            {hist.length>1&&(
              <>
                <div className="lbl">Progress</div>
                <div className="chart" style={{height:34}}>
                  {hist.slice(-12).map((h,j)=><div key={j} className={`bar blift ${j<hist.slice(-12).length-1?"bdim":""}`} style={{height:`${(h.w/mx)*100}%`}} />)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

// ── MODALS ────────────────────────────────────────────────────────────────────
function NewWorkoutModal({ onClose, onSave, allPRs }) {
  const [name,setName]=useState(""); const [date,setDate]=useState(todayStr());
  const [exercises,setExercises]=useState([{name:"",sets:[{reps:"",weight:""}]}]);
  const addEx=()=>setExercises(p=>[...p,{name:"",sets:[{reps:"",weight:""}]}]);
  const addSet=ei=>setExercises(p=>p.map((e,i)=>i===ei?{...e,sets:[...e.sets,{reps:"",weight:""}]}:e));
  const updEx=(ei,f,v)=>setExercises(p=>p.map((e,i)=>i===ei?{...e,[f]:v}:e));
  const updSet=(ei,si,f,v)=>setExercises(p=>p.map((e,i)=>i===ei?{...e,sets:e.sets.map((s,j)=>j===si?{...s,[f]:v}:s)}:e));
  const save=()=>{
    if (!name) return;
    const exs=exercises.filter(e=>e.name).map(e=>({
      name:e.name, sets:e.sets.filter(s=>s.reps).map(s=>({reps:Number(s.reps),weight:Number(s.weight)||0})),
      pr:allPRs[e.name]||Math.max(...e.sets.map(s=>Number(s.weight)||0),0)
    }));
    onSave({id:Date.now(),name,date,exercises:exs});
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">New Workout <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="fg"><label className="lbl">Name</label><input className="inp" placeholder="Push Day" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Date</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <div className="divider" />
        {exercises.map((ex,ei)=>(
          <div key={ei} style={{marginBottom:13}}>
            <div className="fg"><label className="lbl">Exercise {ei+1}</label><input className="inp" placeholder="Bench Press" value={ex.name} onChange={e=>updEx(ei,"name",e.target.value)} /></div>
            {ex.sets.map((s,si)=>(
              <div key={si} className="r2">
                <div className="fg"><label className="lbl">Reps</label><input className="inp" type="number" placeholder="5" value={s.reps} onChange={e=>updSet(ei,si,"reps",e.target.value)} /></div>
                <div className="fg"><label className="lbl">kg</label><input className="inp" type="number" placeholder="100" value={s.weight} onChange={e=>updSet(ei,si,"weight",e.target.value)} /></div>
              </div>
            ))}
            <button className="btn bgh bsm" onClick={()=>addSet(ei)}>+ Set</button>
          </div>
        ))}
        <button className="btn bgh" style={{width:"100%",marginBottom:9}} onClick={addEx}>+ Exercise</button>
        <button className="btn bprim" onClick={save}>Save Workout</button>
      </div>
    </div>
  );
}

function NewSessionModal({ onClose, onSave }) {
  const [type,setType]=useState("bjj"); const [subtype,setSubtype]=useState("Gi");
  const [date,setDate]=useState(todayStr()); const [dur,setDur]=useState(""); const [rounds,setRounds]=useState("");
  const [tech,setTech]=useState(""); const [notes,setNotes]=useState("");
  const save=()=>{ if (!dur) return; onSave({id:Date.now(),type,subtype,date,duration:Number(dur),rounds:Number(rounds)||0,techniques:tech.split(",").map(t=>t.trim()).filter(Boolean),notes}); };
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
        <div className="fg"><label className="lbl">Techniques (comma-separated)</label><input className="inp" placeholder="Triangle, Guard Pass" value={tech} onChange={e=>setTech(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="How did it go?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" onClick={save}>Save Session</button>
      </div>
    </div>
  );
}

function NewCompModal({ onClose, onSave }) {
  const [type,setType]=useState("bjj"); const [name,setName]=useState(""); const [date,setDate]=useState(todayStr());
  const [result,setResult]=useState("W"); const [opp,setOpp]=useState(""); const [method,setMethod]=useState(""); const [notes,setNotes]=useState("");
  const save=()=>{ if (!name||!opp) return; onSave({id:Date.now(),type,name,date,result,opponent:opp,method,notes}); };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Log Competition <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="r2">
          <div className="fg"><label className="lbl">Discipline</label><select className="inp" value={type} onChange={e=>setType(e.target.value)}><option value="bjj">BJJ</option><option value="wrestling">Wrestling</option></select></div>
          <div className="fg"><label className="lbl">Result</label><select className="inp" value={result} onChange={e=>setResult(e.target.value)}><option value="W">Win</option><option value="L">Loss</option><option value="D">Draw</option></select></div>
        </div>
        <div className="fg"><label className="lbl">Event</label><input className="inp" placeholder="City Open 2025" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="r2">
          <div className="fg"><label className="lbl">Opponent</label><input className="inp" placeholder="Name" value={opp} onChange={e=>setOpp(e.target.value)} /></div>
          <div className="fg"><label className="lbl">Method</label><input className="inp" placeholder="Submission..." value={method} onChange={e=>setMethod(e.target.value)} /></div>
        </div>
        <div className="fg"><label className="lbl">Date</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="What happened?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" onClick={save}>Save Result</button>
      </div>
    </div>
  );
}

function NewVideoModal({ onClose, onSave }) {
  const [title,setTitle]=useState(""); const [url,setUrl]=useState(""); const [disc,setDisc]=useState("bjj");
  const [tech,setTech]=useState(""); const [notes,setNotes]=useState(""); const [err,setErr]=useState("");
  const p=getPlatform(url);
  const chk=v=>{ setUrl(v); setErr(v&&!v.startsWith("http")?"URL must start with https://":""); };
  const save=()=>{
    if (!title||!url) return;
    if (!url.startsWith("http")) { setErr("Please enter a valid URL"); return; }
    onSave({id:Date.now(),title,url,discipline:disc,platform:p,techniques:tech.split(",").map(t=>t.trim()).filter(Boolean),notes});
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Save Video <button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="fg">
          <label className="lbl">Video URL</label>
          <input className="inp" placeholder="https://www.bilibili.com/video/... or youtube.com/..." value={url} onChange={e=>chk(e.target.value)} />
          {err&&<div style={{color:"var(--accent)",fontSize:11,marginTop:3,fontFamily:"Barlow Condensed",letterSpacing:1}}>{err}</div>}
          {url&&!err&&<div style={{marginTop:5}}><span className={`pbadge ${p==="youtube"?"pb-yt":p==="bilibili"?"pb-bb":"pb-ot"}`}>{p==="bilibili"?"📺 Bilibili detected":p==="youtube"?"▶ YouTube detected":"🔗 Custom URL"}</span></div>}
        </div>
        <div className="fg"><label className="lbl">Title</label><input className="inp" placeholder="Guard Passing Breakdown" value={title} onChange={e=>setTitle(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Discipline</label><select className="inp" value={disc} onChange={e=>setDisc(e.target.value)}><option value="bjj">BJJ</option><option value="wrestling">Wrestling</option></select></div>
        <div className="fg"><label className="lbl">Techniques (comma-separated)</label><input className="inp" placeholder="Guard Pass, Triangle" value={tech} onChange={e=>setTech(e.target.value)} /></div>
        <div className="fg"><label className="lbl">Notes</label><textarea className="inp" placeholder="What's useful about this?" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
        <button className="btn bprim" style={{opacity:(!title||!url||err)?0.5:1}} onClick={save}>Save Video</button>
      </div>
    </div>
  );
}

// ── STRATEGIES TAB ────────────────────────────────────────────────────────────
const CATS = ["All", "Guard attacks & submissions", "Passing sequences", "Positional escapes", "Takedowns & trips"];

function StrategiesTab({ strategies, setStrategies, videos, selectedStrat, onSelect, setModal }) {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? strategies : strategies.filter(s => s.category === cat);

  return (
    <>
      <div className="sec">Game Plans</div>
      <div className="cat-filter">
        {CATS.map(c => (
          <button key={c} className={"catpill" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
            {c === "All" ? "All" : c === "Guard attacks & submissions" ? "Guard" : c === "Passing sequences" ? "Passing" : c === "Positional escapes" ? "Escapes" : "Takedowns"}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty"><div className="eico">📖</div>No strategies yet. Tap + to create one.</div>
      )}
      {filtered.map(s => (
        <div key={s.id} className={"strat-card" + (selectedStrat && selectedStrat.id === s.id ? " sel" : "")} onClick={() => onSelect(s)}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
            <div className="strat-title">{s.name}</div>
            <button className="btn bsm bdel" style={{flexShrink:0, marginLeft:8}} onClick={e=>{e.stopPropagation();setStrategies(p=>p.filter(x=>x.id!==s.id));}}>✕</button>
          </div>
          <div className="strat-meta">
            <span className="strat-cat">{s.category}</span>
            <div className="diff-dots">
              {[1,2,3,4,5].map(i => <div key={i} className={"diff-dot" + (i <= s.difficulty ? " on" : "")} />)}
            </div>
            <span className="strat-drilled">{s.drilled}x drilled</span>
          </div>
          {s.description && <div style={{fontSize:11,color:"#666",marginTop:5,lineHeight:1.4}}>{s.description.slice(0,80)}{s.description.length>80?"…":""}</div>}
          <div style={{marginTop:7, fontSize:11, color:"var(--muted)", fontFamily:"Barlow Condensed", letterSpacing:1}}>
            {s.steps.length} steps · tap to view →
          </div>
        </div>
      ))}
    </>
  );
}

// ── STRATEGY DETAIL (right panel) ─────────────────────────────────────────────
function StrategyDetail({ strat, videos, onDrilled }) {
  const linkedVideo = strat.videoUrl ? videos.find(v => v.url === strat.videoUrl) : null;
  const platform = linkedVideo ? (linkedVideo.platform || getPlatform(linkedVideo.url)) : null;

  return (
    <div style={{maxWidth: 680}}>
      <div className="detail-title">{strat.name}</div>
      {strat.description && <div className="detail-desc">{strat.description}</div>}

      <div className="detail-stats">
        <div className="dstat">
          <div className="dstat-val" style={{color:"var(--bjj-accent)"}}>{strat.steps.length}</div>
          <div className="dstat-lbl">Steps</div>
        </div>
        <div className="dstat">
          <div className="dstat-val" style={{color:"var(--gold)"}}>{strat.drilled}</div>
          <div className="dstat-lbl">Drilled</div>
        </div>
        <div className="dstat">
          <div className="dstat-val" style={{color:"var(--text)"}}>
            <div className="diff-dots" style={{justifyContent:"center", gap:4}}>
              {[1,2,3,4,5].map(i => <div key={i} className={"diff-dot" + (i <= strat.difficulty ? " on" : "")} style={{width:8,height:8}} />)}
            </div>
          </div>
          <div className="dstat-lbl">Difficulty</div>
        </div>
      </div>

      <div className="seq-section-lbl">Sequence</div>
      <div className="seq-flow">
        {strat.steps.map((step, i) => (
          <div key={i} className="seq-step">
            <div className="seq-spine">
              <div className="seq-num">{i + 1}</div>
              {i < strat.steps.length - 1 && <div className="seq-line" />}
            </div>
            <div className="seq-body">
              <div className="seq-step-name">{step.name}</div>
              {step.note && <div className="seq-step-note">{step.note}</div>}
              {step.tip && <div className="seq-tip">💡 {step.tip}</div>}
            </div>
          </div>
        ))}
      </div>

      <button className="drill-btn" style={{marginTop:8}} onClick={onDrilled}>
        ✓ Mark as Drilled ({strat.drilled})
      </button>

      {strat.notes && (
        <div className="notes-box">
          <div className="notes-lbl">Notes</div>
          <div style={{fontSize:13, color:"#aaa", lineHeight:1.6}}>{strat.notes}</div>
        </div>
      )}

      {linkedVideo && (
        <a href={linkedVideo.url} target="_blank" rel="noopener noreferrer" className="vlink">
          <div className="vlink-icon">{platform === "bilibili" ? "📺" : "▶"}</div>
          <div>
            <div className="vlink-title">{linkedVideo.title}</div>
            <div className="vlink-sub">{platform === "bilibili" ? "Watch on Bilibili ↗" : "Watch on YouTube ↗"}</div>
          </div>
        </a>
      )}
    </div>
  );
}

// ── NEW STRATEGY MODAL ────────────────────────────────────────────────────────
function NewStrategyModal({ onClose, onSave, videos }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Guard attacks & submissions");
  const [difficulty, setDifficulty] = useState(3);
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([{ name: "", note: "", tip: "" }, { name: "", note: "", tip: "" }]);
  const [notes, setNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const addStep = () => setSteps(p => [...p, { name: "", note: "", tip: "" }]);
  const updStep = (i, f, v) => setSteps(p => p.map((s, j) => j === i ? { ...s, [f]: v } : s));
  const removeStep = i => setSteps(p => p.filter((_, j) => j !== i));

  const save = () => {
    if (!name || steps.filter(s => s.name).length === 0) return;
    onSave({
      id: Date.now(), name, category, difficulty, description,
      steps: steps.filter(s => s.name).map(s => ({ name: s.name, note: s.note || null, tip: s.tip || null })),
      notes, drilled: 0,
      videoUrl: videoUrl || null,
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{maxHeight:"92vh"}} onClick={e => e.stopPropagation()}>
        <div className="modal-title">New Strategy <button className="xbtn" onClick={onClose}>✕</button></div>

        <div className="fg"><label className="lbl">Strategy Name</label>
          <input className="inp" placeholder="e.g. Triangle from Closed Guard" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="fg"><label className="lbl">Category</label>
          <select className="inp" value={category} onChange={e => setCategory(e.target.value)}>
            {CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="fg">
          <label className="lbl">Difficulty</label>
          <div style={{display:"flex", gap:8, marginTop:4}}>
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setDifficulty(i)}
                style={{width:32,height:32,borderRadius:"50%",border:"1px solid",borderColor:i<=difficulty?"var(--gold)":"var(--border)",background:i<=difficulty?"var(--gold)":"transparent",color:i<=difficulty?"#000":"var(--muted)",fontFamily:"Barlow Condensed",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="fg"><label className="lbl">Description</label>
          <textarea className="inp" placeholder="When to use this, what position it starts from..." value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="divider" />
        <div className="lbl" style={{marginBottom:12}}>Steps (A → B → C)</div>

        {steps.map((step, i) => (
          <div key={i} style={{background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:3, padding:"11px 12px", marginBottom:8, position:"relative"}}>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:7}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"var(--bjj-accent)",color:"#fff",fontFamily:"Bebas Neue",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
              <input className="inp" style={{flex:1}} placeholder="Step name (e.g. Trap the arm)" value={step.name} onChange={e => updStep(i,"name",e.target.value)} />
              {steps.length > 1 && <button className="xbtn" onClick={() => removeStep(i)} style={{fontSize:14}}>✕</button>}
            </div>
            <input className="inp" style={{marginBottom:6}} placeholder="Notes / details (optional)" value={step.note} onChange={e => updStep(i,"note",e.target.value)} />
            <input className="inp" placeholder="💡 Tip (optional)" value={step.tip} onChange={e => updStep(i,"tip",e.target.value)} />
          </div>
        ))}
        <button className="btn bgh" style={{width:"100%", marginBottom:12}} onClick={addStep}>+ Add Step</button>

        <div className="divider" />
        <div className="fg"><label className="lbl">Notes</label>
          <textarea className="inp" placeholder="Common mistakes, counters, when it fails..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div className="fg"><label className="lbl">Link a Video (optional — paste URL)</label>
          <input className="inp" placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
        </div>

        <button className="btn bprim" style={{opacity:(!name||steps.filter(s=>s.name).length===0)?0.5:1}} onClick={save}>
          Save Strategy
        </button>
      </div>
    </div>
  );
}

// ── MOBILITY TAB ──────────────────────────────────────────────────────────────
const MOB_CATS = ["All", "Hips", "Shoulders", "Spine", "Legs", "Full Body", "Warmup", "Cooldown"];

function MobilityTab({ mobVideos, setMobVideos, activeMobVideo, setActiveMobVideo, setModal, setRightMode }) {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? mobVideos : mobVideos.filter(v => v.category === cat);

  const selectVideo = (v) => {
    setActiveMobVideo(v);
    setRightMode("mobility");
  };

  return (
    <>
      <div className="sec">Mobility</div>
      <div className="cat-filter" style={{marginBottom:12}}>
        {MOB_CATS.map(c => (
          <button key={c} className={"catpill" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty"><div className="eico">🧘</div>No videos saved. Tap + to add one.</div>
      )}

      {filtered.map(v => {
        const th = thumbUrl(v.url, "youtube");
        const isActive = activeMobVideo && activeMobVideo.id === v.id;
        return (
          <div key={v.id}
            onClick={() => selectVideo(v)}
            style={{
              background: isActive ? "#0d1e2e" : "var(--surface)",
              border: `1px solid ${isActive ? "var(--bjj-accent)" : "var(--border)"}`,
              borderRadius: 4, marginBottom: 9, overflow: "hidden",
              cursor: "pointer", transition: "border-color 0.2s", position: "relative"
            }}>
            <div style={{position:"absolute",top:0,left:0,bottom:0,width:3,background:"var(--bjj-accent)"}} />
            <div style={{display:"flex", gap:12, padding:"11px 14px 11px 17px", alignItems:"center"}}>
              {th ? (
                <img src={th} alt={v.title} style={{width:72,height:40,objectFit:"cover",borderRadius:2,flexShrink:0}} />
              ) : (
                <div style={{width:72,height:40,background:"var(--surface3)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>▶</div>
              )}
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:"Barlow Condensed",fontSize:14,fontWeight:700,letterSpacing:0.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.title}</div>
                <div style={{display:"flex",gap:8,marginTop:3,alignItems:"center"}}>
                  <span style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--bjj-accent)"}}>{v.category}</span>
                  {v.duration && <span style={{fontFamily:"Barlow Condensed",fontSize:10,color:"var(--muted)",letterSpacing:1}}>{v.duration}</span>}
                </div>
                {v.notes && <div style={{fontSize:11,color:"#666",marginTop:3,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical"}}>{v.notes}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                <div style={{fontFamily:"Barlow Condensed",fontSize:10,color: isActive?"var(--bjj-accent)":"var(--muted)",letterSpacing:1,textTransform:"uppercase",textAlign:"right"}}>
                  {isActive ? "▶ Playing" : "▶ Watch"}
                </div>
                <button className="btn bsm bdel" style={{fontSize:10,padding:"3px 8px"}}
                  onClick={e=>{e.stopPropagation();setMobVideos(p=>p.filter(x=>x.id!==v.id));if(isActive){setActiveMobVideo(null);}}}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── MOBILITY PLAYER (right panel) ─────────────────────────────────────────────
function MobPlayer({ video }) {
  const id = getYTId(video.url);
  if (!id) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:12,padding:32,color:"var(--muted)"}}>
        <div style={{fontSize:40,opacity:0.3}}>▶</div>
        <div style={{fontFamily:"Barlow Condensed",fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>Cannot embed this video</div>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn bprim" style={{width:"auto",padding:"10px 24px",textDecoration:"none"}}>Open in YouTube ↗</a>
      </div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Big embedded player */}
      <div style={{width:"100%",aspectRatio:"16/9",background:"#000",flexShrink:0}}>
        <iframe
          width="100%" height="100%"
          src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{border:"none",display:"block"}}
        />
      </div>
      {/* Info below player */}
      <div style={{padding:"20px 28px",flex:1,overflowY:"auto"}}>
        <div style={{fontFamily:"Bebas Neue",fontSize:26,letterSpacing:3,marginBottom:4}}>{video.title}</div>
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontFamily:"Barlow Condensed",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--bjj-accent)",background:"#1a3a5c",border:"1px solid var(--bjj-accent)",padding:"2px 9px",borderRadius:2}}>{video.category}</span>
          {video.duration && <span style={{fontFamily:"Barlow Condensed",fontSize:12,color:"var(--muted)",letterSpacing:1}}>{video.duration}</span>}
        </div>
        {video.notes && (
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:4,padding:"12px 16px"}}>
            <div style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>Notes</div>
            <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>{video.notes}</div>
          </div>
        )}
        <a href={video.url} target="_blank" rel="noopener noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:14,padding:"9px 18px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:3,textDecoration:"none",fontFamily:"Barlow Condensed",fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--text)",transition:"border-color 0.2s"}}>
          ↗ Open in YouTube
        </a>
      </div>
    </div>
  );
}

// ── NEW MOBILITY VIDEO MODAL ───────────────────────────────────────────────────
function NewMobVideoModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Hips");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");

  const chk = v => { setUrl(v); setErr(v && !v.startsWith("http") ? "URL must start with https://" : ""); };
  const isYT = getPlatform(url) === "youtube";
  const thumb = isYT ? thumbUrl(url, "youtube") : null;

  const save = () => {
    if (!title || !url) return;
    if (!url.startsWith("http")) { setErr("Please enter a valid URL"); return; }
    onSave({ id: Date.now(), title, url, category, duration, notes, platform: getPlatform(url) });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Save Mobility Video <button className="xbtn" onClick={onClose}>✕</button></div>

        <div className="fg">
          <label className="lbl">YouTube URL</label>
          <input className="inp" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={e => chk(e.target.value)} />
          {err && <div style={{color:"var(--accent)",fontSize:11,marginTop:3,fontFamily:"Barlow Condensed",letterSpacing:1}}>{err}</div>}
          {isYT && !err && url && (
            <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10}}>
              {thumb && <img src={thumb} alt="" style={{width:80,height:45,objectFit:"cover",borderRadius:2}} />}
              <span style={{fontFamily:"Barlow Condensed",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#ff4444",background:"rgba(255,0,0,0.1)",border:"1px solid rgba(255,0,0,0.2)",padding:"2px 8px",borderRadius:2}}>▶ YouTube detected</span>
            </div>
          )}
        </div>

        <div className="fg"><label className="lbl">Title</label>
          <input className="inp" placeholder="e.g. Hip Flexor Mobility for BJJ" value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="r2">
          <div className="fg"><label className="lbl">Category</label>
            <select className="inp" value={category} onChange={e => setCategory(e.target.value)}>
              {MOB_CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fg"><label className="lbl">Duration</label>
            <input className="inp" placeholder="15 min" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
        </div>

        <div className="fg"><label className="lbl">Notes</label>
          <textarea className="inp" placeholder="When to use this, what to focus on..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button className="btn bprim" style={{opacity:(!title||!url||err)?0.5:1}} onClick={save}>Save Video</button>
      </div>
    </div>
  );
}

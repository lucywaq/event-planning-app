import { useState, useEffect, useRef } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F8F9FA;          /* Light grey background */
  --surface: #FFFFFF;    /* White surface */
  --card: #FFFFFF;       /* White cards */
  --border: #DDE3EA;     /* Light border */

  --gold: #6C5CE7;       /* Primary Purple */
  --gold2: #8B7CF0;      /* Lighter Purple */

  --teal: #00CEC9;       /* Secondary Teal */
  --red: #EF4444;        /* Keep red for errors */

  --text: #2D3436;       /* Dark grey text */
  --muted: #636E72;      /* Muted grey text */

  --accent: #6C5CE7;     /* Primary Purple */
  
  --radius: 14px;
}

body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

/* SPLASH */
.splash { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background: radial-gradient(ellipse at 50% 0%, #1a2d50 0%, var(--bg) 70%); }
.splash-logo { font-family:'Playfair Display',serif; font-size:clamp(2.5rem,6vw,4.5rem); font-weight:900; color:var(--gold); letter-spacing:-1px; animation: fadeUp .8s ease forwards; }
.splash-sub { color:var(--muted); margin-top:.5rem; font-size:1.1rem; animation: fadeUp .8s .2s ease both; }
.splash-bar { width:200px; height:3px; background:var(--border); border-radius:2px; margin-top:2.5rem; overflow:hidden; animation: fadeUp .8s .4s ease both; }
.splash-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--gold2)); animation: fill 2.8s ease forwards; }
@keyframes fill { from{width:0} to{width:100%} }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

/* LAYOUT */
.app { display:flex; min-height:100vh; }
.sidebar { width:240px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; padding:1.5rem 1rem; position:fixed; top:0; left:0; bottom:0; z-index:100; transition:.3s; }
.sidebar-logo { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:900; color:var(--gold); padding:.5rem .5rem 1.5rem; border-bottom:1px solid var(--border); margin-bottom:1rem; }
.nav-item { display:flex; align-items:center; gap:.75rem; padding:.65rem .85rem; border-radius:10px; cursor:pointer; color:var(--muted); font-size:.92rem; font-weight:500; transition:.2s; margin-bottom:.25rem; }
.nav-item:hover, .nav-item.active { background:rgba(240,165,0,.1); color:var(--gold); }
.nav-icon { font-size:1.1rem; width:22px; text-align:center; }
.nav-section { font-size:.7rem; font-weight:700; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; padding:.75rem .85rem .35rem; }
.main { margin-left:240px; flex:1; min-height:100vh; padding:2rem; }

/* TOPBAR */
.topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; }
.page-title { font-family:'Playfair Display',serif; font-size:1.8rem; font-weight:700; color:var(--text); }
.topbar-right { display:flex; align-items:center; gap:1rem; }
.avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold2)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.9rem; color:var(--bg); cursor:pointer; }
.badge { background:var(--red); color:#fff; border-radius:50%; width:18px; height:18px; font-size:.65rem; display:flex; align-items:center; justify-content:center; margin-left:-10px; margin-top:-8px; font-weight:700; }
.notif-btn { position:relative; cursor:pointer; font-size:1.3rem; }

/* CARDS */
.card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:1.5rem; }
.card-sm { padding:1rem 1.25rem; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
.grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
.grid-4 { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.25rem; }

/* STAT CARDS */
.stat-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem 1.5rem; position:relative; overflow:hidden; }
.stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
.stat-card.gold::before { background:linear-gradient(90deg,var(--gold),var(--gold2)); }
.stat-card.teal::before { background:linear-gradient(90deg,var(--teal),#00c4a7); }
.stat-card.blue::before { background:linear-gradient(90deg,var(--accent),#7c3aed); }
.stat-card.red::before { background:linear-gradient(90deg,var(--red),#f97316); }
.stat-label { font-size:.8rem; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.06em; }
.stat-value { font-size:2rem; font-weight:700; color:var(--text); margin:.35rem 0; font-family:'Playfair Display',serif; }
.stat-delta { font-size:.82rem; color:var(--teal); }

/* FORMS */
.form-group { margin-bottom:1.25rem; }
label { display:block; font-size:.83rem; font-weight:600; color:var(--muted); margin-bottom:.5rem; text-transform:uppercase; letter-spacing:.06em; }
input, select, textarea { width:100%; padding:.75rem 1rem; background:var(--surface); border:1px solid var(--border); border-radius:10px; color:var(--text); font-size:.95rem; font-family:inherit; transition:.2s; outline:none; }
input:focus, select:focus, textarea:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(240,165,0,.15); }
select option { background:var(--surface); }
textarea { resize:vertical; min-height:100px; }

/* BUTTONS */
.btn { display:inline-flex; align-items:center; gap:.5rem; padding:.7rem 1.4rem; border-radius:10px; border:none; cursor:pointer; font-size:.9rem; font-weight:600; font-family:inherit; transition:.2s; }
.btn-primary { background:linear-gradient(135deg,var(--gold),#e09000); color:var(--bg); }
.btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(240,165,0,.35); }
.btn-secondary { background:var(--surface); border:1px solid var(--border); color:var(--text); }
.btn-secondary:hover { border-color:var(--gold); color:var(--gold); }
.btn-danger { background:rgba(239,68,68,.15); border:1px solid var(--red); color:var(--red); }
.btn-sm { padding:.45rem .9rem; font-size:.82rem; }
.btn-teal { background:rgba(6,214,160,.15); border:1px solid var(--teal); color:var(--teal); }

/* TABLES */
.table-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-size:.9rem; }
th { padding:.75rem 1rem; text-align:left; font-size:.75rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.07em; border-bottom:1px solid var(--border); }
td { padding:.85rem 1rem; border-bottom:1px solid rgba(30,45,71,.5); color:var(--text); vertical-align:middle; }
tr:hover td { background:rgba(255,255,255,.02); }

/* TAGS */
.tag { display:inline-flex; align-items:center; padding:.25rem .65rem; border-radius:6px; font-size:.75rem; font-weight:700; }
.tag-green { background:rgba(6,214,160,.15); color:var(--teal); }
.tag-yellow { background:rgba(240,165,0,.15); color:var(--gold); }
.tag-red { background:rgba(239,68,68,.15); color:var(--red); }
.tag-blue { background:rgba(59,130,246,.15); color:var(--accent); }
.tag-purple { background:rgba(124,58,237,.15); color:#a78bfa; }

/* EVENT CARDS */
.event-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; transition:.25s; cursor:pointer; }
.event-card:hover { transform:translateY(-3px); border-color:rgba(240,165,0,.4); box-shadow:0 12px 30px rgba(0,0,0,.4); }
.event-thumb { height:150px; display:flex; align-items:center; justify-content:center; font-size:3rem; }
.event-body { padding:1.1rem; }
.event-title { font-weight:700; font-size:1rem; margin-bottom:.4rem; font-family:'Playfair Display',serif; }
.event-meta { font-size:.8rem; color:var(--muted); display:flex; gap:.75rem; flex-wrap:wrap; margin-top:.5rem; }

/* VENDOR CARDS */
.vendor-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; text-align:center; transition:.2s; cursor:pointer; }
.vendor-card:hover { border-color:var(--teal); transform:translateY(-2px); }
.vendor-avatar { width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin:0 auto .75rem; border:2px solid var(--border); }
.vendor-name { font-weight:700; font-size:.95rem; margin-bottom:.25rem; }
.vendor-type { font-size:.8rem; color:var(--muted); margin-bottom:.5rem; }
.stars { color:var(--gold); font-size:.85rem; }

/* MESSAGES */
.msg-wrap { display:flex; gap:1rem; height:500px; }
.msg-list { width:260px; flex-shrink:0; overflow-y:auto; display:flex; flex-direction:column; gap:.5rem; }
.msg-item { padding:.75rem 1rem; border-radius:10px; cursor:pointer; border:1px solid transparent; transition:.2s; }
.msg-item:hover, .msg-item.active { background:rgba(240,165,0,.08); border-color:rgba(240,165,0,.2); }
.msg-item-name { font-weight:600; font-size:.9rem; }
.msg-item-preview { font-size:.78rem; color:var(--muted); margin-top:.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.msg-chat { flex:1; display:flex; flex-direction:column; }
.chat-body { flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:.75rem; }
.bubble { max-width:70%; padding:.65rem 1rem; border-radius:12px; font-size:.9rem; line-height:1.5; }
.bubble.me { background:rgba(240,165,0,.2); border:1px solid rgba(240,165,0,.3); align-self:flex-end; border-bottom-right-radius:3px; }
.bubble.them { background:var(--surface); border:1px solid var(--border); align-self:flex-start; border-bottom-left-radius:3px; }
.chat-input { display:flex; gap:.75rem; padding-top:.75rem; border-top:1px solid var(--border); margin-top:auto; }
.chat-input input { flex:1; }

/* MODAL */
.modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(4px); z-index:500; display:flex; align-items:center; justify-content:center; animation: fadeIn .2s ease; }
.modal { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:2rem; width:90%; max-width:520px; max-height:90vh; overflow-y:auto; animation: slideUp .25s ease; }
.modal-title { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:700; margin-bottom:1.5rem; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }

/* NOTIFS */
.notif-item { display:flex; gap:.75rem; padding:.85rem 1rem; border-bottom:1px solid var(--border); }
.notif-dot { width:8px; height:8px; border-radius:50%; background:var(--gold); flex-shrink:0; margin-top:.35rem; }
.notif-dot.read { background:var(--border); }
.notif-text { font-size:.88rem; }
.notif-time { font-size:.75rem; color:var(--muted); margin-top:.25rem; }

/* AUTH PAGES */
.auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:radial-gradient(ellipse at 50% 0%, #1a2d50 0%, var(--bg) 70%); padding:2rem; }
.auth-box { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:2.5rem; width:100%; max-width:420px; }
.auth-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:900; color:var(--gold); text-align:center; margin-bottom:.5rem; }
.auth-sub { text-align:center; color:var(--muted); font-size:.9rem; margin-bottom:2rem; }
.auth-link { color:var(--gold); cursor:pointer; font-weight:600; }
.auth-link:hover { text-decoration:underline; }
.divider { text-align:center; color:var(--muted); font-size:.85rem; margin:1rem 0; position:relative; }
.divider::before { content:''; position:absolute; top:50%; left:0; right:0; height:1px; background:var(--border); }
.divider span { background:var(--card); position:relative; padding:0 .75rem; }

/* ADMIN */
.progress-bar { background:var(--border); border-radius:999px; height:8px; overflow:hidden; }
.progress-fill { height:100%; border-radius:999px; background:linear-gradient(90deg,var(--gold),var(--gold2)); transition:width .5s; }

/* TICKET */
.ticket { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; display:flex; position:relative; }
.ticket-left { background:linear-gradient(135deg,rgba(240,165,0,.2),rgba(6,214,160,.1)); padding:1.5rem; width:70%; }
.ticket-right { width:30%; border-left:2px dashed var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1rem; font-size:.8rem; color:var(--muted); text-align:center; }
.ticket-code { font-size:1.5rem; font-weight:900; color:var(--gold); letter-spacing:2px; font-family:'Playfair Display',serif; }

/* SEARCH */
.search-bar { display:flex; gap:.75rem; align-items:center; }
.search-bar input { max-width:300px; }

/* SCROLLBAR */
::-webkit-scrollbar { width:5px; height:5px; }
::-webkit-scrollbar-track { background:var(--surface); }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:999px; }

/* EMPTY */
.empty { text-align:center; padding:3rem; color:var(--muted); }
.empty-icon { font-size:3rem; margin-bottom:1rem; }

/* ROLE BADGE */
.role-badge { font-size:.72rem; font-weight:700; padding:.15rem .5rem; border-radius:6px; text-transform:uppercase; letter-spacing:.05em; }

/* TAB */
.tabs { display:flex; gap:.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border); padding-bottom:.75rem; }
.tab { padding:.5rem 1rem; border-radius:8px; cursor:pointer; font-size:.9rem; font-weight:500; color:var(--muted); transition:.2s; }
.tab.active { background:rgba(240,165,0,.1); color:var(--gold); font-weight:600; }

.section-title { font-family:'Playfair Display',serif; font-size:1.2rem; font-weight:700; margin-bottom:1rem; }
.row { display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
.flex-1 { flex:1; }
.mt-1 { margin-top:.5rem; }
.mt-2 { margin-top:1rem; }
.mt-3 { margin-top:1.5rem; }
.mb-2 { margin-bottom:1rem; }
.gap-1 { gap:.5rem; }
.text-muted { color:var(--muted); font-size:.88rem; }
.text-gold { color:var(--gold); }
.text-teal { color:var(--teal); }
.text-red { color:var(--red); }
.fw-7 { font-weight:700; }
`;

// ─── INITIAL DATA ──────────────────────────────────────────────────────────────
const INIT_USERS = [
  { id:1, name:"Alice Johnson", email:"alice@demo.com", password:"alice123", role:"admin", joined:"2024-01-10" },
  { id:2, name:"Bob Kariuki",   email:"bob@demo.com",   password:"bob123",   role:"organizer", joined:"2024-03-22" },
  { id:3, name:"Clara Mwangi",  email:"clara@demo.com", password:"clara123", role:"vendor",    joined:"2024-05-15" },
  { id:4, name:"David Otieno",  email:"david@demo.com", password:"david123", role:"attendee",  joined:"2025-01-03" },
];
const INIT_EVENTS = [
  { id:1, title:"Nairobi Tech Summit 2025", date:"2025-09-14", time:"09:00", location:"KICC, Nairobi", category:"Technology", price:2500, capacity:500, sold:342, status:"active", desc:"Kenya's biggest annual tech summit connecting innovators and investors.", emoji:"💻", organizer:2 },
  { id:2, title:"African Music Festival", date:"2025-10-05", time:"14:00", location:"Uhuru Park, Nairobi", category:"Music", price:1500, capacity:2000, sold:1780, status:"active", desc:"Three-day outdoor festival celebrating African music genres.", emoji:"🎵", organizer:2 },
  { id:3, title:"Wedding Expo 2025", date:"2025-11-22", time:"10:00", location:"Safari Park Hotel", category:"Wedding", price:500, capacity:300, sold:87, status:"active", desc:"Meet top vendors, planners, and get inspiration for your dream wedding.", emoji:"💍", organizer:2 },
  { id:4, title:"Business Leadership Forum", date:"2025-08-30", time:"08:00", location:"Serena Hotel", category:"Business", price:5000, capacity:150, sold:150, status:"sold_out", desc:"Executive forum on strategic leadership for the modern era.", emoji:"🏆", organizer:2 },
];
const INIT_VENDORS = [
  { id:1, name:"Blossom Decor", type:"Decoration", rating:4.8, reviews:124, location:"Nairobi", contact:"blossom@demo.com", bio:"Premium event decoration and floral arrangements.", emoji:"🌸", userId:3 },
  { id:2, name:"Taste of Africa Catering", type:"Catering", rating:4.6, reviews:89, location:"Nairobi", contact:"taste@demo.com", bio:"Authentic African cuisine for all events.", emoji:"🍽️", userId:3 },
  { id:3, name:"LensArt Photography", type:"Photography", rating:4.9, reviews:201, location:"Mombasa", contact:"lensart@demo.com", bio:"Award-winning event and wedding photography.", emoji:"📸", userId:3 },
  { id:4, name:"DJ Pulse Entertainment", type:"Entertainment", rating:4.7, reviews:67, location:"Kisumu", contact:"djpulse@demo.com", bio:"Professional DJ services and live sound systems.", emoji:"🎧", userId:3 },
];
const INIT_TICKETS = [
  { id:1, eventId:1, userId:4, code:"TKT-2025-001A", qty:2, amount:5000, status:"confirmed", date:"2025-07-10" },
  { id:2, eventId:3, userId:4, code:"TKT-2025-002B", qty:1, amount:500,  status:"confirmed", date:"2025-07-12" },
];
const INIT_MSGS = [
  { id:1, from:4, to:3, text:"Hi, are you available for our event on Oct 5?", time:"10:23 AM", date:"Today" },
  { id:2, from:3, to:4, text:"Yes! What type of decoration are you looking for?", time:"10:45 AM", date:"Today" },
  { id:3, from:4, to:3, text:"We need floral arches and table centerpieces.", time:"11:02 AM", date:"Today" },
];
const INIT_NOTIFS = [
  { id:1, text:"Your ticket for Nairobi Tech Summit was confirmed!", time:"2 min ago", read:false },
  { id:2, text:"African Music Festival is almost sold out – only 220 tickets left!", time:"1 hr ago", read:false },
  { id:3, text:"LensArt Photography replied to your message.", time:"3 hrs ago", read:true },
  { id:4, text:"New event: Business Leadership Forum is now live.", time:"Yesterday", read:true },
];
const COLORS_MAP = { Technology:"#3b82f6", Music:"#7c3aed", Wedding:"#ec4899", Business:"#f97316", General:"#06d6a0" };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const genId = (arr) => (arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1);
const fmtPrice = (n) => `KES ${Number(n).toLocaleString()}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"});
const roleColor = (r) => ({ admin:"tag-red", organizer:"tag-gold", vendor:"tag-teal", attendee:"tag-blue" }[r]||"tag-blue");
const roleLabel = (r) => r?.charAt(0).toUpperCase()+r?.slice(1);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase]   = useState("splash"); // splash | auth | app
  const [authMode, setAuth] = useState("login");
  const [page, setPage]     = useState("dashboard");
  const [user, setUser]     = useState(null);

  const [users, setUsers]     = useState(INIT_USERS);
  const [events, setEvents]   = useState(INIT_EVENTS);
  const [vendors, setVendors] = useState(INIT_VENDORS);
  const [tickets, setTickets] = useState(INIT_TICKETS);
  const [msgs, setMsgs]       = useState(INIT_MSGS);
  const [notifs, setNotifs]   = useState(INIT_NOTIFS);

  const db = { users, setUsers, events, setEvents, vendors, setVendors, tickets, setTickets, msgs, setMsgs, notifs, setNotifs };

  // Splash
  useEffect(() => { const t = setTimeout(()=>setPhase("auth"), 3200); return()=>clearTimeout(t); }, []);

  if (phase==="splash") return <Splash />;
  if (phase==="auth")   return <Auth mode={authMode} setMode={setAuth} users={users} setUsers={setUsers} onLogin={(u)=>{setUser(u);setPhase("app");}} />;

  const unread = notifs.filter(n=>!n.read).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Sidebar page={page} setPage={setPage} user={user} onLogout={()=>{setUser(null);setPhase("auth");setAuth("login");}} />
        <main className="main">
          <div className="topbar">
            <div className="page-title">{PAGE_LABELS[page]}</div>
            <div className="topbar-right">
              <div className="notif-btn" onClick={()=>setPage("notifications")}>
                🔔
                {unread>0 && <div className="badge">{unread}</div>}
              </div>
              <div className="avatar" onClick={()=>setPage("profile")}>{user?.name?.[0]}</div>
            </div>
          </div>
          <PageRouter page={page} setPage={setPage} user={user} setUser={setUser} users={users} db={db} />
        </main>
      </div>
    </>
  );
}

const PAGE_LABELS = {
  dashboard:"Dashboard", events:"Event Listings", event_detail:"Event Details",
  create_event:"Create Event", profile:"My Profile", vendors:"Vendor Marketplace",
  vendor_profile:"Vendor Profile", tickets:"My Tickets", messages:"Messages",
  notifications:"Notifications", admin:"Admin Panel", users_admin:"User Management",
};

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div className="splash">
      <div className="splash-logo">🎉 JamSpace</div>
      <div className="splash-sub">Your all-in-one event planning platform</div>
      <div className="splash-bar"><div className="splash-fill" /></div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function Auth({ mode, setMode, users, setUsers, onLogin }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"attendee" });
  const [err, setErr]   = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleLogin = () => {
    const u = users.find(u=>u.email===form.email && u.password===form.password);
    if (!u) { setErr("Invalid email or password."); return; }
    onLogin(u);
  };
  const handleRegister = () => {
    if (!form.name||!form.email||!form.password) { setErr("All fields required."); return; }
    if (users.find(u=>u.email===form.email)) { setErr("Email already registered."); return; }
    const nu = { id:genId(users), ...form, joined: new Date().toISOString().split("T")[0] };
    setUsers(p=>[...p,nu]);
    onLogin(nu);
  };
  const reset = () => { setErr(""); setForm({name:"",email:"",password:"",role:"attendee"}); };

  return (
    <div className="auth-wrap">
      <style>{CSS}</style>
      <div className="auth-box">
        <div className="auth-title">🎉 JamSpace</div>
        <div className="auth-sub">{mode==="login"?"Welcome back! Sign in to continue.":"Create your account to get started."}</div>
        {err && <div className="tag tag-red mb-2" style={{padding:".5rem 1rem",width:"100%",display:"block"}}>{err}</div>}
        {mode==="register" && (
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Jane Doe" value={form.name} onChange={e=>set("name",e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} />
        </div>
        {mode==="register" && (
          <div className="form-group">
            <label>I am a</label>
            <select value={form.role} onChange={e=>set("role",e.target.value)}>
              <option value="attendee">Event Attendee</option>
              <option value="organizer">Event Organizer</option>
              <option value="vendor">Vendor / Supplier</option>
            </select>
          </div>
        )}
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:".85rem"}} onClick={mode==="login"?handleLogin:handleRegister}>
          {mode==="login"?"Sign In →":"Create Account →"}
        </button>
        {mode==="login" && (
          <><div className="divider mt-2"><span>Demo accounts</span></div>
          <div style={{fontSize:".8rem",color:"var(--muted)",lineHeight:1.8}}>
            <b style={{color:"var(--text)"}}>Admin:</b> alice@demo.com / alice123<br/>
            <b style={{color:"var(--text)"}}>Organizer:</b> bob@demo.com / bob123<br/>
            <b style={{color:"var(--text)"}}>Vendor:</b> clara@demo.com / clara123<br/>
            <b style={{color:"var(--text)"}}>Attendee:</b> david@demo.com / david123
          </div></>
        )}
        <div className="text-muted mt-3" style={{textAlign:"center"}}>
          {mode==="login"?"Don't have an account? ":"Already have an account? "}
          <span className="auth-link" onClick={()=>{setMode(mode==="login"?"register":"login");reset();setErr("");}}>
            {mode==="login"?"Register":"Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const nav = (p) => ({ onClick:()=>setPage(p), className:`nav-item${page===p?" active":""}` });
  const isAdmin = user?.role==="admin";
  const isOrg   = user?.role==="organizer"||isAdmin;
  return (
    <div className="sidebar">
      <div className="sidebar-logo">🎉 JamSpace</div>
      <div {...nav("dashboard")}><span className="nav-icon">📊</span>Dashboard</div>
      <div {...nav("events")}><span className="nav-icon">📅</span>Events</div>
      <div {...nav("vendors")}><span className="nav-icon">🛒</span>Marketplace</div>
      <div {...nav("tickets")}><span className="nav-icon">🎟️</span>My Tickets</div>
      <div {...nav("messages")}><span className="nav-icon">💬</span>Messages</div>
      <div {...nav("notifications")}><span className="nav-icon">🔔</span>Notifications</div>
      {isOrg && <><div className="nav-section">Organizer</div>
        <div {...nav("create_event")}><span className="nav-icon">➕</span>Create Event</div></>}
      {isAdmin && <><div className="nav-section">Admin</div>
        <div {...nav("admin")}><span className="nav-icon">⚙️</span>Admin Panel</div>
        <div {...nav("users_admin")}><span className="nav-icon">👥</span>Users</div></>}
      <div style={{marginTop:"auto"}}>
        <div {...nav("profile")}><span className="nav-icon">👤</span>Profile</div>
        <div className="nav-item" onClick={onLogout}><span className="nav-icon">🚪</span>Logout</div>
      </div>
    </div>
  );
}

// ─── PAGE ROUTER ──────────────────────────────────────────────────────────────
function PageRouter({ page, setPage, user, setUser, users, db }) {
  const [selEvent, setSelEvent]   = useState(null);
  const [selVendor, setSelVendor] = useState(null);

  const props = { user, setUser, setPage, db, users };

  if (page==="dashboard")    return <Dashboard {...props} setSelEvent={e=>{setSelEvent(e);setPage("event_detail");}} />;
  if (page==="events")       return <EventListings {...props} setSelEvent={e=>{setSelEvent(e);setPage("event_detail");}} />;
  if (page==="event_detail") return <EventDetail {...props} event={selEvent} />;
  if (page==="create_event") return <CreateEvent {...props} />;
  if (page==="vendors")      return <VendorMarketplace {...props} setSelVendor={v=>{setSelVendor(v);setPage("vendor_profile");}} />;
  if (page==="vendor_profile") return <VendorProfile {...props} vendor={selVendor} />;
  if (page==="tickets")      return <MyTickets {...props} />;
  if (page==="messages")     return <Messages {...props} />;
  if (page==="notifications")return <Notifications {...props} />;
  if (page==="profile")      return <Profile {...props} />;
  if (page==="admin")        return <AdminPanel {...props} />;
  if (page==="users_admin")  return <UsersAdmin {...props} />;
  return <div className="empty"><div className="empty-icon">🚧</div>Page not found</div>;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ db, user, setSelEvent, setPage }) {
  const { events, tickets, vendors, users } = db;
  const myTickets = tickets.filter(t=>t.userId===user.id);
  const totalRev = tickets.reduce((s,t)=>s+Number(t.amount),0);
  const active = events.filter(e=>e.status==="active").length;

  return (
    <div>
      <div className="grid-4 mb-2">
        <div className="stat-card gold"><div className="stat-label">Total Events</div><div className="stat-value">{events.length}</div><div className="stat-delta">↑ {active} active</div></div>
        <div className="stat-card teal"><div className="stat-label">Vendors</div><div className="stat-value">{vendors.length}</div><div className="stat-delta">↑ All verified</div></div>
        <div className="stat-card blue"><div className="stat-label">Users</div><div className="stat-value">{users.length}</div><div className="stat-delta">↑ Growing community</div></div>
        <div className="stat-card red"><div className="stat-label">Revenue</div><div className="stat-value">{(totalRev/1000).toFixed(0)}K</div><div className="stat-delta">KES total</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">🔥 Upcoming Events</div>
          {events.slice(0,3).map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:".75rem",padding:".6rem 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>setSelEvent(e)}>
              <div style={{fontSize:"1.5rem"}}>{e.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".9rem"}}>{e.title}</div>
                <div className="text-muted">{fmtDate(e.date)} · {fmtPrice(e.price)}</div>
              </div>
              <span className={`tag ${e.status==="sold_out"?"tag-red":"tag-green"}`}>{e.status==="sold_out"?"Sold Out":"Active"}</span>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm mt-2" onClick={()=>setPage("events")}>View All Events</button>
        </div>

        <div className="card">
          <div className="section-title">🎟️ My Recent Tickets</div>
          {myTickets.length===0 ? <div className="empty" style={{padding:"1.5rem"}}><div>No tickets yet</div><button className="btn btn-primary btn-sm mt-1" onClick={()=>setPage("events")}>Browse Events</button></div>
          : myTickets.map(t=>{
            const ev = events.find(e=>e.id===t.eventId);
            return (
              <div key={t.id} style={{padding:".6rem 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontWeight:700,fontSize:".9rem"}}>{ev?.title||"Event"}</div>
                <div className="text-muted">{t.code} · {t.qty} ticket(s) · {fmtPrice(t.amount)}</div>
              </div>
            );
          })}
          {myTickets.length>0 && <button className="btn btn-secondary btn-sm mt-2" onClick={()=>setPage("tickets")}>All Tickets</button>}
        </div>
      </div>

      <div className="card mt-3">
        <div className="section-title">📈 Event Capacity Overview</div>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginTop:".5rem"}}>
          {events.map(e=>(
            <div key={e.id}>
              <div className="row mb-2" style={{justifyContent:"space-between"}}>
                <span style={{fontSize:".9rem",fontWeight:600}}>{e.emoji} {e.title}</span>
                <span className="text-muted" style={{fontSize:".82rem"}}>{e.sold}/{e.capacity} sold</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,(e.sold/e.capacity)*100).toFixed(0)}%`}} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EVENT LISTINGS ───────────────────────────────────────────────────────────
function EventListings({ db, user, setSelEvent }) {
  const { events } = db;
  const [search, setSearch] = useState("");
  const [cat, setCat]       = useState("All");
  const cats = ["All","Technology","Music","Wedding","Business"];
  const filtered = events.filter(e=>
    (cat==="All"||e.category===cat) &&
    (e.title.toLowerCase().includes(search.toLowerCase())||e.location.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div>
      <div className="row mb-2" style={{gap:".75rem",flexWrap:"wrap"}}>
        <input style={{maxWidth:280}} placeholder="🔍  Search events or locations…" value={search} onChange={e=>setSearch(e.target.value)} />
        <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
          {cats.map(c=><button key={c} className={`btn btn-sm ${cat===c?"btn-primary":"btn-secondary"}`} onClick={()=>setCat(c)}>{c}</button>)}
        </div>
      </div>
      {filtered.length===0 ? <div className="empty"><div className="empty-icon">🔍</div>No events match your search</div>
      : <div className="grid-4">
          {filtered.map(e=>(
            <div key={e.id} className="event-card" onClick={()=>setSelEvent(e)}>
              <div className="event-thumb" style={{background:`linear-gradient(135deg,${COLORS_MAP[e.category]||"#333"}22,${COLORS_MAP[e.category]||"#666"}44)`}}>{e.emoji}</div>
              <div className="event-body">
                <div className="event-title">{e.title}</div>
                <span className={`tag ${e.status==="sold_out"?"tag-red":"tag-green"}`} style={{fontSize:".7rem"}}>{e.status==="sold_out"?"Sold Out":"Available"}</span>
                <div className="event-meta">
                  <span>📅 {fmtDate(e.date)}</span>
                  <span>📍 {e.location}</span>
                  <span>💰 {fmtPrice(e.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ─── EVENT DETAIL ─────────────────────────────────────────────────────────────
function EventDetail({ event, db, user, setPage }) {
  const [qty, setQty]   = useState(1);
  const [bought, setBought] = useState(false);
  const [msg, setMsg]   = useState("");

  if (!event) return <div className="empty"><div className="empty-icon">📅</div>Select an event to view details</div>;
  const pct = ((event.sold/event.capacity)*100).toFixed(0);
  const avail = event.capacity - event.sold;

  const buyTicket = () => {
    if (event.status==="sold_out"||avail<qty) { setMsg("Not enough tickets available."); return; }
    const t = { id: genId(db.tickets), eventId:event.id, userId:user.id, code:`TKT-${Date.now()}`, qty, amount:qty*event.price, status:"confirmed", date:new Date().toISOString().split("T")[0] };
    db.setTickets(p=>[...p,t]);
    db.setEvents(p=>p.map(e=>e.id===event.id?{...e,sold:e.sold+qty}:e));
    setBought(true); setMsg(`✅ ${qty} ticket(s) purchased! Total: ${fmtPrice(qty*event.price)}`);
    // Notification
    db.setNotifs(p=>[{id:genId(p),text:`Ticket for "${event.title}" confirmed!`,time:"Just now",read:false},...p]);
  };

  return (
    <div>
      <button className="btn btn-secondary btn-sm mb-2" onClick={()=>setPage("events")}>← Back to Events</button>
      <div className="card" style={{marginBottom:"1.25rem"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:"1.5rem",flexWrap:"wrap"}}>
          <div style={{fontSize:"4rem",lineHeight:1}}>{event.emoji}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.7rem",fontWeight:900,marginBottom:".5rem"}}>{event.title}</div>
            <div style={{display:"flex",gap:".75rem",flexWrap:"wrap",marginBottom:".75rem"}}>
              <span className={`tag ${event.status==="sold_out"?"tag-red":"tag-green"}`}>{event.status==="sold_out"?"Sold Out":"Available"}</span>
              <span className="tag tag-blue">{event.category}</span>
            </div>
            <div className="text-muted" style={{lineHeight:1.7}}>{event.desc}</div>
          </div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="section-title">📋 Event Info</div>
          {[["📅 Date",fmtDate(event.date)],["⏰ Time",event.time],["📍 Venue",event.location],["💰 Price",fmtPrice(event.price)],["👥 Capacity",`${event.capacity} attendees`],["🎟️ Sold",`${event.sold} tickets`],["🔢 Available",`${avail} remaining`]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".5rem 0",borderBottom:"1px solid var(--border)",fontSize:".9rem"}}>
              <span className="text-muted">{k}</span><span className="fw-7">{v}</span>
            </div>
          ))}
          <div className="mt-2">
            <div style={{display:"flex",justifyContent:"space-between",fontSize:".82rem",marginBottom:".4rem"}}><span>Capacity</span><span>{pct}% filled</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`}}/></div>
          </div>
        </div>
        <div className="card">
          <div className="section-title">🎟️ Purchase Tickets</div>
          {msg && <div className={`tag ${msg.startsWith("✅")?"tag-green":"tag-red"} mb-2`} style={{padding:".5rem 1rem",display:"block",width:"100%"}}>{msg}</div>}
          {!bought && event.status!=="sold_out" ? (<>
            <div className="form-group">
              <label>Number of Tickets</label>
              <input type="number" min={1} max={Math.min(10,avail)} value={qty} onChange={e=>setQty(Math.max(1,Math.min(10,+e.target.value)))} />
            </div>
            <div style={{padding:"1rem",background:"var(--surface)",borderRadius:10,marginBottom:"1rem"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span className="text-muted">Price/ticket</span><span>{fmtPrice(event.price)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:".5rem"}}><span className="text-muted">Qty</span><span>×{qty}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:".75rem",borderTop:"1px solid var(--border)",paddingTop:".75rem",fontWeight:700}}><span>Total</span><span className="text-gold">{fmtPrice(qty*event.price)}</span></div>
            </div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={buyTicket}>Buy Tickets 🎟️</button>
          </>) : (
            event.status==="sold_out"
              ? <div className="empty"><div className="empty-icon">😔</div>This event is sold out</div>
              : <div className="empty"><div className="empty-icon">✅</div><div>Tickets purchased!</div><button className="btn btn-secondary btn-sm mt-1" onClick={()=>setPage("tickets")}>View My Tickets</button></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CREATE EVENT ─────────────────────────────────────────────────────────────
function CreateEvent({ db, user, setPage }) {
  const emojis = ["💻","🎵","💍","🏆","🎨","🎭","🏃","🍽️","🎓","🌍"];
  const [form, setForm] = useState({ title:"",date:"",time:"",location:"",category:"Technology",price:"",capacity:"",desc:"",emoji:"💻",status:"active" });
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  const save = () => {
    if (!form.title||!form.date||!form.location||!form.price||!form.capacity) return;
    if (editId) {
      db.setEvents(p=>p.map(e=>e.id===editId?{...e,...form,price:+form.price,capacity:+form.capacity}:e));
    } else {
      db.setEvents(p=>[...p,{id:genId(p),...form,price:+form.price,capacity:+form.capacity,sold:0,organizer:user.id}]);
    }
    setSaved(true); setEditId(null); setForm({title:"",date:"",time:"",location:"",category:"Technology",price:"",capacity:"",desc:"",emoji:"💻",status:"active"});
  };
  const startEdit = (e) => { setForm({...e,price:String(e.price),capacity:String(e.capacity)}); setEditId(e.id); setSaved(false); window.scrollTo(0,0); };
  const del = (id) => db.setEvents(p=>p.filter(e=>e.id!==id));

  const myEvents = db.events.filter(e=>e.organizer===user.id||(user.role==="admin"));

  return (
    <div>
      {saved && <div className="tag tag-green mb-2" style={{padding:".5rem 1rem",display:"block"}}>✅ Event {editId?"updated":"created"} successfully!</div>}
      <div className="grid-2">
        <div className="card">
          <div className="section-title">{editId?"✏️ Edit Event":"➕ New Event"}</div>
          <div className="form-group"><label>Event Title</label><input placeholder="Nairobi Tech Summit 2026" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
          <div className="grid-2">
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e=>set("date",e.target.value)}/></div>
            <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={e=>set("time",e.target.value)}/></div>
          </div>
          <div className="form-group"><label>Location / Venue</label><input placeholder="KICC, Nairobi" value={form.location} onChange={e=>set("location",e.target.value)}/></div>
          <div className="grid-2">
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e=>set("category",e.target.value)}>{["Technology","Music","Wedding","Business","General"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={e=>set("status",e.target.value)}><option value="active">Active</option><option value="draft">Draft</option><option value="cancelled">Cancelled</option></select></div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label>Ticket Price (KES)</label><input type="number" placeholder="2500" value={form.price} onChange={e=>set("price",e.target.value)}/></div>
            <div className="form-group"><label>Capacity</label><input type="number" placeholder="500" value={form.capacity} onChange={e=>set("capacity",e.target.value)}/></div>
          </div>
          <div className="form-group"><label>Description</label><textarea placeholder="Tell attendees about this event…" value={form.desc} onChange={e=>set("desc",e.target.value)}/></div>
          <div className="form-group"><label>Emoji Icon</label>
            <div style={{display:"flex",gap:".5rem",flexWrap:"wrap"}}>
              {emojis.map(em=><button key={em} onClick={()=>set("emoji",em)} style={{fontSize:"1.4rem",padding:".35rem .5rem",borderRadius:8,border:`2px solid ${form.emoji===em?"var(--gold)":"var(--border)"}`,background:"var(--surface)",cursor:"pointer"}}>{em}</button>)}
            </div>
          </div>
          <div style={{display:"flex",gap:".75rem"}}>
            <button className="btn btn-primary" onClick={save}>{editId?"Update Event":"Create Event"}</button>
            {editId && <button className="btn btn-secondary" onClick={()=>{setEditId(null);setForm({title:"",date:"",time:"",location:"",category:"Technology",price:"",capacity:"",desc:"",emoji:"💻",status:"active"});}}>Cancel</button>}
          </div>
        </div>

        <div className="card">
          <div className="section-title">📋 My Events ({myEvents.length})</div>
          {myEvents.length===0 ? <div className="empty"><div className="empty-icon">📭</div>No events yet</div>
          : myEvents.map(e=>(
            <div key={e.id} style={{padding:".85rem",background:"var(--surface)",borderRadius:10,marginBottom:".75rem",border:"1px solid var(--border)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:700}}>{e.emoji} {e.title}</div>
                  <div className="text-muted" style={{fontSize:".8rem"}}>{fmtDate(e.date)} · {fmtPrice(e.price)} · {e.sold}/{e.capacity} sold</div>
                </div>
                <span className={`tag ${e.status==="active"?"tag-green":e.status==="sold_out"?"tag-red":"tag-yellow"}`}>{e.status}</span>
              </div>
              <div style={{display:"flex",gap:".5rem",marginTop:".75rem"}}>
                <button className="btn btn-sm btn-secondary" onClick={()=>startEdit(e)}>✏️ Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>del(e.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── VENDOR MARKETPLACE ───────────────────────────────────────────────────────
function VendorMarketplace({ db, user, setSelVendor, setPage }) {
  const { vendors } = db;
  const [search, setSearch] = useState("");
  const [type, setType]     = useState("All");
  const types = ["All","Decoration","Catering","Photography","Entertainment"];
  const filtered = vendors.filter(v=>
    (type==="All"||v.type===type) &&
    (v.name.toLowerCase().includes(search.toLowerCase())||v.location.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div>
      <div className="row mb-2" style={{flexWrap:"wrap",gap:".75rem"}}>
        <input style={{maxWidth:260}} placeholder="🔍  Search vendors…" value={search} onChange={e=>setSearch(e.target.value)} />
        <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
          {types.map(t=><button key={t} className={`btn btn-sm ${type===t?"btn-primary":"btn-secondary"}`} onClick={()=>setType(t)}>{t}</button>)}
        </div>
      </div>
      <div className="grid-4">
        {filtered.map(v=>(
          <div key={v.id} className="vendor-card" onClick={()=>setSelVendor(v)}>
            <div className="vendor-avatar" style={{background:`rgba(6,214,160,.15)`}}>{v.emoji}</div>
            <div className="vendor-name">{v.name}</div>
            <div className="vendor-type">{v.type} · {v.location}</div>
            <div className="stars">{"★".repeat(Math.round(v.rating))}{"☆".repeat(5-Math.round(v.rating))} <span style={{color:"var(--muted)",fontWeight:400}}>{v.rating} ({v.reviews})</span></div>
            <button className="btn btn-sm btn-teal mt-2" onClick={e=>{e.stopPropagation();setSelVendor(v);setPage("vendor_profile");}}>View Profile</button>
          </div>
        ))}
      </div>
      {(user.role==="vendor"||user.role==="admin") && (
        <div className="card mt-3">
          <div className="section-title">➕ Register as Vendor</div>
          <AddVendorForm db={db} user={user} />
        </div>
      )}
    </div>
  );
}

function AddVendorForm({ db, user }) {
  const [form, setForm] = useState({ name:"", type:"Catering", location:"", bio:"", contact:"", emoji:"🍽️" });
  const [done, setDone] = useState(false);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));
  const save = () => {
    if (!form.name||!form.location) return;
    db.setVendors(p=>[...p,{id:genId(p),...form,rating:5.0,reviews:0,userId:user.id}]);
    setDone(true);
  };
  if (done) return <div className="tag tag-green" style={{padding:".5rem 1rem"}}>✅ Vendor profile created!</div>;
  return (
    <div className="grid-2">
      <div>
        <div className="form-group"><label>Business Name</label><input placeholder="My Catering Co." value={form.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="form-group"><label>Type</label><select value={form.type} onChange={e=>set("type",e.target.value)}>{["Catering","Decoration","Photography","Entertainment","Other"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="form-group"><label>Location</label><input placeholder="Nairobi" value={form.location} onChange={e=>set("location",e.target.value)}/></div>
      </div>
      <div>
        <div className="form-group"><label>Contact Email</label><input placeholder="info@business.com" value={form.contact} onChange={e=>set("contact",e.target.value)}/></div>
        <div className="form-group"><label>Bio</label><textarea placeholder="Tell clients about your services…" value={form.bio} onChange={e=>set("bio",e.target.value)} style={{minHeight:80}}/></div>
        <button className="btn btn-primary" onClick={save}>Register Vendor</button>
      </div>
    </div>
  );
}

// ─── VENDOR PROFILE ───────────────────────────────────────────────────────────
function VendorProfile({ vendor, db, user, setPage }) {
  const [msg, setMsg] = useState("");
  if (!vendor) return <div className="empty"><div className="empty-icon">🛒</div>Select a vendor</div>;

  const sendMsg = () => {
    if (!msg.trim()) return;
    const vUser = db.users.find(u=>u.id===vendor.userId);
    if (!vUser) return;
    db.setMsgs(p=>[...p,{id:genId(p),from:user.id,to:vendor.userId,text:msg,time:new Date().toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit"}),date:"Today"}]);
    db.setNotifs(p=>[{id:genId(p),text:`New message from ${user.name}`,time:"Just now",read:false},...p]);
    setMsg("✅ Message sent!");
    setTimeout(()=>setMsg(""),2000);
  };

  return (
    <div>
      <button className="btn btn-secondary btn-sm mb-2" onClick={()=>setPage("vendors")}>← Back</button>
      <div className="card mb-2">
        <div style={{display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(6,214,160,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",border:"2px solid var(--teal)"}}>{vendor.emoji}</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700}}>{vendor.name}</div>
            <div className="text-muted">{vendor.type} · {vendor.location}</div>
            <div className="stars mt-1">{"★".repeat(Math.round(vendor.rating))}{"☆".repeat(5-Math.round(vendor.rating))} {vendor.rating} ({vendor.reviews} reviews)</div>
          </div>
        </div>
        <div className="mt-2 text-muted">{vendor.bio}</div>
        <div className="mt-2" style={{fontSize:".88rem"}}>📧 {vendor.contact}</div>
      </div>
      <div className="card">
        <div className="section-title">💬 Contact Vendor</div>
        <textarea placeholder="Type your message here…" value={typeof msg==="string"&&!msg.startsWith("✅")?msg:""} onChange={e=>setMsg(e.target.value)} style={{marginBottom:"1rem"}}/>
        {msg.startsWith("✅") && <div className="tag tag-green mb-2" style={{padding:".4rem .8rem",display:"inline-block"}}>{msg}</div>}
        <button className="btn btn-primary" onClick={sendMsg}>Send Message 📨</button>
      </div>
    </div>
  );
}

// ─── MY TICKETS ───────────────────────────────────────────────────────────────
function MyTickets({ db, user }) {
  const mine = db.tickets.filter(t=>t.userId===user.id);
  if (mine.length===0) return <div className="empty"><div className="empty-icon">🎟️</div><div>No tickets yet.</div><div className="text-muted mt-1">Browse events and purchase your first ticket!</div></div>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
      {mine.map(t=>{
        const ev = db.events.find(e=>e.id===t.eventId);
        return (
          <div key={t.id} className="ticket">
            <div className="ticket-left">
              <div style={{fontSize:"1.75rem",marginBottom:".5rem"}}>{ev?.emoji||"🎟️"}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:700,marginBottom:".25rem"}}>{ev?.title||"Event"}</div>
              <div className="text-muted" style={{fontSize:".85rem",marginBottom:".75rem"}}>
                📅 {ev?fmtDate(ev.date):"--"} &nbsp;⏰ {ev?.time||"--"} &nbsp;📍 {ev?.location||"--"}
              </div>
              <div style={{display:"flex",gap:".75rem",flexWrap:"wrap"}}>
                <span className="tag tag-green">{t.qty} Ticket(s)</span>
                <span className="tag tag-blue">Total: {fmtPrice(t.amount)}</span>
                <span className={`tag ${t.status==="confirmed"?"tag-teal":"tag-yellow"}`}>{t.status}</span>
              </div>
            </div>
            <div className="ticket-right">
              <div className="ticket-code">{t.code.slice(-6)}</div>
              <div style={{marginTop:".5rem"}}>Ticket ID</div>
              <div style={{marginTop:".25rem",fontSize:".7rem"}}>{t.date}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
function Messages({ db, user }) {
  const { msgs, setMsgs, users } = db;
  const contacts = [...new Set(msgs.filter(m=>m.from===user.id||m.to===user.id).map(m=>m.from===user.id?m.to:m.from))];
  const [active, setActive] = useState(contacts[0]||null);
  const [text, setText] = useState("");
  const chatRef = useRef();

  const thread = msgs.filter(m=>(m.from===user.id&&m.to===active)||(m.from===active&&m.to===user.id));

  const send = () => {
    if (!text.trim()||!active) return;
    setMsgs(p=>[...p,{id:genId(p),from:user.id,to:active,text:text.trim(),time:new Date().toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit"}),date:"Today"}]);
    setText("");
    setTimeout(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },50);
  };

  return (
    <div className="card" style={{padding:0}}>
      <div className="msg-wrap" style={{padding:"1rem"}}>
        <div className="msg-list">
          {contacts.map(cid=>{
            const cu = users.find(u=>u.id===cid);
            const last = [...msgs].reverse().find(m=>(m.from===user.id&&m.to===cid)||(m.from===cid&&m.to===user.id));
            return (
              <div key={cid} className={`msg-item${active===cid?" active":""}`} onClick={()=>setActive(cid)}>
                <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
                  <div className="avatar" style={{width:34,height:34,fontSize:".8rem"}}>{cu?.name?.[0]||"?"}</div>
                  <div style={{flex:1,overflow:"hidden"}}>
                    <div className="msg-item-name">{cu?.name||"Unknown"}</div>
                    <div className="msg-item-preview">{last?.text||"No messages"}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {contacts.length===0 && <div className="text-muted" style={{padding:"1rem",fontSize:".85rem"}}>No conversations yet. Contact a vendor to start!</div>}
        </div>
        <div className="msg-chat">
          {active ? (
            <>
              <div style={{padding:".75rem",borderBottom:"1px solid var(--border)",fontWeight:700,fontSize:".95rem"}}>
                {users.find(u=>u.id===active)?.name||"Contact"}
              </div>
              <div className="chat-body" ref={chatRef}>
                {thread.map(m=>(
                  <div key={m.id} className={`bubble ${m.from===user.id?"me":"them"}`}>
                    {m.text}
                    <div style={{fontSize:".7rem",color:"var(--muted)",marginTop:".3rem",textAlign:"right"}}>{m.time}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input placeholder="Type a message…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
                <button className="btn btn-primary btn-sm" onClick={send}>Send</button>
              </div>
            </>
          ) : <div className="empty">Select a conversation</div>}
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function Notifications({ db }) {
  const { notifs, setNotifs } = db;
  const markAll = () => setNotifs(p=>p.map(n=>({...n,read:true})));
  return (
    <div className="card" style={{padding:0}}>
      <div style={{padding:"1rem 1.25rem",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span className="section-title" style={{margin:0}}>All Notifications</span>
        <button className="btn btn-sm btn-secondary" onClick={markAll}>Mark all read</button>
      </div>
      {notifs.length===0 ? <div className="empty"><div className="empty-icon">🔔</div>No notifications</div>
      : notifs.map(n=>(
        <div key={n.id} className="notif-item" onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))} style={{cursor:"pointer"}}>
          <div className={`notif-dot ${n.read?"read":""}`}/>
          <div>
            <div className="notif-text" style={{fontWeight:n.read?400:600}}>{n.text}</div>
            <div className="notif-time">{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ user, setUser, db }) {
  const [form, setForm] = useState({ name:user.name, email:user.email });
  const [saved, setSaved] = useState(false);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));
  const save = () => {
    db.setUsers(p=>p.map(u=>u.id===user.id?{...u,...form}:u));
    setUser(u=>({...u,...form}));
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  };

  const myTickets = db.tickets.filter(t=>t.userId===user.id);
  const myMsgs    = db.msgs.filter(m=>m.from===user.id||m.to===user.id);

  return (
    <div className="grid-2">
      <div>
        <div className="card mb-2">
          <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
            <div className="avatar" style={{width:64,height:64,fontSize:"1.5rem"}}>{user.name[0]}</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700}}>{user.name}</div>
              <span className={`tag ${roleColor(user.role)}`}>{roleLabel(user.role)}</span>
            </div>
          </div>
          {saved && <div className="tag tag-green mb-2" style={{padding:".4rem .8rem",display:"block"}}>✅ Profile updated!</div>}
          <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="form-group"><label>Email Address</label><input value={form.email} onChange={e=>set("email",e.target.value)}/></div>
          <div className="form-group"><label>Role</label><input value={roleLabel(user.role)} readOnly style={{opacity:.6,cursor:"not-allowed"}}/></div>
          <div className="form-group"><label>Member Since</label><input value={fmtDate(user.joined)} readOnly style={{opacity:.6,cursor:"not-allowed"}}/></div>
          <button className="btn btn-primary" onClick={save}>Save Changes</button>
        </div>
      </div>
      <div>
        <div className="card mb-2">
          <div className="section-title">📊 My Stats</div>
          {[["🎟️ Tickets Purchased",myTickets.length],["💬 Messages Sent",db.msgs.filter(m=>m.from===user.id).length],["📅 Events Joined",myTickets.length]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:".5rem 0",borderBottom:"1px solid var(--border)"}}>
              <span className="text-muted">{k}</span><span className="fw-7 text-gold">{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-title">🔐 Change Password</div>
          <div className="form-group"><label>Current Password</label><input type="password" placeholder="••••••••"/></div>
          <div className="form-group"><label>New Password</label><input type="password" placeholder="••••••••"/></div>
          <div className="form-group"><label>Confirm New Password</label><input type="password" placeholder="••••••••"/></div>
          <button className="btn btn-secondary">Update Password</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ db }) {
  const { events, tickets, users, vendors } = db;
  const totalRev = tickets.reduce((s,t)=>s+Number(t.amount),0);
  const catStats = events.reduce((acc,e)=>{ acc[e.category]=(acc[e.category]||0)+1; return acc; },{});

  return (
    <div>
      <div className="grid-4 mb-2">
        <div className="stat-card gold"><div className="stat-label">Total Revenue</div><div className="stat-value">{(totalRev/1000).toFixed(0)}K</div><div className="stat-delta">KES {totalRev.toLocaleString()}</div></div>
        <div className="stat-card teal"><div className="stat-label">Tickets Sold</div><div className="stat-value">{tickets.length}</div><div className="stat-delta">All confirmed</div></div>
        <div className="stat-card blue"><div className="stat-label">Total Users</div><div className="stat-value">{users.length}</div><div className="stat-delta">Across all roles</div></div>
        <div className="stat-card red"><div className="stat-label">Active Events</div><div className="stat-value">{events.filter(e=>e.status==="active").length}</div><div className="stat-delta">of {events.length} total</div></div>
      </div>

      <div className="grid-2 mb-2">
        <div className="card">
          <div className="section-title">📦 Events by Category</div>
          {Object.entries(catStats).map(([cat,count])=>(
            <div key={cat} style={{marginBottom:"1rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:".4rem",fontSize:".88rem"}}>
                <span>{cat}</span><span className="text-gold fw-7">{count}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${(count/events.length)*100}%`,background:COLORS_MAP[cat]||"var(--gold)"}}/></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-title">💰 Revenue by Event</div>
          {events.map(e=>{
            const rev = tickets.filter(t=>t.eventId===e.id).reduce((s,t)=>s+Number(t.amount),0);
            return (
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:".5rem 0",borderBottom:"1px solid var(--border)",fontSize:".88rem"}}>
                <span>{e.emoji} {e.title.substring(0,25)}…</span>
                <span className="text-gold fw-7">{fmtPrice(rev)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="section-title">🎟️ All Tickets</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Code</th><th>Event</th><th>User</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {tickets.map(t=>{
                const ev = events.find(e=>e.id===t.eventId);
                const u  = users.find(u=>u.id===t.userId);
                return (
                  <tr key={t.id}>
                    <td><code style={{fontSize:".78rem",color:"var(--gold)"}}>{t.code}</code></td>
                    <td>{ev?.emoji} {ev?.title||"--"}</td>
                    <td>{u?.name||"--"}</td>
                    <td>{t.qty}</td>
                    <td className="text-gold">{fmtPrice(t.amount)}</td>
                    <td className="text-muted">{t.date}</td>
                    <td><span className={`tag ${t.status==="confirmed"?"tag-green":"tag-yellow"}`}>{t.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── USERS ADMIN ──────────────────────────────────────────────────────────────
function UsersAdmin({ db }) {
  const { users, setUsers } = db;
  const [search, setSearch] = useState("");
  const roles = ["attendee","organizer","vendor","admin"];
  const filtered = users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));
  const del = (id) => { if(users.length<=1) return; setUsers(p=>p.filter(u=>u.id!==id)); };
  const changeRole = (id, role) => setUsers(p=>p.map(u=>u.id===id?{...u,role}:u));

  return (
    <div className="card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:".75rem"}}>
        <div className="section-title" style={{margin:0}}>Users ({filtered.length})</div>
        <input style={{maxWidth:260}} placeholder="🔍  Search users…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id}>
                <td className="text-muted">{u.id}</td>
                <td><div style={{display:"flex",alignItems:"center",gap:".6rem"}}><div className="avatar" style={{width:30,height:30,fontSize:".75rem"}}>{u.name[0]}</div>{u.name}</div></td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)} style={{padding:".3rem .6rem",fontSize:".82rem",width:"auto",border:"1px solid var(--border)",borderRadius:6,background:"var(--surface)",color:"var(--text)"}}>
                    {roles.map(r=><option key={r} value={r}>{roleLabel(r)}</option>)}
                  </select>
                </td>
                <td className="text-muted">{fmtDate(u.joined)}</td>
                <td><button className="btn btn-sm btn-danger" onClick={()=>del(u.id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
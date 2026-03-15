import { useState } from "react";
import { useVisitors } from "../context/VisitorContext";
import StatusBadge from "../components/StatusBadge";
import QRCode from "../components/QRCode";
import VisitorBadge from "../components/VisitorBadge";
import "./Forms.css";

export default function VisitorLog({ setPage }) {
  const { visitors } = useVisitors();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [badgeVisitor, setBadgeVisitor] = useState(null);

  const filtered = visitors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase()) || v.phone.includes(search) || v.hostName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const fmt = (t) => t ? new Date(t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div className="form-page">
      <div className="page-header">
        <div><h1 className="page-title">Visitor Log</h1><p className="page-sub">Complete record — {filtered.length} records</p></div>
        <button className="btn-primary" onClick={() => setPage("register")}>+ Register Visitor</button>
      </div>
      <div className="filter-bar">
        <input type="text" className="search-input" placeholder="🔍  Search by name, ID, phone or host..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {[["all", "All"], ["pre-registered", "Pre-Reg"], ["checked-in", "Inside"], ["checked-out", "Exited"]].map(([val, label]) => (
            <button key={val} className={`filter-tab ${filterStatus === val ? "active" : ""}`} onClick={() => setFilterStatus(val)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="log-layout">
        <div className="table-wrapper">
          <table className="visitor-table">
            <thead><tr><th>ID</th><th>Visitor</th><th>Purpose</th><th>Host</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No visitors found</td></tr>
              ) : filtered.map(v => (
                <tr key={v.id} className={selected?.id === v.id ? "selected-row" : ""} onClick={() => setSelected(v === selected ? null : v)} style={{ cursor: "pointer" }}>
                  <td><code>{v.id}</code></td>
                  <td><div className="visitor-name">{v.name}</div><div className="visitor-phone">{v.phone}</div></td>
                  <td>{v.purpose}</td>
                  <td><div>{v.hostName}</div><div className="visitor-phone">{v.hostDept}</div></td>
                  <td>{fmt(v.checkInTime)}</td>
                  <td>{fmt(v.checkOutTime)}</td>
                  <td><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && (
          <div className="detail-panel">
            <div className="detail-header"><h3>Visitor Details</h3><button className="close-btn" onClick={() => setSelected(null)}>✕</button></div>
            <div className="detail-avatar">{selected.name[0]}</div>
            <div className="detail-name">{selected.name}</div>
            <div style={{ textAlign: "center", marginBottom: "8px" }}><StatusBadge status={selected.status} /></div>
            <div className="detail-qr"><QRCode value={selected.id} size={120} /></div>
            <div className="detail-id">ID: {selected.id}</div>
            <div className="detail-rows">
              {[["📱 Phone", selected.phone], ["📧 Email", selected.email || "—"], ["🏢 Company", selected.company || "—"], ["🎯 Purpose", selected.purpose], ["👤 Host", selected.hostName], ["🏛 Dept", selected.hostDept], ["🪪 ID Type", selected.idType], ["📅 Date", selected.date], ["⬇ Check In", fmt(selected.checkInTime)], ["⬆ Check Out", fmt(selected.checkOutTime)]].map(([k, v]) => (
                <div className="detail-row" key={k}><span className="detail-key">{k}</span><span className="detail-val">{v}</span></div>
              ))}
              {selected.notes && <div className="detail-notes">📝 {selected.notes}</div>}
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: "12px" }} onClick={() => setBadgeVisitor(selected)}>🪪 Print Visitor Badge</button>
          </div>
        )}
      </div>
      {badgeVisitor && <VisitorBadge visitor={badgeVisitor} onClose={() => setBadgeVisitor(null)} />}
    </div>
  );
}
import { useState } from "react";
import { useVisitors } from "../context/VisitorContext";
import StatusBadge from "../components/StatusBadge";
import QRScanner from "../components/QRScanner";
import { useToast } from "../components/Toast";
import "./Forms.css";

export default function CheckOut({ setPage }) {
  const { visitors, getVisitorById, checkOut } = useVisitors();
  const { addToast } = useToast();
  const [inputId, setInputId] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const checkedInVisitors = visitors.filter(v => v.status === "checked-in");

  const search = (id) => {
    const cleanId = (id || inputId).trim().toUpperCase();
    if (!cleanId) { setError("Please enter a Visitor ID"); return; }
    const v = getVisitorById(cleanId);
    if (!v) { setError("No visitor found with ID: " + cleanId); setVisitor(null); return; }
    setError(""); setVisitor(v);
  };

  const handleScan = (scannedId) => {
    setShowScanner(false);
    setInputId(scannedId);
    const v = getVisitorById(scannedId);
    if (!v) {
      setError('QR scanned: "' + scannedId + '" — No visitor found');
      setVisitor(null);
      addToast("QR scanned but visitor not found", "error");
    } else {
      setError(""); setVisitor(v);
      addToast("QR scanned: " + v.name, "info");
    }
  };

  const handleCheckOut = () => {
    checkOut(visitor.id);
    addToast(visitor.name + " checked out successfully!", "warning");
    setDone(true);
  };

  const duration = () => {
    if (!visitor?.checkInTime) return "N/A";
    const diff = (new Date() - new Date(visitor.checkInTime)) / 60000;
    const h = Math.floor(diff / 60), m = Math.floor(diff % 60);
    return h > 0 ? h + "h " + m + "m" : m + "m";
  };

  if (done) {
    return (
      <div className="form-page">
        <div className="success-card">
          <div className="success-icon">👋</div>
          <h2>Check-Out Successful!</h2>
          <p className="success-sub"><strong>{visitor.name}</strong> has checked out</p>
          <div className="info-box">
            <div className="info-row"><span>Visitor ID:</span> <strong>{visitor.id}</strong></div>
            <div className="info-row"><span>Check-In:</span> {new Date(visitor.checkInTime).toLocaleTimeString("en-IN")}</div>
            <div className="info-row"><span>Check-Out:</span> <strong>{new Date().toLocaleTimeString("en-IN")}</strong></div>
            <div className="info-row"><span>Duration:</span> {duration()}</div>
            <div className="info-row"><span>Host:</span> {visitor.hostName}</div>
          </div>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => { setInputId(""); setVisitor(null); setDone(false); }}>Check Out Another</button>
            <button className="btn-secondary" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
      <div className="page-header">
        <div>
          <h1 className="page-title">Visitor Check-Out</h1>
          <p className="page-sub">Scan QR code or select from active visitors</p>
        </div>
      </div>
      <div className="checkin-layout">
        <div className="active-visitors">
          <div className="active-visitors-header">
            <h3>Currently Inside ({checkedInVisitors.length})</h3>
            <button className="btn-scan-small" onClick={() => setShowScanner(true)}>📷 Scan QR</button>
          </div>
          {checkedInVisitors.length === 0 ? (
            <div className="empty-state">No visitors currently inside</div>
          ) : (
            checkedInVisitors.map(v => (
              <div
                key={v.id}
                className={"active-card " + (visitor?.id === v.id ? "selected" : "")}
                onClick={() => { setVisitor(v); setInputId(v.id); setError(""); }}
              >
                <div className="visitor-avatar">{v.name[0]}</div>
                <div className="active-info">
                  <div className="active-name">{v.name}</div>
                  <div className="active-meta">{v.purpose} · {v.hostDept}</div>
                  <div className="active-time">
                    In: {new Date(v.checkInTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="active-badge">↑</div>
              </div>
            ))
          )}
        </div>
        <div className="manual-entry">
          <h3>Search by ID or Scan</h3>
          <div className="search-row">
            <input
              type="text"
              value={inputId}
              onChange={e => setInputId(e.target.value.toUpperCase())}
              placeholder="Enter Visitor ID"
              onKeyDown={e => e.key === "Enter" && search()}
            />
            <button className="btn-primary" onClick={() => search()}>Search</button>
          </div>
          {error && <div className="error-msg">{error}</div>}
          {visitor && (
            <div className="visitor-card">
              <div className="visitor-card-header">
                <div className="visitor-avatar">{visitor.name[0]}</div>
                <div>
                  <div className="visitor-card-name">{visitor.name}</div>
                  <div className="visitor-card-phone">{visitor.phone}</div>
                </div>
                <StatusBadge status={visitor.status} />
              </div>
              <div className="visitor-card-body">
                <div className="info-row"><span>Visitor ID:</span> {visitor.id}</div>
                <div className="info-row"><span>Purpose:</span> {visitor.purpose}</div>
                <div className="info-row"><span>Host:</span> {visitor.hostName}</div>
                <div className="info-row"><span>Department:</span> {visitor.hostDept}</div>
                {visitor.checkInTime && (
                  <div className="info-row"><span>Checked In At:</span> {new Date(visitor.checkInTime).toLocaleTimeString("en-IN")}</div>
                )}
                {visitor.status === "checked-in" && (
                  <div className="info-row"><span>Duration:</span> {duration()}</div>
                )}
              </div>
              {visitor.status !== "checked-in" && (
                <div className="already-msg">⚠️ This visitor is not currently checked in</div>
              )}
              {visitor.status === "checked-in" && (
                <button className="btn-checkout" onClick={handleCheckOut}>↑ Confirm Check-Out</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
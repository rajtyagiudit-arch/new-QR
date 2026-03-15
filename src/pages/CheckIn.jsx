import { useState } from "react";
import { useVisitors } from "../context/VisitorContext";
import QRCode from "../components/QRCode";
import StatusBadge from "../components/StatusBadge";
import QRScanner from "../components/QRScanner";
import { useToast } from "../components/Toast";
import "./Forms.css";

export default function CheckIn({ setPage }) {
  const { getVisitorById, checkIn } = useVisitors();
  const { addToast } = useToast();
  const [inputId, setInputId] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

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

  const handleCheckIn = () => {
    checkIn(visitor.id);
    addToast(visitor.name + " checked in successfully!", "success");
    setDone(true);
  };

  const reset = () => { setInputId(""); setVisitor(null); setError(""); setDone(false); };

  if (done) {
    return (
      <div className="form-page">
        <div className="success-card">
          <div className="success-icon">🟢</div>
          <h2>Check-In Successful!</h2>
          <p className="success-sub"><strong>{visitor.name}</strong> has been checked in</p>
          <div className="info-box">
            <div className="info-row"><span>Visitor ID:</span> <strong>{visitor.id}</strong></div>
            <div className="info-row"><span>Check-In Time:</span> <strong>{new Date().toLocaleTimeString("en-IN")}</strong></div>
            <div className="info-row"><span>Host:</span> {visitor.hostName} — {visitor.hostDept}</div>
            <div className="info-row"><span>Purpose:</span> {visitor.purpose}</div>
          </div>
          <div className="success-actions">
            <button className="btn-primary" onClick={reset}>Check In Another</button>
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
          <h1 className="page-title">Visitor Check-In</h1>
          <p className="page-sub">Scan QR code with camera or enter visitor ID manually</p>
        </div>
      </div>
      <div className="checkin-layout">
        <div className="scanner-box">
          <div className="qr-scanner-preview" onClick={() => setShowScanner(true)}>
            <div className="scanner-preview-icon">📷</div>
            <div className="scanner-preview-title">Camera QR Scanner</div>
            <div className="scanner-preview-sub">Click to open camera and scan visitor's QR pass</div>
            <div className="scanner-preview-corners">
              <div className="pc tl"/><div className="pc tr"/>
              <div className="pc bl"/><div className="pc br"/>
            </div>
          </div>
          <button className="btn-scan" onClick={() => setShowScanner(true)}>
            📷 Open Camera Scanner
          </button>
          <div className="scanner-options">
            <div className="scanner-option">
              <span className="option-icon">💻</span>
              <div><div className="option-title">Laptop Camera</div><div className="option-desc">Uses your built-in webcam</div></div>
            </div>
            <div className="scanner-option">
              <span className="option-icon">📱</span>
              <div><div className="option-title">Mobile Camera</div><div className="option-desc">Open app on phone browser</div></div>
            </div>
          </div>
        </div>
        <div className="manual-entry">
          <h3>Or Enter Visitor ID Manually</h3>
          <div className="search-row">
            <input
              type="text"
              value={inputId}
              onChange={e => setInputId(e.target.value.toUpperCase())}
              placeholder="e.g. VIS001, VIS002"
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
                {visitor.company && <div className="info-row"><span>Company:</span> {visitor.company}</div>}
              </div>
              <div className="qr-mini"><QRCode value={visitor.id} size={100} /></div>
              {visitor.status === "checked-in"  && <div className="already-msg">⚠️ This visitor is already checked in</div>}
              {visitor.status === "checked-out" && <div className="already-msg">ℹ️ This visitor has already checked out</div>}
              {visitor.status === "pre-registered" && (
                <button className="btn-checkin" onClick={handleCheckIn}>✅ Confirm Check-In</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
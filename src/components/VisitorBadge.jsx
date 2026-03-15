import QRCode from "./QRCode";
import "./Badge.css";

export default function VisitorBadge({ visitor, onClose }) {
  if (!visitor) return null;
  return (
    <div className="badge-overlay">
      <div className="badge-modal">
        <div className="badge-actions no-print">
          <button className="btn-print" onClick={() => window.print()}>🖨️ Print Badge</button>
          <button className="btn-close-badge" onClick={onClose}>✕ Close</button>
        </div>
        <div className="badge-card">
          <div className="badge-header">
            <div className="badge-org-logo">▦</div>
            <div className="badge-org-info">
              <div className="badge-org-name">TechCorp India Pvt. Ltd.</div>
              <div className="badge-org-addr">Plot 14, Sector 63, Noida, UP — 201301</div>
            </div>
            <div className="badge-type">VISITOR PASS</div>
          </div>
          <div className="badge-body">
            <div className="badge-left">
              <div className="badge-avatar">{visitor.name[0]}</div>
              <div className="badge-name">{visitor.name}</div>
              {visitor.company && <div className="badge-company">{visitor.company}</div>}
              <div className="badge-id-tag">{visitor.id}</div>
            </div>
            <div className="badge-right">
              <QRCode value={visitor.id} size={120} />
              <div className="badge-qr-label">Scan for entry/exit</div>
            </div>
          </div>
          <div className="badge-details">
            {[["Purpose", visitor.purpose], ["Host", visitor.hostName], ["Department", visitor.hostDept], ["Phone", visitor.phone], ["Date", new Date(visitor.date).toLocaleDateString("en-IN")], [visitor.idType, visitor.idNumber]].map(([k, v]) => v && (
              <div className="badge-detail-row" key={k}>
                <span className="bd-label">{k}</span>
                <span className="bd-value">{v}</span>
              </div>
            ))}
          </div>
          <div className="badge-footer">
            <div className="badge-valid">Valid for single visit only</div>
            <div className="badge-barcode">▌▐▌▌▐▌▐▐▌▌▐▐▌▐▌▌▌▐▐▌▐▐▌</div>
            <div className="badge-footer-note">Please return this pass at the exit gate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
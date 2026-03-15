import { useState } from "react";
import { useVisitors } from "../context/VisitorContext";
import QRCode from "../components/QRCode";
import "./Forms.css";

const purposes = ["Meeting", "Interview", "Delivery", "Vendor", "Maintenance", "Personal", "Other"];
const departments = ["Engineering", "HR", "Admin", "Finance", "Sales", "Marketing", "Operations", "Security"];

export default function RegisterVisitor({ setPage }) {
  const { addVisitor } = useVisitors();
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", purpose: "", hostName: "", hostDept: "", idType: "Aadhaar", idNumber: "", notes: "" });
  const [registered, setRegistered] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "Enter valid 10-digit phone";
    if (form.email && !form.email.includes("@")) e.email = "Invalid email";
    if (!form.purpose) e.purpose = "Select a purpose";
    if (!form.hostName.trim()) e.hostName = "Host name is required";
    if (!form.hostDept) e.hostDept = "Select department";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const visitor = addVisitor(form);
    setRegistered(visitor);
  };

  const reset = () => { setForm({ name: "", phone: "", email: "", company: "", purpose: "", hostName: "", hostDept: "", idType: "Aadhaar", idNumber: "", notes: "" }); setRegistered(null); setErrors({}); };

  if (registered) {
    return (
      <div className="form-page">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Visitor Registered Successfully!</h2>
          <p className="success-sub">QR Code generated for <strong>{registered.name}</strong></p>
          <div className="qr-display">
            <QRCode value={registered.id} size={180} />
            <div className="qr-info">
              <div className="qr-id">Visitor ID: <strong>{registered.id}</strong></div>
              {[["Name", registered.name], ["Phone", registered.phone], ["Purpose", registered.purpose], ["Host", registered.hostName], ["Dept", registered.hostDept]].map(([k, v]) => (
                <div className="info-row" key={k}><span>{k}:</span> {v}</div>
              ))}
              <div className="info-row"><span>Status:</span> <span style={{ color: "#f59e0b", fontWeight: 600 }}>Pre-Registered</span></div>
            </div>
          </div>
          <p className="qr-hint">📱 Show this QR code at the entry gate to check in</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={reset}>Register Another</button>
            <button className="btn-secondary" onClick={() => setPage("checkin")}>Proceed to Check-In</button>
            <button className="btn-secondary" onClick={() => setPage("dashboard")}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <div><h1 className="page-title">Register Visitor</h1><p className="page-sub">Fill in visitor details to generate a QR pass</p></div>
      </div>
      <form className="visitor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="form-section-title">👤 Visitor Information</h3>
          <div className="form-grid">
            <div className="form-group"><label>Full Name *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />{errors.name && <span className="error">{errors.name}</span>}</div>
            <div className="form-group"><label>Phone Number *</label><input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" maxLength={10} />{errors.phone && <span className="error">{errors.phone}</span>}</div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="visitor@example.com" />{errors.email && <span className="error">{errors.email}</span>}</div>
            <div className="form-group"><label>Company</label><input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Visitor's company" /></div>
            <div className="form-group"><label>ID Type</label><select value={form.idType} onChange={e => setForm({ ...form, idType: e.target.value })}>{["Aadhaar", "PAN Card", "Passport", "Driving License", "Voter ID"].map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>ID Number</label><input type="text" value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} placeholder="Enter ID number" /></div>
          </div>
        </div>
        <div className="form-section">
          <h3 className="form-section-title">🏢 Visit Information</h3>
          <div className="form-grid">
            <div className="form-group"><label>Purpose *</label><select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}><option value="">Select purpose</option>{purposes.map(p => <option key={p}>{p}</option>)}</select>{errors.purpose && <span className="error">{errors.purpose}</span>}</div>
            <div className="form-group"><label>Host Name *</label><input type="text" value={form.hostName} onChange={e => setForm({ ...form, hostName: e.target.value })} placeholder="Person being visited" />{errors.hostName && <span className="error">{errors.hostName}</span>}</div>
            <div className="form-group"><label>Department *</label><select value={form.hostDept} onChange={e => setForm({ ...form, hostDept: e.target.value })}><option value="">Select department</option>{departments.map(d => <option key={d}>{d}</option>)}</select>{errors.hostDept && <span className="error">{errors.hostDept}</span>}</div>
            <div className="form-group full-width"><label>Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any special instructions..." rows={3} /></div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => setPage("dashboard")}>Cancel</button>
          <button type="submit" className="btn-primary">Generate QR Pass →</button>
        </div>
      </form>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import "./QRScanner.css";

export default function QRScanner({ onScan, onClose }) {
  const html5QrRef = useRef(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState("loading");
  const [cameras, setCameras] = useState([]);
  const [selectedCamId, setSelectedCamId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadLibrary(() => initCameras());
    return () => stopScanner();
  }, []);

  const loadLibrary = (cb) => {
    if (window.Html5Qrcode) { cb(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js";
    s.onload = cb;
    s.onerror = () => showError("Failed to load scanner library. Check internet connection.");
    document.head.appendChild(s);
  };

  const initCameras = async () => {
    try {
      const devices = await window.Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        showError("No camera detected. Please connect a camera and try again.");
        return;
      }
      setCameras(devices);
      const back = devices.find(d => /back|rear|environment/i.test(d.label));
      const cam = back || devices[0];
      setSelectedCamId(cam.id);
      startScanner(cam.id);
    } catch (e) {
      showError("Camera permission denied. Click the camera icon in your browser address bar and allow access.");
    }
  };

  const startScanner = (camId) => {
    if (startedRef.current) return;
    const el = document.getElementById("qr-scanner-region");
    if (!el) { setTimeout(() => startScanner(camId), 100); return; }
    startedRef.current = true;
    const scanner = new window.Html5Qrcode("qr-scanner-region", { verbose: false });
    html5QrRef.current = scanner;
    scanner.start(
      camId,
      { fps: 15, qrbox: { width: 200, height: 200 }, aspectRatio: 1.0 },
      (decoded) => {
        const id = decoded.trim().toUpperCase();
        stopScanner();
        onScan(id);
      },
      () => {}
    )
    .then(() => setStatus("scanning"))
    .catch((err) => {
      startedRef.current = false;
      showError("Could not start camera. " + (err?.message || err));
    });
  };

  const stopScanner = () => {
    if (html5QrRef.current) {
      html5QrRef.current.stop()
        .then(() => html5QrRef.current.clear())
        .catch(() => {})
        .finally(() => { html5QrRef.current = null; startedRef.current = false; });
    }
  };

  const switchCamera = (camId) => {
    stopScanner();
    setSelectedCamId(camId);
    startedRef.current = false;
    setTimeout(() => startScanner(camId), 500);
  };

  const showError = (msg) => { setStatus("error"); setErrorMsg(msg); };
  const handleClose = () => { stopScanner(); onClose(); };

  return (
    <div className="qrs-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="qrs-box">
        <div className="qrs-header">
          <div className="qrs-title">📷 Scan Visitor QR Code</div>
          <button className="qrs-close" onClick={handleClose}>✕</button>
        </div>

        <div className="qrs-viewport">
          {status === "loading" && (
            <div className="qrs-state">
              <div className="qrs-spinner" />
              <p>Starting camera...</p>
            </div>
          )}
          {status === "error" && (
            <div className="qrs-state qrs-error">
              <div style={{ fontSize: 40 }}>⚠️</div>
              <p>{errorMsg}</p>
              <button className="qrs-retry" onClick={() => { setStatus("loading"); startedRef.current = false; initCameras(); }}>
                Try Again
              </button>
            </div>
          )}
          <div
            id="qr-scanner-region"
            style={{ width: "100%", display: status === "scanning" ? "block" : "none" }}
          />
          {status === "scanning" && (
            <div className="qrs-frame">
              <div className="qrs-corner qrs-tl" />
              <div className="qrs-corner qrs-tr" />
              <div className="qrs-corner qrs-bl" />
              <div className="qrs-corner qrs-br" />
              <div className="qrs-laser" />
            </div>
          )}
        </div>

        {cameras.length > 1 && status === "scanning" && (
          <div className="qrs-cams">
            <span className="qrs-cams-label">Switch Camera:</span>
            {cameras.map((cam, i) => (
              <button
                key={cam.id}
                className={"qrs-cam-btn" + (selectedCamId === cam.id ? " active" : "")}
                onClick={() => switchCamera(cam.id)}
              >
                {/back|rear|environment/i.test(cam.label) ? "📷 Back" :
                 /front|user|face/i.test(cam.label) ? "🤳 Front" :
                 "📷 Cam " + (i + 1)}
              </button>
            ))}
          </div>
        )}

        <div className="qrs-hint">
          {status === "scanning" ? "🔍 Hold the QR code steady in front of the camera" :
           status === "loading" ? "Please allow camera permission if prompted" : ""}
        </div>
        <div className="qrs-phone-tip">
          📱 <strong>On mobile?</strong> Open <code>http://YOUR_PC_IP:5173</code> on your phone (same WiFi)
        </div>
      </div>
    </div>
  );
}
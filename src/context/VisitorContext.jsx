import { createContext, useContext, useState } from "react";

const VisitorContext = createContext();

const sampleVisitors = [
  { id: "VIS001", name: "Rahul Sharma", phone: "9876543210", email: "rahul@example.com", purpose: "Meeting", hostName: "Mr. Anil Kumar", hostDept: "Engineering", company: "Infosys", idType: "Aadhaar", idNumber: "1234-5678-9012", qrCode: "VIS001", status: "checked-out", checkInTime: "2025-03-14T09:15:00", checkOutTime: "2025-03-14T11:30:00", date: "2025-03-14", notes: "" },
  { id: "VIS002", name: "Priya Singh", phone: "9123456789", email: "priya@example.com", purpose: "Interview", hostName: "Ms. Sunita Verma", hostDept: "HR", company: "Freelancer", idType: "PAN Card", idNumber: "ABCDE1234F", qrCode: "VIS002", status: "checked-in", checkInTime: "2025-03-14T10:00:00", checkOutTime: null, date: "2025-03-14", notes: "Bring portfolio" },
  { id: "VIS003", name: "Amit Patel", phone: "9988776655", email: "amit@example.com", purpose: "Delivery", hostName: "Mr. Raj Mehta", hostDept: "Admin", company: "BlueDart", idType: "Driving License", idNumber: "DL-1234567890", qrCode: "VIS003", status: "pre-registered", checkInTime: null, checkOutTime: null, date: "2025-03-14", notes: "" },
];

export function VisitorProvider({ children }) {
  const [visitors, setVisitors] = useState(sampleVisitors);

  const addVisitor = (visitor) => {
    const id = "VIS" + String(visitors.length + 1).padStart(3, "0");
    const newVisitor = { ...visitor, id, qrCode: id, status: "pre-registered", checkInTime: null, checkOutTime: null, date: new Date().toISOString().split("T")[0] };
    setVisitors((prev) => [newVisitor, ...prev]);
    return newVisitor;
  };

  const checkIn = (id) => {
    setVisitors((prev) => prev.map((v) => v.id === id ? { ...v, status: "checked-in", checkInTime: new Date().toISOString() } : v));
  };

  const checkOut = (id) => {
    setVisitors((prev) => prev.map((v) => v.id === id ? { ...v, status: "checked-out", checkOutTime: new Date().toISOString() } : v));
  };

  const getVisitorById = (id) => visitors.find((v) => v.id === id);

  return (
    <VisitorContext.Provider value={{ visitors, addVisitor, checkIn, checkOut, getVisitorById }}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitors() {
  return useContext(VisitorContext);
}
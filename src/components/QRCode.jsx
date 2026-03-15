export default function QRCode({ value, size = 150 }) {
  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  };
  const gridSize = 21;
  const cellSize = size / gridSize;
  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const inFinder = (row < 7 && col < 7) || (row < 7 && col >= gridSize - 7) || (row >= gridSize - 7 && col < 7);
      const inTiming = row === 6 || col === 6;
      let filled = false;
      if (inFinder) {
        const lr = row < 7 ? row : row - (gridSize - 7);
        const lc = col < 7 ? col : col - (gridSize - 7);
        filled = lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else if (inTiming) {
        filled = (row + col) % 2 === 0;
      } else {
        filled = hash(value + row * 100 + col) % 3 !== 0;
      }
      if (filled) cells.push(<rect key={`${row}-${col}`} x={col * cellSize} y={row * cellSize} width={cellSize} height={cellSize} fill="#0f172a" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: "8px", background: "#fff", padding: "6px" }}>
      {cells}
    </svg>
  );
}
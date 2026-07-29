export function TitleBar({ label }) {
  return (
    <div className="titlebar">
      <div className="icons"><span>&#x2612;</span><span>&minus;</span><span>+</span></div>
      <div className="label">{label}</div>
    </div>
  );
}

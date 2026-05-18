export default function Card({ children, dark, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: dark ? "rgba(40,20,60,.68)" : "rgba(255,255,255,.44)",
      backdropFilter: "blur(16px)",
      border: `1.5px solid ${dark ? "rgba(201,160,220,.18)" : "rgba(255,255,255,.62)"}`,
      borderRadius: 24, padding: "20px 22px",
      boxShadow: dark ? "0 8px 32px rgba(0,0,0,.38)" : "0 8px 32px rgba(255,143,171,.11)",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>{children}</div>
  );
}

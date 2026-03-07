import React from "react";

export default function FooterSection() {
  return (
    <footer style={{
      direction: "rtl", background: "#1e3a5f",
      color: "#fff", padding: "48px 16px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: "#2563eb",
            borderRadius: 12, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20,
          }}>🎧</div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>ServiceQ</span>
        </div>
        <div style={{ fontSize: 14, color: "#93c5fd", textAlign: "center" }}>
          © {new Date().getFullYear()} ServiceQ — מערכת שירות לקוחות חכמה. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}import React from "react";

export default function FooterSection() {
  return (
    <footer style={{
      direction: "rtl", background: "#1e3a5f",
      color: "#fff", padding: "48px 16px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: "#2563eb",
            borderRadius: 12, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20,
          }}>🎧</div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>ServiceQ</span>
        </div>
        <div style={{ fontSize: 14, color: "#93c5fd", textAlign: "center" }}>
          © {new Date().getFullYear()} ServiceQ — מערכת שירות לקוחות חכמה. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
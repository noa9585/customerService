import React from "react";

export default function HeroSection({ onStartChat }) {
  return (
    <section style={{
      direction: "rtl",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
      padding: "40px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 80, left: 40,
        width: 288, height: 288,
        background: "#dbeafe", borderRadius: "50%",
        opacity: 0.4, filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: 80, right: 40,
        width: 384, height: 384,
        background: "#eff6ff", borderRadius: "50%",
        opacity: 0.4, filter: "blur(60px)",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, width: "100%" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 16px", background: "#dbeafe", color: "#1d4ed8",
          borderRadius: 999, fontSize: 14, fontWeight: 500,
          border: "1px solid #bfdbfe", marginBottom: 32,
        }}>
          ⚡ שירות לקוחות חכם ומהיר
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
          fontWeight: 800, color: "#111827",
          lineHeight: 1.2, marginBottom: 24, margin: "0 0 24px",
        }}>
          שירות לקוחות<br />
          <span style={{ color: "#2563eb" }}>ברמה אחרת</span>
        </h1>

        <p style={{
          fontSize: 18, color: "#6b7280",
          maxWidth: 560, margin: "0 auto 40px",
          lineHeight: 1.8,
        }}>
          מערכת תור חכמה שמחברת אותך לנציג המתאים ביותר,
          עם זמני המתנה מינימליים וחוויית שירות מעולה.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onStartChat} style={{
            background: "#2563eb", color: "#fff",
            fontSize: 18, padding: "14px 32px",
            borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 600, boxShadow: "0 8px 25px rgba(37,99,235,0.3)",
          }}>
            💬 התחל שיחה
          </button>
          <button style={{
            background: "#fff", color: "#374151",
            fontSize: 18, padding: "14px 32px",
            borderRadius: 12, border: "2px solid #d1d5db",
            cursor: "pointer", fontWeight: 600,
          }}>
            למד עוד
          </button>
        </div>

        <div style={{
          marginTop: 64, display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32, maxWidth: 420, margin: "64px auto 0",
        }}>
          {[
            { value: "98%", label: "שביעות רצון" },
            { value: "<2 דק׳", label: "זמן המתנה" },
            { value: "24/7", label: "זמינות" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}import React from "react";

export default function HeroSection({ onStartChat }) {
  return (
    <section style={{
      direction: "rtl",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
      padding: "40px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 80, left: 40,
        width: 288, height: 288,
        background: "#dbeafe", borderRadius: "50%",
        opacity: 0.4, filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: 80, right: 40,
        width: 384, height: 384,
        background: "#eff6ff", borderRadius: "50%",
        opacity: 0.4, filter: "blur(60px)",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, width: "100%" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 16px", background: "#dbeafe", color: "#1d4ed8",
          borderRadius: 999, fontSize: 14, fontWeight: 500,
          border: "1px solid #bfdbfe", marginBottom: 32,
        }}>
          ⚡ שירות לקוחות חכם ומהיר
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
          fontWeight: 800, color: "#111827",
          lineHeight: 1.2, marginBottom: 24, margin: "0 0 24px",
        }}>
          שירות לקוחות<br />
          <span style={{ color: "#2563eb" }}>ברמה אחרת</span>
        </h1>

        <p style={{
          fontSize: 18, color: "#6b7280",
          maxWidth: 560, margin: "0 auto 40px",
          lineHeight: 1.8,
        }}>
          מערכת תור חכמה שמחברת אותך לנציג המתאים ביותר,
          עם זמני המתנה מינימליים וחוויית שירות מעולה.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onStartChat} style={{
            background: "#2563eb", color: "#fff",
            fontSize: 18, padding: "14px 32px",
            borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 600, boxShadow: "0 8px 25px rgba(37,99,235,0.3)",
          }}>
            💬 התחל שיחה
          </button>
          <button style={{
            background: "#fff", color: "#374151",
            fontSize: 18, padding: "14px 32px",
            borderRadius: 12, border: "2px solid #d1d5db",
            cursor: "pointer", fontWeight: 600,
          }}>
            למד עוד
          </button>
        </div>

        <div style={{
          marginTop: 64, display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32, maxWidth: 420, margin: "64px auto 0",
        }}>
          {[
            { value: "98%", label: "שביעות רצון" },
            { value: "<2 דק׳", label: "זמן המתנה" },
            { value: "24/7", label: "זמינות" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
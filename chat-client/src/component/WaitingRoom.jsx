import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function WaitingRoom({ session, onCancel }) {
  const [currentSession, setCurrentSession] = useState(session);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session?.id || session.status !== "waiting") return;
    const interval = setInterval(async () => {
      const sessions = await base44.entities.ChatSession.filter({ id: session.id });
      if (sessions.length > 0) setCurrentSession(sessions[0]);
    }, 30000);
    return () => clearInterval(interval);
  }, [session?.id]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const totalSeconds = (currentSession?.estimated_wait_minutes || 3) * 60;
  const progress = Math.min((elapsed / totalSeconds) * 100, 95);

  const handleCancel = async () => {
    await base44.entities.ChatSession.update(session.id, { status: "cancelled" });
    onCancel();
  };

  return (
    <section style={{ direction: "rtl", padding: "96px 16px", background: "#fff" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          border: "1px solid #f3f4f6", overflow: "hidden",
        }}>
          {/* Top bar */}
          <div style={{
            height: 6,
            background: "linear-gradient(to left, #60a5fa, #1d4ed8, #60a5fa)",
          }} />

          <div style={{ padding: 40, textAlign: "center" }}>
            {/* Pulse circle */}
            <div style={{ position: "relative", width: 112, height: 112, margin: "0 auto 32px" }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "#dbeafe", borderRadius: "50%",
                animation: "ping 2s ease-in-out infinite",
              }} />
              <div style={{
                position: "absolute", inset: 16,
                background: "#eff6ff", borderRadius: "50%",
              }} />
              <div style={{
                position: "absolute", inset: 24,
                background: "#dbeafe", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36,
              }}>
                🎧
              </div>
            </div>

            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", background: "#eff6ff", color: "#1d4ed8",
              border: "1px solid #bfdbfe", borderRadius: 999,
              fontSize: 14, fontWeight: 500, marginBottom: 24,
            }}>
              ⏳ ממתין בתור
            </span>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              {currentSession?.customer_name}، אנחנו כאן!
            </h2>
            <p style={{ color: "#6b7280", marginBottom: 32 }}>
              נושא: <strong style={{ color: "#111827" }}>{currentSession?.topic_name}</strong>
            </p>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { icon: "👥", value: currentSession?.queue_position || 1, label: "מיקום בתור" },
                { icon: "🕐", value: `~${currentSession?.estimated_wait_minutes || 3} דק׳`, label: "זמן משוער" },
                { icon: "⏱️", value: formatTime(elapsed), label: "זמן שעבר", ltr: true },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#f9fafb", borderRadius: 16, padding: "16px 8px",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", fontFamily: s.ltr ? "monospace" : "inherit" }} dir={s.ltr ? "ltr" : undefined}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ background: "#f3f4f6", borderRadius: 999, height: 8, marginBottom: 24, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "#2563eb",
                borderRadius: 999, width: `${progress}%`,
                transition: "width 1s linear",
              }} />
            </div>

            <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>
              ✨ אל תסגור את הדף — נעדכן אותך ברגע שנציג יתפנה
            </p>

            <button
              onClick={handleCancel}
              style={{
                padding: "12px 24px", borderRadius: 12,
                border: "2px solid #e5e7eb", background: "transparent",
                color: "#6b7280", fontSize: 15, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              ✕ בטל ויצא מהתור
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
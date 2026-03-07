import React, { useState } from "react";

const inputStyle = {
  width: "100%", height: 48, padding: "0 16px",
  border: "1px solid #e5e7eb", borderRadius: 12,
  fontSize: 15, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block", fontSize: 14,
  fontWeight: 500, color: "#374151", marginBottom: 8,
};

export default function ChatRequestForm({ topics, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    customer_name: "", customer_email: "", topic_id: "", message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedTopic = topics.find(t => t.id === formData.topic_id);
    onSubmit({ ...formData, topic_name: selectedTopic?.name || "" });
  };

  const isValid = formData.customer_name && formData.customer_email && formData.topic_id;

  return (
    <section id="chat-form" style={{ direction: "rtl", padding: "96px 16px", background: "#fff" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>💬</div>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#111827", marginBottom: 16 }}>
            פתח שיחה חדשה
          </h2>
          <p style={{ color: "#6b7280", fontSize: 18 }}>מלא את הפרטים ונחבר אותך לנציג בהקדם</p>
        </div>

        <div style={{
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          border: "1px solid #f3f4f6", padding: 32,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>שם מלא</label>
                <input
                  type="text" placeholder="הזן את שמך"
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>אימייל</label>
                <input
                  type="email" placeholder="your@email.com" dir="ltr"
                  value={formData.customer_email}
                  onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>נושא הפנייה</label>
              <select
                value={formData.topic_id}
                onChange={e => setFormData({ ...formData, topic_id: e.target.value })}
                style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}
              >
                <option value="">בחר נושא...</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>הודעה (אופציונלי)</label>
              <textarea
                placeholder="תאר בקצרה את הפנייה שלך..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                style={{
                  ...inputStyle, height: "auto", padding: "12px 16px",
                  resize: "none", lineHeight: 1.6,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              style={{
                width: "100%", height: 56, fontSize: 18,
                borderRadius: 12, border: "none", cursor: isValid && !isLoading ? "pointer" : "not-allowed",
                background: isValid && !isLoading ? "#2563eb" : "#93c5fd",
                color: "#fff", fontWeight: 600,
                boxShadow: isValid && !isLoading ? "0 8px 20px rgba(37,99,235,0.25)" : "none",
                fontFamily: "inherit",
              }}
            >
              {isLoading ? "⏳ שולח..." : "📨 הצטרף לתור"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
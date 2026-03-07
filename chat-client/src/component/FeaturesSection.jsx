import React from "react";

const features = [
  { icon: "🕐", title: "תור חכם בזמן אמת", description: "עדכון אוטומטי על מיקומך בתור וזמן ההמתנה המשוער." },
  { icon: "👥", title: "ניתוב אוטומטי", description: "המערכת מתאימה את הנציג המתאים ביותר לנושא שלך." },
  { icon: "📊", title: "ניתוח ומעקב", description: "מערכת אנליטיקס שעוזרת לנו לשפר את השירות באופן מתמיד." },
  { icon: "🔒", title: "אבטחה מלאה", description: "כל השיחות מוצפנות מקצה לקצה, המידע שלך בטוח." },
];

export default function FeaturesSection() {
  return (
    <section style={{ direction: "rtl", padding: "96px 16px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#111827", marginBottom: 16 }}>
            למה לבחור בנו?
          </h2>
          <p style={{ color: "#6b7280", fontSize: 18, maxWidth: 520, margin: "0 auto" }}>
            טכנולוגיה מתקדמת שהופכת כל אינטראקציה עם שירות הלקוחות לחוויה נעימה
          </p>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 20, padding: 32,
              border: "1px solid #f3f4f6",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.3s",
            }}>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
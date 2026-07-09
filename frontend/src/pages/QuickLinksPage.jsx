import { useEffect, useState } from "react";

function QuickLinksPage() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    { name: "DVC Official Website",        icon: "🌐", url: "https://www.dvc.gov.in",      iconBg: "#003087" },
    { name: "Ministry of Power",           icon: "⚡", url: "https://powermin.gov.in",     iconBg: "#c2410c" },
    { name: "Central Electricity Authority",icon:"🏛️", url: "https://cea.nic.in",          iconBg: "#166534" },
    { name: "NTPC Limited",                icon: "🏭", url: "https://www.ntpc.co.in",      iconBg: "#92400e" },
    { name: "Power Grid Corporation",      icon: "🔌", url: "https://www.powergrid.in",    iconBg: "#1d4ed8" },
    { name: "POSOCO / Grid India",         icon: "📡", url: "https://www.grid-india.in",   iconBg: "#6b21a8" },
    { name: "Government of India Portal",  icon: "🇮🇳", url: "https://www.india.gov.in",    iconBg: "#0f766e" },
    { name: "CPGRAMS Grievance Portal",    icon: "📋", url: "https://pgportal.gov.in",     iconBg: "#be185d" },
  ];

  const emergencyContacts = [
    { title: "Security Control Room", contact: "+91-XXXXXXXXXX" },
    { title: "Fire Station",          contact: "+91-XXXXXXXXXX" },
    { title: "Medical Unit",          contact: "+91-XXXXXXXXXX" },
    { title: "Plant Manager Office",  contact: "+91-XXXXXXXXXX" },
  ];

  return (
    <div>

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Quick Links</span>
      </nav>

      {/* Page Title Bar */}
      <div className="page-title-bar" style={{ marginTop: 12 }}>
        <div>
          <h2>Quick Links</h2>
          <p>Quick access to DVC and Government of India related websites</p>
        </div>
        <div className="page-title-bar-right">{dateTime}</div>
      </div>

      {/* Quick Links Panel */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h4>🔗 Quick Links</h4>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}>
            {quickLinks.map((link, idx) => (
              <div
                key={link.name}
                onClick={() => window.open(link.url, "_blank")}
                style={{
                  borderRight: (idx + 1) % 4 !== 0 ? "1px solid #e8ecf0" : "none",
                  borderBottom: idx < quickLinks.length - 4 ? "1px solid #e8ecf0" : "none",
                  padding: "28px 16px",
                  minHeight: 130,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: "#fff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: link.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    marginBottom: 12,
                    flexShrink: 0,
                  }}
                >
                  {link.icon}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#333",
                    textAlign: "center",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {link.name}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Emergency Contacts Panel */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h4>🚨 Emergency Contacts</h4>
        </div>
        <div className="panel-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {emergencyContacts.map((contact) => (
              <div
                key={contact.title}
                style={{
                  borderLeft: "4px solid #cc3300",
                  background: "#fff8f6",
                  padding: "12px 16px",
                  borderRadius: 4,
                }}
              >
                <h3 style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 4 }}>
                  {contact.title}
                </h3>
                <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>{contact.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default QuickLinksPage;

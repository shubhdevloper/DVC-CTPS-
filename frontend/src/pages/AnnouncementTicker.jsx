import { useEffect, useState } from "react";
import axios from "axios";

function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("ctps_token");
      const { data } = await axios.get(
        "https://dvc-ctps.onrender.com/api/announcements",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  /* ticker-wrap: exact from reference */
  const wrapStyle = {
    background: "#001f5b",
    borderBottom: "2px solid #cc3300",
    display: "flex",
    alignItems: "center",
    height: "36px",
    overflow: "hidden",
    position: "relative",
  };

  /* ticker-label */
  const labelStyle = {
    background: "#cc3300",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    padding: "0 14px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    flexShrink: 0,
    zIndex: 2,
  };

  if (!announcements || announcements.length === 0) {
    return (
      <div style={wrapStyle}>
        <div style={labelStyle}>Announcements</div>
        <span style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.5)",
          padding: "0 20px",
          fontStyle: "italic",
        }}>
          No active announcements
        </span>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={labelStyle}>Announcements</div>

      <div style={{ flex: 1, height: "100%", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes ticker-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            align-items: center;
            white-space: nowrap;
            animation: ticker-scroll 30s linear infinite;
            padding-left: 40px;
            position: absolute;
            top: 0; left: 0;
            height: 100%;
          }
          .ticker-track:hover { animation-play-state: paused; }
          .ticker-item {
            font-size: 12px;
            color: rgba(255,255,255,0.9);
            padding: 0 40px 0 0;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .ticker-item::before {
            content: '●';
            color: #cc3300;
            font-size: 8px;
          }
          .ticker-item a {
            color: #ffd700;
            text-decoration: underline;
            cursor: pointer;
          }
          .ticker-item a:hover { color: #fff; }
        `}</style>

        {/* Duplicate items for seamless loop */}
        <div className="ticker-track">
          {[...announcements, ...announcements].map((item, index) => (
            <span key={index} className="ticker-item">
              {item.type === "text" && item.title}
              {item.type === "pdf" && (
                <a href={item.pdfUrl} target="_blank" rel="noreferrer">📄 {item.title}</a>
              )}
              {item.type === "link" && (
                <a href={item.linkUrl} target="_blank" rel="noreferrer">🔗 {item.title}</a>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementTicker;

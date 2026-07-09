import { useEffect, useState } from "react";
import logo from "../../assets/dvc-logo.png";

function Header() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = dateTime.toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <header>
      {/* util-bar */}
      <div style={{
        background: "#001f5b",
        color: "#ccd6f6",
        fontSize: "11px",
        padding: "5px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span>दामोदर घाटी निगम &nbsp;|&nbsp; Damodar Valley Corporation &nbsp;|&nbsp; Under Ministry of Power, Govt. of India</span>
        <span>{formattedDateTime}</span>
      </div>

      {/* logo-bar */}
      <div style={{
        background: "#fff",
        borderBottom: "3px solid #003087",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "18px",
      }}>
        <img src={logo} alt="DVC Logo" style={{ height: "72px", width: "auto" }} />

        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#003087", lineHeight: 1.2 }}>
            Damodar Valley Corporation
          </div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "3px" }}>
            C.T.P.S. Chandrapura — Chandrapura Thermal Power Station
          </div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", fontStyle: "italic" }}>
            Under the Ministry of Power, Government of India
          </div>
        </div>

        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#cc3300" }}>
            Material Register System
          </div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
            Chandrapura, Bokaro, Jharkhand
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
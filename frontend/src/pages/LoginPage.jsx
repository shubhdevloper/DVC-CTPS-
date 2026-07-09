import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axios from "axios";
function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (userData) => {
    login(userData);
    navigate("/dashboard");
  };
const handleLogin = async () => {
  try {
    const response =
      await axios.post(
        "https://dvc-ctps.onrender.com/api/auth/login",
        {
          username,
          password,
        }
      );

    login(
      response.data.user,
      response.data.token
    );

    navigate("/dashboard");
  } catch (error) {
    alert(
      error.response?.data
        ?.message ||
        "Login failed"
    );
  }
};
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"#f0f4ff"}}>
      <Header />

      <main style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
        <div style={{width:"100%",maxWidth:"420px",background:"#fff",border:"1px solid #dde3ed",borderRadius:"4px",boxShadow:"0 4px 18px rgba(0,0,48,0.10)",overflow:"hidden"}}>

          {/* Card Head */}
          <div style={{background:"linear-gradient(135deg,#003087,#001f5b)",padding:"16px 20px"}}>
            <h3 style={{fontSize:"15px",fontWeight:700,color:"#fff",margin:0}}>Material Register System</h3>
            <p style={{fontSize:"11px",color:"rgba(255,255,255,0.7)",marginTop:"4px",marginBottom:0}}>CTPS Chandrapura – Goods In / Goods Out Tracking</p>
          </div>

          {/* Card Body */}
          <div style={{padding:"20px"}}>

            <div className="lfield">
              <label style={{display:"block",fontSize:"11px",fontWeight:700,color:"#444",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"5px"}}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{width:"100%",padding:"9px 12px",border:"1px solid #c5cfe0",borderRadius:"3px",fontSize:"14px",background:"#f8faff",color:"#222",marginBottom:"14px",boxSizing:"border-box"}}
              />
            </div>

            <div className="lfield">
              <label style={{display:"block",fontSize:"11px",fontWeight:700,color:"#444",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"5px"}}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{width:"100%",padding:"9px 12px",border:"1px solid #c5cfe0",borderRadius:"3px",fontSize:"14px",background:"#f8faff",color:"#222",marginBottom:"10px",boxSizing:"border-box"}}
              />
            </div>

            <div style={{marginBottom:"14px"}}>
              <label style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"12px",color:"#555",cursor:"pointer"}}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            </div>

            <button
              onClick={handleLogin}
              style={{width:"100%",padding:"10px",background:"#003087",color:"#fff",border:"none",borderRadius:"3px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}
            >
              Sign In
            </button>

            {/* Divider */}
            <div style={{height:"1px",background:"#eaeff7",margin:"14px 0"}}></div>

            {/* Quick Testing Logins */}
            <p style={{fontSize:"11px",fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:"8px"}}>Quick Testing Login</p>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px"}}>

              <button
                onClick={() =>
                  handleQuickLogin({
                    id: "1",
                    fullName: "Super Admin",
                    username: "superadmin",
                    role: "superadmin",
                    gate: "All Gates",
                  })
                }
                style={{background:"#217a3c",color:"#fff",border:"none",borderRadius:"3px",padding:"6px 4px",fontSize:"11px",fontWeight:600,cursor:"pointer"}}
              >
                Super Admin
              </button>

              <button
                onClick={() =>
                  handleQuickLogin({
                    id: "2",
                    fullName: "Plant Manager",
                    username: "manager",
                    role: "manager",
                    gate: "All Gates",
                  })
                }
                style={{background:"#cc3300",color:"#fff",border:"none",borderRadius:"3px",padding:"6px 4px",fontSize:"11px",fontWeight:600,cursor:"pointer"}}
              >
                Manager
              </button>

              <button
                onClick={() =>
                  handleQuickLogin({
                    id: "3",
                    fullName: "Gate 1 Security",
                    username: "security",
                    role: "security",
                    gate: "Gate 1",
                  })
                }
                style={{background:"#003087",color:"#fff",border:"none",borderRadius:"3px",padding:"6px 4px",fontSize:"11px",fontWeight:600,cursor:"pointer"}}
              >
                Security
              </button>

            </div>

            <p style={{textAlign:"center",marginTop:"14px",fontSize:"12px",color:"#555"}}>
              New User?{" "}
              <Link to="/register" style={{color:"#003087",fontWeight:700}}>
                Register Here
              </Link>
            </p>

            <p style={{textAlign:"center",marginTop:"6px",fontSize:"12px",color:"#555"}}>
              <Link to="/forgot-password" style={{color:"#003087",fontWeight:700}}>
                Forgot Password?
              </Link>
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;

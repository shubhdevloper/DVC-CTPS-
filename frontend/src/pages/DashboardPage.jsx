import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
function DashboardPage() {
  const { user } = useAuth();

  const [dateTime, setDateTime] = useState("");
  const [totalIncoming, setTotalIncoming] =
  useState(0);

const [totalOutgoing, setTotalOutgoing] =
  useState(0);

const [pendingReview, setPendingReview] =
  useState(0);

const [todayMovements, setTodayMovements] =
  useState(0);

const [recentActivities, setRecentActivities] =
  useState([]);
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
useEffect(() => {
  const loadDashboard = async () => {
    try {
      const token =
        localStorage.getItem(
          "ctps_token"
        );

      const incomingResponse =
        await axios.get(
          "http://10.53.49.228:5000/api/incoming",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const outgoingResponse =
        await axios.get(
          "http://10.53.49.228:5000/api/outgoing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const incoming =
        incomingResponse.data;

      const outgoing =
        outgoingResponse.data;

      setTotalIncoming(
        incoming.length
      );

      setTotalOutgoing(
        outgoing.length
      );

      const pendingIncoming =
        incoming.filter(
          (record) =>
            record.status ===
            "Pending"
        );

      const pendingOutgoing =
        outgoing.filter(
          (record) =>
            record.status ===
            "Pending"
        );

      setPendingReview(
        pendingIncoming.length +
          pendingOutgoing.length
      );

      const today =
        new Date()
          .toLocaleDateString(
            "en-GB"
          )
          .replace(/\//g, "-");

      const todayIncoming =
        incoming.filter(
          (record) =>
            record.date === today
        );

      const todayOutgoing =
        outgoing.filter(
          (record) =>
            record.date === today
        );

      setTodayMovements(
        todayIncoming.length +
          todayOutgoing.length
      );

      const activitiesResponse =
  await axios.get(
    "http://10.53.49.228:5000/api/activities",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

setRecentActivities(
  activitiesResponse.data
);
    } catch (error) {
      console.error(error);
    }
  };

  loadDashboard();
}, []);


  return (
    <div>
      <div className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep"> › </span>
        <span className="bc-cur">Dashboard</span>
      </div>

      <div className="page-title-bar">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of all material movements at C.T.P.S. Chandrapura</p>
        </div>
        <div className="page-title-bar-right">{dateTime}</div>
      </div>

      <div className="metrics-row">
        <div className="mcard">
          <div className="ml">Total Incoming</div>
          <div className="mv">{totalIncoming}</div>
        </div>
        <div className="mcard orange">
          <div className="ml">Total Outgoing</div>
          <div className="mv">{totalOutgoing}</div>
        </div>
        <div className="mcard yellow">
          <div className="ml">Pending Review</div>
          <div className="mv">{pendingReview}</div>
        </div>
        <div className="mcard green">
          <div className="ml">Today's Movements</div>
          <div className="mv">{todayMovements}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h4>Welcome to DVC C.T.P.S. Chandrapura</h4></div>
        <div className="panel-body">
          <p style={{fontSize:"12px",color:"#555",marginBottom:"12px"}}>This system digitizes the Incoming and Outgoing Material Registers of Chandrapura Thermal Power Station, Damodar Valley Corporation.</p>
          <div className="welcome-grid">
            <div className="wcard">
              <div className="wt">Security Personnel</div>
              <p>Record goods IN and OUT at assigned gates.</p>
            </div>
            <div className="wcard orange">
              <div className="wt">Manager</div>
              <p>Verify and monitor all transactions.</p>
            </div>
            <div className="wcard green">
              <div className="wt">Super Admin</div>
              <p>Full access to users, gates and system settings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h4>Recent Activities</h4></div>
        <div className="panel-body">
          {recentActivities.length === 0 ? (
            <p className="no-records">No recent activities found.</p>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {recentActivities.map((activity) => (
                <div key={activity._id} style={{borderLeft:"3px solid #003087",background:"#f8faff",padding:"8px 12px",borderRadius:"2px"}}>
                  <p style={{fontSize:"12px",fontWeight:600,color:"#222"}}>{activity.message}</p>
                  <p style={{fontSize:"11px",color:"#888",marginTop:"2px"}}>{new Date(activity.createdAt).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

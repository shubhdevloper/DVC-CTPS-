import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function VerifyPage() {
  useAuth();
  const [dateTime, setDateTime] = useState("");
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingRecords, setIncomingRecords] = useState([]);
  const [outgoingRecords, setOutgoingRecords] = useState([]);

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

  const loadRecords = async () => {
    try {
      const token = localStorage.getItem("ctps_token");
      const incomingResponse = await axios.get(
        "http://10.53.49.228:5000/api/incoming",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const outgoingResponse = await axios.get(
        "http://10.53.49.228:5000/api/outgoing",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIncomingRecords(
        incomingResponse.data.filter((record) => record.status === "Pending")
      );
      setOutgoingRecords(
        outgoingResponse.data.filter((record) => record.status === "Pending")
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleVerifyIncoming = async (id) => {
    try {
      const token = localStorage.getItem("ctps_token");
      await axios.patch(
        `http://10.53.49.228:5000/api/incoming/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Verified successfully");
      loadRecords();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleRejectIncoming = async (id) => {
    try {
      const token = localStorage.getItem("ctps_token");
      await axios.patch(
        `http://10.53.49.228:5000/api/incoming/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rejected successfully");
      loadRecords();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleVerifyOutgoing = async (id) => {
    try {
      const token = localStorage.getItem("ctps_token");
      await axios.patch(
        `http://10.53.49.228:5000/api/outgoing/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectOutgoing = async (id) => {
    try {
      const token = localStorage.getItem("ctps_token");
      await axios.patch(
        `http://10.53.49.228:5000/api/outgoing/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rejected successfully");
      loadRecords();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep"> › </span>
        <span className="bc-cur">Verify / Reject Records</span>
      </div>

      {/* Page Title Bar */}
      <div className="page-title-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Verify / Reject Records</h2>
          <p>Review pending entries and verify or reject them</p>
        </div>
        <div className="page-title-bar-right">{dateTime}</div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginTop: "16px" }}>
        <button
          className={`tab${activeTab === "incoming" ? " active" : ""}`}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming — Pending
        </button>
        <button
          className={`tab${activeTab === "outgoing" ? " active" : ""}`}
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing — Pending
        </button>
      </div>

      {/* Incoming Records */}
      {activeTab === "incoming" && (
        <div className="panel">
          <div className="panel-head">
            <h4>Incoming Entries — Awaiting Verification</h4>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="twrap">
              <table>
                <thead>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Date</th>
                    <th>Vehicle No.</th>
                    <th>Time In</th>
                    <th>Gate Pass No.</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Destination</th>
                    <th>Authorised By</th>
                    <th>Gate</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incomingRecords.length === 0 ? (
                    <tr>
                      <td colSpan="12">
                        <div className="no-records">No pending incoming records</div>
                      </td>
                    </tr>
                  ) : (
                    incomingRecords.map((record, index) => (
                      <tr key={record._id}>
                        <td>{index + 1}</td>
                        <td>{record.date}</td>
                        <td>{record.vehicleNo}</td>
                        <td>{record.timeIn}</td>
                        <td>{record.gatePassNo}</td>
                        <td>{record.materialDescription}</td>
                        <td>{record.quantity}</td>
                        <td>{record.purpose}</td>
                        <td>{record.authorisedBy}</td>
                        <td>{record.gate}</td>
                        <td>
                          <span className="bdg bdg-pending">PENDING</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleVerifyIncoming(record._id)}
                            >
                              Verify
                            </button>
                            <button
                              className="btn btn-reject btn-sm"
                              onClick={() => handleRejectIncoming(record._id)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Outgoing Records */}
      {activeTab === "outgoing" && (
        <div className="panel">
          <div className="panel-head">
            <h4>Outgoing Entries — Awaiting Verification</h4>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="twrap">
              <table>
                <thead>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Date</th>
                    <th>Vehicle No.</th>
                    <th>Time Out</th>
                    <th>Gate Pass No.</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Destination</th>
                    <th>Authorised By</th>
                    <th>Gate</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {outgoingRecords.length === 0 ? (
                    <tr>
                      <td colSpan="12">
                        <div className="no-records">No pending outgoing records</div>
                      </td>
                    </tr>
                  ) : (
                    outgoingRecords.map((record, index) => (
                      <tr key={record._id}>
                        <td>{index + 1}</td>
                        <td>{record.date}</td>
                        <td>{record.vehicleNo}</td>
                        <td>{record.timeOut}</td>
                        <td>{record.gatePassNo}</td>
                        <td>{record.materialDescription}</td>
                        <td>{record.quantity}</td>
                        <td>{record.purpose}</td>
                        <td>{record.authorisedBy}</td>
                        <td>{record.gate}</td>
                        <td>
                          <span className="bdg bdg-pending">PENDING</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleVerifyOutgoing(record._id)}
                            >
                              Verify
                            </button>
                            <button
                              className="btn btn-reject btn-sm"
                              onClick={() => handleRejectOutgoing(record._id)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyPage;

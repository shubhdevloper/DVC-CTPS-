import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

function MyRecordsPage() {
  const { user } = useAuth();

  const [dateTime, setDateTime] = useState("");
  const [filterType, setFilterType] = useState("month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ctps_token");

        const incomingResponse = await axios.get(
          "https://dvc-ctps.onrender.com/api/incoming",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const outgoingResponse = await axios.get(
          "https://dvc-ctps.onrender.com/api/outgoing",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const myIncoming = incomingResponse.data.filter(
          (record) => record.recordedBy === user?.username
        );

        const myOutgoing = outgoingResponse.data.filter(
          (record) => record.recordedBy === user?.username
        );

        setIncomingRecords(myIncoming);
        setOutgoingRecords(myOutgoing);
        setFilteredIncoming(myIncoming);
        setFilteredOutgoing(myOutgoing);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, [user]);


  const [incomingRecords, setIncomingRecords] = useState([]);
  const [outgoingRecords, setOutgoingRecords] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [filteredIncoming, setFilteredIncoming] = useState([]);
  const [filteredOutgoing, setFilteredOutgoing] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getStatusBadge = (status) => {
    if (status === "Verified") {
      return <span className="bdg bdg-verified">VERIFIED</span>;
    }
    if (status === "Rejected") {
      return <span className="bdg bdg-rejected">REJECTED</span>;
    }
    return <span className="bdg bdg-pending">PENDING</span>;
  };

  const handleSearch = () => {
    if (filterType === "range") {
      const filteredIn = incomingRecords.filter((record) => {
        const recordDate = record.date?.split("-")?.reverse()?.join("-");
        return recordDate >= fromDate && recordDate <= toDate;
      });
      const filteredOut = outgoingRecords.filter((record) => {
        const recordDate = record.date?.split("-")?.reverse()?.join("-");
        return recordDate >= fromDate && recordDate <= toDate;
      });
      setFilteredIncoming(filteredIn);
      setFilteredOutgoing(filteredOut);
      setShowResults(true);
      return;
    }

    const monthIndex = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ].indexOf(selectedMonth);

    const filteredIn = incomingRecords.filter((record) => {
      if (!record.date) return false;
      const parts = record.date.split("-");
      if (parts.length !== 3) return false;
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);
      return month === monthIndex && year === Number(selectedYear);
    });

    const filteredOut = outgoingRecords.filter((record) => {
      if (!record.date) return false;
      const parts = record.date.split("-");
      if (parts.length !== 3) return false;
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);
      return month === monthIndex && year === Number(selectedYear);
    });

    setFilteredIncoming(filteredIn);
    setFilteredOutgoing(filteredOut);
    setShowResults(true);
  };

  const handleClear = () => {
    setShowResults(false);
    setFilteredIncoming([]);
    setFilteredOutgoing([]);
    setFromDate("");
    setToDate("");
    setFilterType("month");
    setSelectedMonth(new Date().toLocaleString("default", { month: "long" }));
    setSelectedYear(new Date().getFullYear());
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, fileName);
  };

  const allRecords = [...incomingRecords, ...outgoingRecords];
  const totalRecords = allRecords.length;
  const approvedCount = allRecords.filter((r) => r.status === "Verified").length;
  const pendingCount = allRecords.filter((r) => r.status === "Pending").length;
  const rejectedCount = allRecords.filter((r) => r.status === "Rejected").length;

  return (
    <div>

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep">›</span>
        <span className="bc-cur">My Records</span>
      </nav>

      {/* Page Title Bar */}
      <div className="page-title-bar" style={{ marginTop: 12 }}>
        <div>
          <h2>My Records</h2>
          <p>View your recorded entries and verification status</p>
        </div>
        <div className="page-title-bar-right">{dateTime}</div>
      </div>

      {/* Summary Cards — using .mcard reference classes */}
      <div className="metrics-row">
        <div className="mcard">
          <div className="ml">Total Records</div>
          <div className="mv">{loading ? "..." : totalRecords}</div>
        </div>
        <div className="mcard yellow">
          <div className="ml">Pending</div>
          <div className="mv">{loading ? "..." : pendingCount}</div>
        </div>
        <div className="mcard green">
          <div className="ml">Verified</div>
          <div className="mv">{loading ? "..." : approvedCount}</div>
        </div>
        <div className="mcard orange">
          <div className="ml">Rejected</div>
          <div className="mv">{loading ? "..." : rejectedCount}</div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h4>My Records — Filter &amp; Search</h4>
        </div>
        <div className="panel-body">
          {/* Filter Type Tabs */}
          <div className="tabs" style={{ marginBottom: 14 }}>
            <button
              type="button"
              className={`tab${filterType === "month" ? " active" : ""}`}
              onClick={() => setFilterType("month")}
            >
              Filter by Month
            </button>
            <button
              type="button"
              className={`tab${filterType === "range" ? " active" : ""}`}
              onClick={() => setFilterType("range")}
            >
              Filter by Date Range
            </button>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            {filterType === "month" ? (
              <>
                <div className="ff">
                  <label>Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {["January","February","March","April","May","June",
                      "July","August","September","October","November","December"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="ff">
                  <label>Year</label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="ff">
                  <label>From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="ff">
                  <label>To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="ff" style={{ justifyContent: "flex-end", flexDirection: "row", gap: 8, alignItems: "flex-end" }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSearch}>
                Search
              </button>
              <button type="button" className="btn btn-sm" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <>
          {/* Export Bar */}
          <div className="export-bar" style={{ marginTop: 16, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{ borderColor: "#166534", color: "#166534" }}
              onClick={() => downloadExcel(filteredIncoming, "incoming-records.xlsx")}
            >
              ⬇ Download Incoming
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ borderColor: "#166534", color: "#166534" }}
              onClick={() => downloadExcel(filteredOutgoing, "outgoing-records.xlsx")}
            >
              ⬇ Download Outgoing
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={handlePrint}
            >
              🖨 Print
            </button>
          </div>

          {/* Incoming Records */}
          <div style={{ marginTop: 20 }}>
            <div className="records-section-title">Incoming Material Records</div>
            <div className="twrap">
              <table>
                <thead>
                  <tr>
                    <th>Record No</th>
                    <th>Date</th>
                    <th>Time In</th>
                    <th>Vehicle No</th>
                    <th>Material Type</th>
                    <th>Quantity</th>
                    <th>Returnable</th>
                    <th>Authorised By</th>
                    <th>Status</th>
                    <th>Verified By</th>
                    <th>Verified At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncoming.length > 0 ? (
                    filteredIncoming.map((record) => (
                      <tr key={record._id}>
                        <td>{record.recordNo}</td>
                        <td>{record.date}</td>
                        <td>{record.timeIn || "—"}</td>
                        <td>{record.vehicleNo}</td>
                        <td>{record.materialDescription}</td>
                        <td>{record.quantity}</td>
                        <td>{record.returnable || "—"}</td>
                        <td>{record.recordedBy}</td>
                        <td>{getStatusBadge(record.status)}</td>
                        <td>{record.verifiedBy || "—"}</td>
                        <td>
                          {record.verifiedAt
                            ? new Date(record.verifiedAt).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">
                        <div className="no-records">No Incoming Records Found</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outgoing Records */}
          <div style={{ marginTop: 24 }}>
            <div className="records-section-title out">Outgoing Material Records</div>
            <div className="twrap">
              <table>
                <thead>
                  <tr>
                    <th>Record No</th>
                    <th>Date</th>
                    <th>Time Out</th>
                    <th>Vehicle No</th>
                    <th>Material Type</th>
                    <th>Quantity</th>
                    <th>Returnable</th>
                    <th>Authorised By</th>
                    <th>Status</th>
                    <th>Verified By</th>
                    <th>Verified At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOutgoing.length > 0 ? (
                    filteredOutgoing.map((record) => (
                      <tr key={record._id}>
                        <td>{record.recordNo}</td>
                        <td>{record.date}</td>
                        <td>{record.timeOut || "—"}</td>
                        <td>{record.vehicleNo}</td>
                        <td>{record.materialDescription}</td>
                        <td>{record.quantity}</td>
                        <td>{record.returnable || "—"}</td>
                        <td>{record.recordedBy}</td>
                        <td>{getStatusBadge(record.status)}</td>
                        <td>{record.verifiedBy || "—"}</td>
                        <td>
                          {record.verifiedAt
                            ? new Date(record.verifiedAt).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">
                        <div className="no-records">No Outgoing Records Found</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyRecordsPage;

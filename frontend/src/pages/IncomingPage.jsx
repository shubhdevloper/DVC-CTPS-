import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function IncomingPage() {
  const [dateTime, setDateTime] = useState("");

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const [filterType, setFilterType] = useState("month");

  const [selectedGate, setSelectedGate] = useState("All Gates");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

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

  useEffect(() => {
    fetchIncomingRecords();
  }, []);

  const fetchIncomingRecords = async () => {
    try {
      const token = localStorage.getItem("ctps_token");
      const response = await axios.get(
        "http://10.53.49.228:5000/api/incoming",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    let filtered = [...records];

    if (selectedGate !== "All Gates") {
      filtered = filtered.filter((record) => record.gate === selectedGate);
    }

    if (filterType === "month") {
      filtered = filtered.filter((record) => {
        const parts = record.date.split("-");
        const monthIndex = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        const monthName = new Date(year, monthIndex).toLocaleString("default", {
          month: "long",
        });
        return monthName === selectedMonth && year === Number(selectedYear);
      });
    }

    if (filterType === "date" && fromDate && toDate) {
      filtered = filtered.filter((record) => {
        const recordDate = record.date.split("-").reverse().join("-");
        return recordDate >= fromDate && recordDate <= toDate;
      });
    }

    setFilteredRecords(filtered);
    setShowResults(true);
  };

  const handleClear = () => {
    setShowResults(false);
    setFilteredRecords([]);
    setSelectedGate("All Gates");
    setFilterType("month");
    setSelectedMonth(
      new Date().toLocaleString("default", { month: "long" })
    );
    setSelectedYear(new Date().getFullYear());
    setFromDate("");
    setToDate("");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incoming Records");
    XLSX.writeFile(workbook, "incoming-register.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="bdg bdg-pending">Pending</span>;
    const s = status.toLowerCase();
    if (s === "verified")
      return <span className="bdg bdg-verified">{status}</span>;
    if (s === "rejected")
      return <span className="bdg bdg-rejected">{status}</span>;
    return <span className="bdg bdg-pending">{status}</span>;
  };

  // console.log(records);
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 10px" }}>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep"> › </span>
        <span className="bc-cur">Incoming Material Register</span>
      </div>

      {/* Page Title Bar */}
      <div className="page-title-bar" style={{ marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <h2>Incoming Material Register</h2>
          <p>Complete Incoming Material Register — all gates</p>
        </div>
        <div className="page-title-bar-right">{dateTime}</div>
      </div>

      {/* Filter Panel */}
      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <h4>Incoming Material Register — Filter &amp; Search</h4>
        </div>
        <div className="panel-body">

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab${filterType === "month" ? " active" : ""}`}
              onClick={() => setFilterType("month")}
            >
              Filter by Month
            </button>
            <button
              className={`tab${filterType === "date" ? " active" : ""}`}
              onClick={() => setFilterType("date")}
            >
              Filter by Date Range
            </button>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            {filterType === "month" ? (
              <>
                <div className="ff">
                  <label>GATE</label>
                  <select
                    value={selectedGate}
                    onChange={(e) => setSelectedGate(e.target.value)}
                  >
                    <option>All Gates</option>
                    <option>Gate A</option>
                    <option>Gate B</option>
                    <option>Gate C</option>
                    <option>Gate D</option>
                    <option>Main Gate</option>
                  </select>
                </div>

                <div className="ff">
                  <label>MONTH</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {[
                      "January","February","March","April","May","June",
                      "July","August","September","October","November","December",
                    ].map((month) => (
                      <option key={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="ff">
                  <label>YEAR</label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  />
                </div>

                <div className="ff" style={{ justifyContent: "flex-end" }}>
                  <label style={{ visibility: "hidden" }}>-</label>
                  <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                  </button>
                </div>

                <div className="ff" style={{ justifyContent: "flex-end" }}>
                  <label style={{ visibility: "hidden" }}>-</label>
                  <button className="btn" style={{ border: "1px solid #c5cfe0" }} onClick={handleClear}>
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="ff">
                  <label>GATE</label>
                  <select
                    value={selectedGate}
                    onChange={(e) => setSelectedGate(e.target.value)}
                  >
                    <option>All Gates</option>
                    <option>Gate A</option>
                    <option>Gate B</option>
                    <option>Gate C</option>
                    <option>Gate D</option>
                    <option>Main Gate</option>
                  </select>
                </div>

                <div className="ff">
                  <label>FROM DATE</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="ff">
                  <label>TO DATE</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="ff" style={{ justifyContent: "flex-end" }}>
                  <label style={{ visibility: "hidden" }}>-</label>
                  <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                  </button>
                </div>

                <div className="ff" style={{ justifyContent: "flex-end" }}>
                  <label style={{ visibility: "hidden" }}>-</label>
                  <button className="btn" style={{ border: "1px solid #c5cfe0" }} onClick={handleClear}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <>
          {/* Export Bar */}
          <div className="export-bar" style={{ marginTop: 18, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 12, color: "#444" }}>
              <strong style={{ color: "#003087" }}>{filteredRecords.length}</strong>{" "}
              incoming records — Gate:{" "}
              <strong style={{ color: "#003087" }}>{selectedGate}</strong>
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-sm"
                style={{ border: "1px solid #2e7d32", color: "#2e7d32", background: "#f1f8e9" }}
                onClick={downloadExcel}
              >
                ↓ Download (CSV/Excel)
              </button>
              <button
                className="btn btn-sm"
                style={{ border: "1px solid #c5cfe0" }}
                onClick={handlePrint}
              >
                🖨 Print
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="records-section-title">📋 Incoming Material Register</div>

          <div className="twrap">
            <table>
              <thead>
                <tr>
                  <th>Sl No.</th>
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
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
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
                      <td>{getStatusBadge(record.status)}</td>
                      <td>{record.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="no-records">
                      No records found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}

export default IncomingPage;

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "text",
    content: "",
    linkUrl: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("ctps_token");
      const { data } = await axios.get(
        "http://10.53.49.228:5000/api/announcements",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("ctps_token");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("content", formData.content);
      data.append("linkUrl", formData.linkUrl);
      data.append("expiresAt", formData.expiresAt);
      if (formData.type === "pdf" && pdfFile) {
        data.append("pdf", pdfFile);
      }
      await axios.post(
        "http://10.53.49.228:5000/api/announcements",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Success", "Announcement Created", "success");
      setFormData({ title: "", type: "text", content: "", linkUrl: "", expiresAt: "" });
      setPdfFile(null);
      fetchAnnouncements();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create announcement",
        "error"
      );
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      const token = localStorage.getItem("ctps_token");
      await axios.delete(
        `http://10.53.49.228:5000/api/announcements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep"> › </span>
        <span className="bc-cur">Announcement Management</span>
      </div>

      {/* Page Title Bar */}
      <div className="page-title-bar">
        <h2>Announcement Management</h2>
        <p>Create and manage notices visible to all users</p>
      </div>

      {/* Create Announcement Panel */}
      <div className="panel" style={{ marginTop: "16px" }}>
        <div className="panel-head">
          <h4>Create New Announcement</h4>
        </div>
        <div className="panel-body">
          <form onSubmit={handleSubmit}>
            <div className="ff">
              <label>Announcement Title</label>
              <input
                type="text"
                name="title"
                placeholder="Announcement Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ff">
              <label>Notice Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="text">Text Notice</option>
                <option value="pdf">PDF Notice</option>
                <option value="link">Link Notice</option>
              </select>
            </div>

            {formData.type === "text" && (
              <div className="ff">
                <label>Content</label>
                <textarea
                  name="content"
                  placeholder="Announcement Content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="3"
                  style={{
                    padding: "7px 10px",
                    fontSize: "13px",
                    border: "1px solid #c5cfe0",
                    background: "#f8faff",
                    borderRadius: "3px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            )}

            {formData.type === "pdf" && (
              <div className="ff">
                <label>Upload PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </div>
            )}

            {formData.type === "link" && (
              <div className="ff">
                <label>Website URL</label>
                <input
                  type="text"
                  name="linkUrl"
                  placeholder="https://example.com"
                  value={formData.linkUrl}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="ff">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Announcement
            </button>
          </form>
        </div>
      </div>

      {/* Existing Announcements Panel */}
      <div className="panel" style={{ marginTop: "16px" }}>
        <div className="panel-head">
          <h4>Existing Announcements</h4>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="twrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Expiry</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {announcements.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="no-records">No announcements found</div>
                    </td>
                  </tr>
                ) : (
                  announcements.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td style={{ textTransform: "capitalize" }}>{item.type}</td>
                      <td>{new Date(item.expiresAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteAnnouncement(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsPage;

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

function RecordOutgoingPage() {
  const { user } = useAuth();

  const [showValidationError, setShowValidationError] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNo: "",
    gatePassNo: "",
    gatePassDate: "",
    materialType: "",
    customMaterialType: "",
    materialDescription: "",
    quantity: "",
    purpose: "",
    authorisedBy: "",
    returnable: "",
    remarks: "",
  });

  const currentDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const currentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

  const materialOptions = [
    "Cable", "Electrical Equipment", "Mechanical Spare", "Pipe",
    "Valve", "Bearing", "Lubricant", "Chemical",
    "Construction Material", "Safety Equipment", "Tool",
    "Document", "Consumable", "Others",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (showValidationError) setShowValidationError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid =
      formData.quantity.trim() &&
      formData.materialType.trim() &&
      formData.materialDescription.trim() &&
      formData.authorisedBy.trim() &&
      formData.gatePassNo.trim();

    if (!isFormValid) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);

    try {
      const token = localStorage.getItem("ctps_token");

      await axios.post(
        "https://dvc-ctps.onrender.com/api/outgoing",
        {
          vehicleNo: formData.vehicleNo,
          gatePassNo: formData.gatePassNo,
          gatePassDate: formData.gatePassDate,
          materialType: formData.materialType === "Others" ? formData.customMaterialType : formData.materialType,
          materialDescription: formData.materialDescription,
          quantity: Number(formData.quantity),
          purpose: formData.purpose,
          authorisedBy: formData.authorisedBy,
          returnable: formData.returnable,
          remarks: formData.remarks,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Outgoing Entry Recorded Successfully",
        confirmButtonColor: "#cc3300",
      });

      setFormData({
        vehicleNo: "", gatePassNo: "", gatePassDate: "",
        materialType: "", customMaterialType: "", materialDescription: "",
        quantity: "", purpose: "", authorisedBy: "", returnable: "", remarks: "",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to record outgoing entry",
      });
    }
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="bc-home">DVC — C.T.P.S. Chandrapura</span>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Record Outgoing Material</span>
      </div>

      {/* Panel */}
      <div className="panel">
        <div className="page-title-bar" style={{ borderRadius: "3px 3px 0 0", marginBottom: 0 }}>
          <div>
            <h2>Record Outgoing Material</h2>
            <p>Fill in all details as per the Outgoing Material Register</p>
          </div>
          <div className="page-title-bar-right">{new Date().toLocaleString()}</div>
        </div>

        <div className="panel-head" style={{ borderRadius: 0 }}>
          <h4>Outgoing Material Register — Record New Entry</h4>
        </div>

        <div className="panel-body">
          {showValidationError && (
            <div className="alert alert-err" style={{ display: "block" }}>
              Please fill all required fields marked with *
            </div>
          )}

          {/* Row 1 */}
          <div className="fg3">
            <div className="ff">
              <label>DATE <span className="req">*</span></label>
              <input value={currentDate} readOnly style={{ background: "#eef1f7" }} />
            </div>
            <div className="ff">
              <label>TIME OUT <span className="req">*</span></label>
              <input value={currentTime} readOnly style={{ background: "#eef1f7" }} />
            </div>
            <div className="ff">
              <label>VEHICLE NO.</label>
              <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} placeholder="e.g. MH-12-AB-1234" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="fg3">
            <div className="ff">
              <label>GATE PASS NO. <span className="req">*</span></label>
              <input type="text" name="gatePassNo" value={formData.gatePassNo} onChange={handleChange} placeholder="Gate pass number" />
            </div>
            <div className="ff">
              <label>GATE PASS DATE</label>
              <input type="date" name="gatePassDate" value={formData.gatePassDate} onChange={handleChange} />
            </div>
            <div className="ff">
              <label>QUANTITY <span className="req">*</span></label>
              <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 10 Nos / 50 Kg" />
            </div>
          </div>

          {/* Material Type */}
          <div className="ff">
            <label>MATERIAL TYPE <span className="req">*</span></label>
            <select name="materialType" value={formData.materialType} onChange={handleChange}>
              <option value="">Select Material Type</option>
              {materialOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {formData.materialType === "Others" && (
            <div className="ff">
              <label>SPECIFY MATERIAL TYPE</label>
              <input type="text" name="customMaterialType" value={formData.customMaterialType} onChange={handleChange} placeholder="Enter Material Type" />
            </div>
          )}

          {/* Description */}
          <div className="ff">
            <label>DESCRIPTION OF MATERIALS <span className="req">*</span></label>
            <textarea rows="3" name="materialDescription" value={formData.materialDescription} onChange={handleChange} placeholder="Describe the materials going out..." />
          </div>

          {/* Row 3 */}
          <div className="fg2">
            <div className="ff">
              <label>DESTINATION</label>
              <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Enter destination" />
            </div>
            <div className="ff">
              <label>AUTHORISED BY <span className="req">*</span></label>
              <input type="text" name="authorisedBy" value={formData.authorisedBy} onChange={handleChange} placeholder="Name of authorizing officer" />
            </div>
          </div>

          {/* Returnable */}
          <div className="ff">
            <label>RETURNABLE</label>
            <select name="returnable" value={formData.returnable} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="ff">
            <label>REMARKS</label>
            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Additional notes" />
          </div>

          <button type="submit" className="btn btn-danger" onClick={handleSubmit}>
            Record Outgoing Entry
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecordOutgoingPage;

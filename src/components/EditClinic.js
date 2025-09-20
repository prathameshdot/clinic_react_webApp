import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CCol,
  CButton,
} from "@coreui/react";

const EditClinic = () => {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const navigate = useNavigate();
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}clinics/${id}`, {
          headers: { Authorization: "Bearer YOUR_API_KEY" },
        });
        if (response.status === 200) {
          setClinic(response.data);
        } else {
          console.error("Failed to fetch clinic. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching clinic:", error);
      }
    };

    fetchClinic();
  }, [id]);

  const handleSave = async () => {
    try {
      // Convert mobile number to number if it's not null or undefined
      const updatedClinic = {
        ...clinic,
        mobile: clinic.mobile ? Number(clinic.mobile) : null,
      };

      const response = await axios.put(
        `${config.apiUrl}clinics/${id}`,
        updatedClinic,
        {
          headers: { Authorization: "Bearer YOUR_API_KEY" },
        },
      );
      console.log("Clinic updated successfully:", response.data);
      navigate("/clinics"); // Redirect to the clinics list page
    } catch (error) {
      console.error("Error updating clinic:", error);
    }
  };

  const togglePasswordVisibility = (clinicId) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [clinicId]: !prevState[clinicId],
    }));
  };

  if (!clinic) return <p>Loading...</p>;

  return (
    <CCard className="mb-5" style={{ width: "100%", maxHeight: "70%" }}>
      <CCardHeader style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Update Clinic Details</span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/clinics")}
        >
          Close
        </button>
      </CCardHeader>
      <CCardBody>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <CCol md={2}>
            <CFormLabel htmlFor="clinicName">Clinic Name</CFormLabel>
            <input
              type="text"
              id="clinicName"
              className="form-control"
              value={clinic.name || ""}
              onChange={(e) => setClinic({ ...clinic, name: e.target.value })}
            />
          </CCol>

          <CCol md={2}>
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <input
              type="text"
              id="address"
              className="form-control"
              value={clinic.address || ""}
              onChange={(e) =>
                setClinic({ ...clinic, address: e.target.value })
              }
            />
          </CCol>

          <CCol md={2}>
            <CFormLabel htmlFor="detail">Detail</CFormLabel>
            <textarea
              id="detail"
              className="form-control"
              value={clinic.detail || ""}
              onChange={(e) => setClinic({ ...clinic, detail: e.target.value })}
            />
          </CCol>

          <CCol md={2}>
            <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
            <input
              type="text"
              id="mobile"
              className="form-control"
              value={clinic.mobile || ""}
              onChange={(e) => setClinic({ ...clinic, mobile: e.target.value })}
            />
          </CCol>
          <CCol md={2}>
            <CFormLabel htmlFor="password">Password</CFormLabel>
            <div style={{ position: "relative" }}>
              <input
                type={visiblePasswords[clinic.id] ? "text" : "password"}
                id="password"
                className="form-control"
                value={clinic.password || ""}
                onChange={(e) =>
                  setClinic({ ...clinic, password: e.target.value })
                }
                style={{ paddingRight: "2.5rem" }}
              />
              <span
                onClick={() => togglePasswordVisibility(clinic.id)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {visiblePasswords[clinic.id] ? (
                  <AiFillEyeInvisible />
                ) : (
                  <AiFillEye />
                )}
              </span>
            </div>
          </CCol>
        </div>
        <div className="modal-footer">
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
          <CButton color="secondary" onClick={() => navigate("/clinics")}>
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default EditClinic;

// EditClinicMedicines.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CCol, CFormLabel, CButton } from "@coreui/react";
import { useParams, useNavigate } from "react-router-dom";

const EditClinicMedicines = () => {
  const { medicineId } = useParams(); // Get medicineId from route parameters
  const navigate = useNavigate();
  const [medicineDetails, setMedicineDetails] = useState({
    medicineName: "",
    medicineType: "",
    medicineContents: "",
    manufacturer: "",
    formType: "",
    dosage: "",
  });

  useEffect(() => {
    fetchMedicineDetails();
  }, []);

  const fetchMedicineDetails = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine/${medicineId}`);
      setMedicineDetails(response.data);
    } catch (error) {
      console.error("Error fetching medicine details:", error);
      toast.error("Error fetching medicine details.", { autoClose: 3000 });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicineDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${config.apiUrl}medicine/${medicineId}`, medicineDetails);
      toast.success("Updated Successfully!", { autoClose: 3000 });
      navigate(`/clinicMedicine/${medicineDetails.clinicId}`); // Redirect after save
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast.error("Error updating medicine.", { autoClose: 3000 });
    }
  };

  return (
    <CCard className="mb-5">
      <CCardHeader>Update Medicine Details</CCardHeader>
      <CCardBody>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <CCol md={3}>
            <CFormLabel htmlFor="medicineName">Medicine Name</CFormLabel>
            <input
              type="text"
              id="medicineName"
              name="medicineName"
              className="form-control"
              value={medicineDetails.medicineName}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="medicineType">Medicine Type</CFormLabel>
            <input
              type="text"
              id="medicineType"
              name="medicineType"
              className="form-control"
              value={medicineDetails.medicineType}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="medicineContents">Medicine Contents</CFormLabel>
            <input
              type="text"
              id="medicineContents"
              name="medicineContents"
              className="form-control"
              value={medicineDetails.medicineContents}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="manufacturer">Manufacturer</CFormLabel>
            <input
              type="text"
              id="manufacturer"
              name="manufacturer"
              className="form-control"
              value={medicineDetails.manufacturer}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="formType">Form Type</CFormLabel>
            <input
              type="text"
              id="formType"
              name="formType"
              className="form-control"
              value={medicineDetails.formType}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={3}>
            <CFormLabel htmlFor="dosage">Dosage</CFormLabel>
            <input
              type="text"
              id="dosage"
              name="dosage"
              className="form-control"
              value={medicineDetails.dosage}
              onChange={handleChange}
            />
          </CCol>
        </div>
        <div className="modal-footer">
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
          <CButton color="secondary" onClick={() => navigate(-1)}>
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default EditClinicMedicines;

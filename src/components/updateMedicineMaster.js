import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CFormLabel,
  CButton,
} from "@coreui/react";

const UpdateMedicineMaster = () => {
  const { medicineId } = useParams();
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicineDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${config.apiUrl}medicine/${medicineId}`,
        medicineDetails,
      );
      toast.success("Medicine updated successfully!", { autoClose: 3000 });
      navigate("/medicineMaster");
    } catch (error) {
      console.error("Error updating medicine details:", error);
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>Update Medicine Details</CCardHeader>
      <CCardBody>
        <form onSubmit={handleSubmit}>
          <CCol md={12}>
            <CFormLabel htmlFor="medicineName">Medicine Name</CFormLabel>
            <input
              type="text"
              className="form-control"
              id="medicineName"
              name="medicineName"
              value={medicineDetails.medicineName}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="medicineType">Medicine Type</CFormLabel>
            <input
              type="text"
              className="form-control"
              id="medicineType"
              name="medicineType"
              value={medicineDetails.medicineType}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="medicineContents">
              Medicine Contents
            </CFormLabel>
            <input
              type="text"
              className="form-control"
              id="medicineContents"
              name="medicineContents"
              value={medicineDetails.medicineContents}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="manufacturer">Manufacturer</CFormLabel>
            <input
              type="text"
              className="form-control"
              id="manufacturer"
              name="manufacturer"
              value={medicineDetails.manufacturer}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="formType">Form Type</CFormLabel>
            <input
              type="text"
              className="form-control"
              id="formType"
              name="formType"
              value={medicineDetails.formType}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel htmlFor="dosage">Dosage</CFormLabel>
            <input
              type="text"
              className="form-control"
              id="dosage"
              name="dosage"
              value={medicineDetails.dosage}
              onChange={handleInputChange}
              required
            />
          </CCol>
          <CButton type="submit" color="primary" style={{ marginTop: "10px" }}>
            Update Medicine
          </CButton>
        </form>
      </CCardBody>
    </CCard>
  );
};

export default UpdateMedicineMaster;

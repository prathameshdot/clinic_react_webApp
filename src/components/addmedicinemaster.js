import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../config";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CButton,
} from "@coreui/react";

const AddMedicine = () => {
  const [validated, setValidated] = useState(false);
  const [medicine, setMedicine] = useState({
    medicineName: "",
    medicineType: "",
    medicineContents: "",
    manufacturer: "",
    formType: "",
    dosage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // state to track form submission

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMedicine({ ...medicine, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || isSubmitting) {
      // Check if already submitting
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true); // Set submitting to true

    try {
      const res = await axios.post(
        `${config.apiUrl}medicine/createMedicineclinic`,
        {
          medicineName: medicine.medicineName,
          medicineType: medicine.medicineType,
          medicineContents: medicine.medicineContents,
          manufacturer: medicine.manufacturer,
          formType: medicine.formType,
          dosage: medicine.dosage,
        },
      );

      if (res.status === 200) {
        window.alert("Medicine added successfully");
        form.reset();
      } else {
        throw new Error("Failed to add medicine");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to add medicine. Please try again later.");
    }

    setIsSubmitting(false); // Reset submitting to false
    setValidated(true);
  };

  return (
    <CCard className="mb-5">
      <CCardHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <span style={{ lineHeight: "44px" }}>Add Medicine</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/medicineMaster" className="btn btn-primary">
              Back
            </Link>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 ml needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={4}>
            <CFormLabel htmlFor="medicineName">Medicine Name</CFormLabel>
            <CFormInput
              type="text"
              id="medicineName"
              name="medicineName"
              value={medicine.medicineName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter medicine name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="medicineType">Medicine Type</CFormLabel>
            <CFormInput
              type="text"
              id="medicineType"
              name="medicineType"
              value={medicine.medicineType}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter medicine type.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="medicineContents">
              Medicine Contents
            </CFormLabel>
            <CFormInput
              type="text"
              id="medicineContents"
              name="medicineContents"
              value={medicine.medicineContents}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter medicine contents.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="manufacturer">Manufacturer</CFormLabel>
            <CFormInput
              type="text"
              id="manufacturer"
              name="manufacturer"
              value={medicine.manufacturer}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter manufacturer.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="formType">Form Type</CFormLabel>
            <CFormSelect
              id="formType"
              name="formType"
              value={medicine.formType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Form Type</option>
              <option value="TAB">TAB</option>
              <option value="CAP">CAP</option>
              <option value="SYP">SYP</option>
              <option value="INF">INF</option>
            </CFormSelect>
            <CFormFeedback invalid>Please select a form type.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="dosage">Dosage</CFormLabel>
            <CFormInput
              type="text"
              id="dosage"
              name="dosage"
              value={medicine.dosage}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter dosage.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol xs={8} />

          <CCol xs={8}>
            <CButton color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Medicine..." : "Add Medicine"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddMedicine;

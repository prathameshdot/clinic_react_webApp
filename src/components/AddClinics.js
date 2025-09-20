import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import config from "../config"; // Update this path according to your project structure

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CButton,
} from "@coreui/react";

const AddClinic = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [clinic, setClinic] = useState({
    name: "",
    address: "",
    detail: "",
    mobile: "",
    password: "", // Add password field to state
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClinic({ ...clinic, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const res = await axios.post(`${config.apiUrl}clinics`, {
        name: clinic.name,
        address: clinic.address,
        detail: clinic.detail,
        mobile: clinic.mobile,
        password: clinic.password, // Include password in request
      });

      if (res.status === 200) {
        window.alert("Clinic added successfully");
        form.reset();
        setClinic({
          name: "",
          address: "",
          detail: "",
          mobile: "",
          password: "", // Reset password field
        });
        navigate("/Clinics");
        setValidated(false); // Reset validation state after successful submission
      } else {
        throw new Error("Failed to add clinic");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to add clinic. Please try again later.");
    }
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
        <span style={{ lineHeight: "44px" }}>Add Clinic</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/Clinics" className="btn btn-primary">
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
          <CCol md={6}>
            <CFormLabel htmlFor="name">Clinic Name</CFormLabel>
            <CFormInput
              type="text"
              id="name"
              name="name"
              value={clinic.name}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the clinic name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={6}>
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <CFormInput
              type="text"
              id="address"
              name="address"
              value={clinic.address}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the address.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={6}>
            <CFormLabel htmlFor="detail">Detail</CFormLabel>
            <CFormTextarea
              id="detail"
              name="detail"
              value={clinic.detail}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the detail.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={6}>
            <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
            <CFormInput
              type="tel"
              id="mobile"
              name="mobile"
              value={clinic.mobile}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter a valid mobile number.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={6}>
            <CFormLabel htmlFor="password">Password</CFormLabel>
            <CFormInput
              type="password"
              id="password"
              name="password"
              value={clinic.password}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter a password.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol xs={8}>
            <CButton color="primary" type="submit">
              Submit
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddClinic;

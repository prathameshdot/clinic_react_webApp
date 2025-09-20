import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { Link } from "react-router-dom";
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

const AddService = () => {
  const [validated, setValidated] = useState(false);
  const [service, setService] = useState({
    serviceName: "",
    charge: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || isSubmitting) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);
    alert(service.categoryId);
    try {
      const res = await axios.post(`${config.apiUrl}service`, {
        serviceName: service.serviceName,
        charge: parseInt(service.charge),
        categoryId: service.categoryId,
      });

      if (res.status === 200) {
        // Assuming 201 is the correct status for successful creation
        window.alert("Service added successfully");
        form.reset();
        setValidated(false);
      } else {
        throw new Error("Failed to add service");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to add service. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setValidated(true);
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
        <span style={{ lineHeight: "44px" }}>Add Appointment</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/services" className="btn btn-primary">
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
            <CFormLabel htmlFor="serviceName">Service Name</CFormLabel>
            <CFormInput
              type="text"
              id="serviceName"
              name="serviceName"
              value={service.serviceName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter service name.</CFormFeedback>
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="charge">Charge</CFormLabel>
            <CFormInput
              type="text"
              id="charge"
              name="charge"
              value={service.charge}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter charge.</CFormFeedback>
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="categoryId">Category</CFormLabel>
            <CFormSelect
              id="categoryId"
              name="categoryId"
              value={service.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </CFormSelect>
            <CFormFeedback invalid>Please select a category.</CFormFeedback>
          </CCol>

          <CCol xs={12}>
            <CButton color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Service..." : "Add Service"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddService;

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  CButton,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

const ClinicAddService = () => {
  const { clinicId } = useParams();
  const [validated, setValidated] = useState(false);
  const [service, setService] = useState({
    serviceName: "",
    charge: "",
    categoryId: "",
    clinicId: clinicId,
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again later.");
    }
  };

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
    try {
      // Ensure charge is a number
      const postData = {
        ...service,
        charge: parseInt(service.charge, 10),
      };

      const res = await axios.post(
        `${config.apiUrl}service/createServiceForClinicId`,
        postData,
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("Response:", res); // Log the entire response for debugging
      if (res.status === 200 || res.status === 201) { // Adjust the success condition
        toast.success("Service successfully submitted!"); // Show success toast
        form.reset();
        setValidated(false);
        navigate(`/clinicService/${clinicId}`);
      } else {
        throw new Error("Failed to add service"); // Catch unexpected status codes
      }
    } catch (error) {
      console.error("Error:", error); // Log the error for debugging

      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Master service already exists"
      ) {
        toast.error("The service already exists. Please choose a different name or category.");
      } else {
        toast.error("Failed to add service. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
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
        <span style={{ lineHeight: "44px" }}>Add Service</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to={`/ClinicService/${clinicId}`} className="btn btn-primary">
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
            <CFormLabel htmlFor="serviceName">Service Name</CFormLabel>
            <CFormInput
              type="text"
              id="serviceName"
              name="serviceName"
              value={service.serviceName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter a service name.</CFormFeedback>
          </CCol>

          <CCol md={4}>
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

          <CCol md={4}>
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </CCard>
  );
};

export default ClinicAddService;

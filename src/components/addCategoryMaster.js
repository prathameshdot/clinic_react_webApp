import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  CButton,
} from "@coreui/react";

const AddCategory = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate(); // Add this line

  const [category, setCategory] = useState({
    categoryName: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategory({ ...category, [name]: value });
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
      const res = await axios.post(`${config.apiUrl}category`, {
        categoryName: category.categoryName,
      });

      if (res.status === 200) {
        window.alert("Category submitted successfully");
        form.reset();
        setCategory({ categoryName: "" });
        setValidated(false); // Reset validation state after successful submission
        navigate("/CategoryMaster");
      } else {
        throw new Error("Failed to submit category");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit category. Please try again later.");
      navigate("/CategoryMaster");
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
        <span style={{ lineHeight: "44px" }}>Add Category</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/CategoryMaster" className="btn btn-primary">
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
            <CFormLabel htmlFor="categoryName">Category Name</CFormLabel>
            <CFormInput
              type="text"
              id="categoryName"
              name="categoryName"
              value={category.categoryName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the category name.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol xs={4} />
          <CCol xs={4} />

          <CCol xs={4}>
            <CButton color="primary" type="submit">
              Submit
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddCategory;

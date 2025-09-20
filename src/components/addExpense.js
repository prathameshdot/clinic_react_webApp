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
  CFormTextarea,
  CButton,
} from "@coreui/react";

const AddExpense = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [expense, setExpense] = useState({
    name: "",
    description: "",
    date: "",
    responsiblePerson: "",
    clinicId: "4",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpense({ ...expense, [name]: value });
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
      const res = await axios.post(`${config.apiUrl}expense`, {
        name: expense.name,
        description: expense.description,
        date: expense.date,
        responsiblePerson: expense.responsiblePerson,
      });

      if (res.status === 200) {
        window.alert("Expense submitted successfully");
        form.reset();
        setExpense({
          name: "",
          description: "",
          date: "",
          responsiblePerson: "",
          clinicId: "4",
        });
        setValidated(false); // Reset validation state after successful submission
        navigate("/Expense"); //
      } else {
        throw new Error("Failed to submit expense");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit expense. Please try again later.");
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
        <span style={{ lineHeight: "44px" }}>Add Expense</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/expense" className="btn btn-primary">
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
            <CFormLabel htmlFor="name">Expense Name</CFormLabel>
            <CFormInput
              type="text"
              id="name"
              name="name"
              value={expense.name}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the expense name.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="responsiblePerson">
              Responsible Person
            </CFormLabel>
            <CFormInput
              type="text"
              id="responsiblePerson"
              name="responsiblePerson"
              value={expense.responsiblePerson}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the responsible person.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="date">Date</CFormLabel>
            <CFormInput
              type="date"
              id="date"
              name="date"
              value={expense.date}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the date.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={6}>
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              value={expense.description}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the description.</CFormFeedback>
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

export default AddExpense;

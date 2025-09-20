import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../config";

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

const ClinicAddExpense = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clinicId } = useParams();
  const [expense, setExpense] = useState({
    name: "",
    description: "",
    date: "",
    responsiblePerson: "",
    clinicId: clinicId,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Additional validation for date
    if (new Date(expense.date) < new Date()) {
      window.alert("The date cannot be in the past.");
      return;
    }

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${config.apiUrl}expense/clinicForCreateExpense`,
        {
          name: expense.name,
          description: expense.description,
          date: expense.date,
          responsiblePerson: expense.responsiblePerson,
          clinicId: clinicId,
        },
      );

      if (res.status === 200) {
        window.alert("Expense submitted successfully");
        setExpense({
          name: "",
          description: "",
          date: "",
          responsiblePerson: "",
          clinicId: clinicId,
        });
        setValidated(false);
        navigate(`/clinicExpense/${clinicId}`);
      } else {
        throw new Error("Failed to submit expense");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit expense. Please try again later.");
    } finally {
      setLoading(false);
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
          <Link to={`/clinicExpense/${clinicId}`} className="btn btn-primary">
            Back
          </Link>
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
          </CCol>

          <CCol xs={8}>
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ClinicAddExpense;

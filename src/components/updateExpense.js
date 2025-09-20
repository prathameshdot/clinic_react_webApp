// src/components/UpdateExpense.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  CCard,
  CButton,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CCol,
} from "@coreui/react";
import config from "../config";

const UpdateExpense = () => {
  const { expenseId } = useParams(); // Get expense ID from URL parameters
  const [expense, setExpense] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}expense/${expenseId}`,
        );
        if (response.status === 200) {
          setExpense(response.data);
        } else {
          console.error("Failed to fetch expense. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching expense:", error);
      }
    };

    fetchExpense();
  }, [expenseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${config.apiUrl}expense/${expenseId}`, expense);
      navigate("/expense"); // Redirect to expenses list after saving
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <CCard className="mb-5">
      <CCardHeader>Update Expense</CCardHeader>
      <CCardBody>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <CCol md={4}>
            <CFormLabel htmlFor="name">Expense Name</CFormLabel>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={expense.name}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={expense.description}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="date">Date</CFormLabel>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={expense.date}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="responsiblePerson">
              Responsible Person
            </CFormLabel>
            <input
              type="text"
              id="responsiblePerson"
              name="responsiblePerson"
              className="form-control"
              value={expense.responsiblePerson}
              onChange={handleChange}
            />
          </CCol>
        </div>
        <div className="mt-3">
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
          <CButton
            color="secondary"
            className="ml-2"
            onClick={() => navigate("/expense")}
          >
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UpdateExpense;

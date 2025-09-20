import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
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
  CFormSelect,
  CRow,
  CButton,
} from "@coreui/react";

const ClinicAddMedicine = () => {
  const { clinicId } = useParams();

  const [validated, setValidated] = useState(false);
  const [medicine, setMedicine] = useState({
    medicineName: "",
    medicineType: "",
    medicineContents: "",
    manufacturer: "",
    formType: "",
    dosage: "",
    clinicId: clinicId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMedicine({ ...medicine, [name]: value });
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
      const res = await axios.post(
        `${config.apiUrl}medicine/createMedicineforClinic`,
        {
          medicineName: medicine.medicineName,
          medicineType: medicine.medicineType,
          medicineContents: medicine.medicineContents,
          manufacturer: medicine.manufacturer,
          formType: medicine.formType,
          dosage: medicine.dosage,
          clinicId: clinicId, // Corrected the typo here
        },
      );

      if (res.status === 201) {
        // 201 for created
        window.alert("Medicine added successfully");
        form.reset();
        setMedicine({
          medicineName: "",
          medicineType: "",
          medicineContents: "",
          manufacturer: "",
          formType: "",
          dosage: "",
          clinicId: clinicId,
        });
      } else {
        throw new Error("Failed to add medicine");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to add medicine. Please try again later.");
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
        <span style={{ lineHeight: "44px" }}>Add Medicine</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to={`/clinicmedicine/${clinicId}`} className="btn btn-primary">
            Back
          </Link>
        </div>
      </CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          {[
            "medicineName",
            "medicineType",
            "medicineContents",
            "manufacturer",
            "dosage",
          ].map((field, index) => (
            <CCol md={4} key={index}>
              <CFormLabel htmlFor={field}>
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </CFormLabel>
              <CFormInput
                type="text"
                id={field}
                name={field}
                value={medicine[field]}
                onChange={handleInputChange}
                required
              />
              <CFormFeedback
                invalid={`Please enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`}
              ></CFormFeedback>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
          ))}
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

export default ClinicAddMedicine;

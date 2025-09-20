import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import Select from "react-select";

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

const ClinicAppointmentEdit = () => {
  const { id } = useParams(); // Get the appointment ID from the URL
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    patientId: "",
    doctorId: "",
    clinicId: "",
    appointmentDate: "",
    appointmentTime: "",
    status: "",
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAppointment();
      await fetchPatients();
      await fetchDoctors();
    };

    fetchData();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}appointment/${id}`);
      if (response.status === 200) {
        const data = response.data;
        setAppointment({
          appointmentId: data.appointmentId, // Ensure this is set
          patientId: data.patientId,
          doctorId: data.doctor.id, // Extract doctorId from doctor object
          clinicId: data.clinicId,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          status: data.status, // If required
        });
        console.log("Fetched Appointment:", data);
      } else {
        console.error("Failed to fetch appointment. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const clinicId = localStorage.getItem("clinicID");
      if (clinicId) {
        const response = await axios.get(
          `${config.apiUrl}patients/findAllPatientsByClinicId/${clinicId}`,
        );
        if (response.status === 200) {
          setPatients(response.data);
          console.log("Fetched Patients:", response.data); // Debugging
        } else {
          console.error("Failed to fetch patients. Status:", response.status);
        }
      } else {
        console.error("Clinic ID not found in local storage.");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const clinicId = localStorage.getItem("clinicID");
      if (clinicId) {
        const response = await axios.get(
          `${config.apiUrl}doctor/findAllDoctorsByClinicId/${clinicId}`,
        );
        if (response.status === 200) {
          setDoctors(response.data);
          console.log("Fetched Doctors:", response.data); // Debugging
        } else {
          console.error("Failed to fetch doctors. Status:", response.status);
        }
      } else {
        console.error("Clinic ID not found in local storage.");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    // Ensure appointmentId is included
    const appointmentPayload = {
      appointmentId: appointment.appointmentId, // Must not be null
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      clinicId: appointment.clinicId,
      patientName: appointment.patientName, // If required
      patientMobile: appointment.patientMobile, // If required
      status: appointment.status, // If required
    };

    try {
      const res = await axios.put(
        `${config.apiUrl}appointment/editForClinic`,
        appointmentPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.status === 200) {
        window.alert("Appointment updated successfully!");
        navigate(`/clinicAppointmentDetails/${appointment.clinicId}`);
      } else {
        throw new Error("Failed to update appointment data");
      }
    } catch (error) {
      console.error(
        "Error updating appointment:",
        error.response?.data || error.message,
      );
      window.alert(
        "Failed to update appointment data. Please try again later.",
      );
    }
  };

  return (
    <CCard className="mb-5">
      <CCardHeader>Edit Appointment</CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={3}>
            <CFormLabel htmlFor="patientId">Select Patient</CFormLabel>
            <select
              id="patientId"
              name="patientId"
              className="form-select"
              value={appointment.patientId || ""} // Ensure value is an empty string if undefined
              onChange={handleInputChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
            <CFormFeedback invalid>Please select a patient.</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="patientMobile">Patient Mobile</CFormLabel>
            <input
              type="text"
              id="patientMobile"
              className="form-control"
              value={appointment.mobile || ""}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  mobile: e.target.value,
                })
              }
            />
          </CCol>

          <CCol md={3}>
            <CFormLabel htmlFor="doctorId">Select Doctor</CFormLabel>
            <select
              id="doctorId"
              name="doctorId"
              className="form-select"
              value={appointment.doctorId || ""} // Ensure value is an empty string if undefined
              onChange={handleInputChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName}
                </option>
              ))}
            </select>
            <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
          </CCol>

          <CCol md={3}>
            <CFormLabel htmlFor="appointmentDate">Appointment Date</CFormLabel>
            <CFormInput
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={appointment.appointmentDate || ""} // Ensure value is an empty string if undefined
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please select the appointment date.
            </CFormFeedback>
          </CCol>

          <CCol md={3}>
            <CFormLabel htmlFor="appointmentTime">Appointment Time</CFormLabel>
            <CFormInput
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={appointment.appointmentTime || ""} // Ensure value is an empty string if undefined
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please select the appointment time.
            </CFormFeedback>
          </CCol>
          <CCol md={3}>
            <CFormLabel>Status</CFormLabel>
            <Select
              value={{
                label: appointment.status,
                value: appointment.status,
              }}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "status", value: e.value },
                })
              }
              options={[
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </CCol>
          <CCol xs={12}>
            <CButton color="primary" type="submit">
              Update Appointment
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ClinicAppointmentEdit;

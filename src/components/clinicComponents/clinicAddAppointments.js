import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  CButton,
} from "@coreui/react";

const ClinicAppointment = () => {
  const { clinicId } = useParams();
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    patientId: "",
    doctorId: "",
    clinicId: clinicId,
    appointmentDate: "",
    appointmentTime: "00:00",
  });

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const clinicId = localStorage.getItem("clinicID"); // Retrieve the ID from local storage
      if (clinicId) {
        const response = await axios.get(
          `${config.apiUrl}patients/findAllPatientsByClinicId/${clinicId}`,
        );
        console.log("Patients response:", response); // Debugging log
        if (response.status === 200) {
          setPatients(response.data);
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

  // Call fetchPatients when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to render patient options
  const renderPatientOptions = () => {
    return patients.map((patient) => (
      <option key={patient.id} value={patient.id}>
        {patient.fullName}
      </option>
    ));
  };

  const fetchDoctors = async () => {
    try {
      const clinicId = localStorage.getItem("clinicID"); // Retrieve the ID from local storage
      if (clinicId) {
        const response = await axios.get(
          `${config.apiUrl}doctor/findAllDoctorsByClinicId/${clinicId}`,
        );
        if (response.status === 200) {
          setDoctors(response.data);
        }
      } else {
        console.error("Clinic ID not found in local storage.");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Call fetchDoctors when the component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}appointment`);
      if (response.status === 200) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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

    try {
      const res = await axios.post(
        `${config.apiUrl}appointment/createForClinic`,
        {
          ...appointment,
          status: "Scheduled",
        },
      );
      if (res.status === 200) {
        window.alert("Appointment data submitted successfully!");
        setSubmitted(true);
        form.reset();
        setValidated(false);
        navigate(`/clinicAppointmentDetails/${clinicId}`);
      } else {
        throw new Error("Failed to submit appointment data");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      window.alert(
        "Failed to submit appointment data. Please try again later.",
      );
    }
  };

  const getDoctorAppointments = (doctorId) => {
    return appointments.filter((appt) => appt.doctor.id === doctorId);
  };

  const getUnavailableTimes = (doctorId, appointmentDate) => {
    const doctorAppointments = getDoctorAppointments(doctorId);
    const appointmentsOnDate = doctorAppointments.filter(
      (appt) =>
        appt.appointmentDate === appointmentDate &&
        (appt.status === "Pending" || appt.status === "Scheduled"),
    );
    return appointmentsOnDate.map((appt) => appt.appointmentTime);
  };

  const renderDoctorOptions = () => {
    return doctors.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.fullName}
      </option>
    ));
  };

  const renderDateOptions = () => {
    const today = new Date().toISOString().split("T")[0];
    return (
      <CFormInput
        type="date"
        id="appointmentDate"
        name="appointmentDate"
        value={appointment.appointmentDate}
        min={today}
        onChange={handleInputChange}
        required
      />
    );
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
            <Link
              to={`/ClinicAppointmentDetails/${clinicId}`}
              className="btn btn-primary"
            >
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
            <CFormLabel htmlFor="doctorId">Select Patient</CFormLabel>
            <select
              id="patientId"
              name="patientId"
              className="form-select"
              value={appointment.patientId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Patient</option>
              {renderPatientOptions()}
            </select>
            <CFormFeedback invalid>
              Please enter the patient's name.
            </CFormFeedback>
          </CCol>
          {/* <CCol md={4}>
            <CFormLabel htmlFor="patientMobile">Patient Mobile</CFormLabel>
            <CFormInput
              type="text"
              id="patientMobile"
              name="patientMobile"
              value={appointment.patientMobile}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the patient's mobile number.
            </CFormFeedback>
          </CCol> */}
          <CCol md={4}>
            <CFormLabel htmlFor="doctorId">Select Doctor</CFormLabel>
            <select
              id="doctorId"
              name="doctorId"
              className="form-select"
              value={appointment.doctorId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Doctor</option>
              {renderDoctorOptions()}
            </select>
            <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="appointmentDate">Appointment Date</CFormLabel>
            {renderDateOptions()}
            <CFormFeedback invalid>
              Please select the appointment date.
            </CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="appointmentTime">Appointment Time</CFormLabel>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              className="form-control"
              value={appointment.appointmentTime}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please select the appointment time.
            </CFormFeedback>
          </CCol>

          <CCol xs={4} />
          <CCol xs={4} />
          <CCol xs={4}>
            <CButton color="primary" type="submit" disabled={submitted}>
              {submitted ? "Appointment Submitted" : "Submit Appointment"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ClinicAppointment;

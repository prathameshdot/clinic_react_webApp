import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormSelect,
  CFormLabel,
  CRow,
  CFormInput,
  CButton,
} from "@coreui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Set up localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const AddAppointment = () => {
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointment, setAppointment] = useState({
    doctorId: "",
    patientId: "",
    appointmentDate: "",
    appointmentTime: "",
    status: "Scheduled",
    clinicId: 1,
  });
  const [calendarHeight, setCalendarHeight] = useState("500px");
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get(`${config.apiUrl}patients`);
        setPatients(patientsRes.data);

        const doctorsRes = await axios.get(`${config.apiUrl}doctor`);
        setDoctors(doctorsRes.data);

        const appointmentsRes = await axios.get(`${config.apiUrl}appointment`);
        const appts = appointmentsRes.data.map((appt) => {
          const doctorFullName = appt.doctor
            ? appt.doctor.fullName
            : "Unknown Doctor";
          const patientFullName = appt.patient
            ? appt.patient.fullName
            : "Unknown Patient";

          return {
            title: `${patientFullName} with ${doctorFullName}`,
            start: new Date(`${appt.appointmentDate}T${appt.appointmentTime}`),
            end: new Date(
              `${appt.appointmentDate}T${moment(appt.appointmentTime, "HH:mm")
                .add(30, "minutes")
                .format("HH:mm")}`,
            ),
            status: appt.status,
          };
        });
        setAppointments(appts);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message,
        );
        window.alert(
          "An error occurred while fetching data. Please try again.",
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formRef.current) {
      const formHeight = formRef.current.offsetHeight;
      setCalendarHeight(`${formHeight}px`);
    }
  }, [formRef.current]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointment({ ...appointment, [name]: value });
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
      const existingAppointments = await axios.get(
        `${config.apiUrl}appointment`,
      );
      const isDuplicate = existingAppointments.data.some(
        (appt) =>
          appt.patientId === appointment.patientId &&
          appt.doctorId === appointment.doctorId &&
          ((appt.appointmentDate === appointment.appointmentDate &&
            appt.appointmentTime === appointment.appointmentTime) ||
            appt.appointmentDate === appointment.appointmentDate),
      );

      if (isDuplicate) {
        window.alert(
          "Appointment already exists for this patient with the same doctor at the same time or date.",
        );
        return;
      }

      const res = await axios.post(`${config.apiUrl}appointment`, appointment);

      if (res.status === 200) {
        form.reset();
        setAppointment({
          doctorId: "",
          patientId: "",
          appointmentDate: "",
          appointmentTime: "",
          status: "Scheduled",
          clinicId: 1,
        });
        setValidated(false);
        window.alert("Appointment added successfully!");
        navigate("/AppointmentDetails");
      } else {
        throw new Error("Failed to add appointment");
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      );
      window.alert("Failed to add appointment. Please try again later.");
    }

    setValidated(true);
  };

  // Inline styles for event types
  const eventStyles = {
    scheduled: {
      backgroundColor: "#a8d08d", // Light green
      color: "black",
      padding: "0px",
      borderRadius: "0px",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "block",
    },
    completed: {
      backgroundColor: "#8c8c8c", // Light gray
      color: "black",
      padding: "0px",
      borderRadius: "0px",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "block",
    },
    cancelled: {
      backgroundColor: "#f4cccc", // Light red
      color: "black",
      padding: "0px",
      borderRadius: "0px",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "block",
    },
    pending: {
      backgroundColor: "#d5a6a4", // Light coral
      color: "black",
      padding: "0px",
      borderRadius: "0px",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      display: "block",
    },
  };

  const EventWrapper = ({ event }) => (
    <div style={eventStyles[event.status.toLowerCase()]}>
      <strong>{event.title}</strong>
    </div>
  );

  return (
    <CRow>
      <CCol md={8}>
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
                <Link to="/AppointmentDetails" className="btn btn-primary">
                  Back
                </Link>
              </div>
            </div>
          </CCardHeader>
          <CCardBody ref={formRef}>
            <CForm
              className="row g-3 ml needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={4}>
                <CFormLabel htmlFor="doctorId">Doctor</CFormLabel>
                <CFormSelect
                  id="doctorId"
                  name="doctorId"
                  value={appointment.doctorId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName} ({doctor.specialization})
                    </option>
                  ))}
                </CFormSelect>
                <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="patientId">Patient Name</CFormLabel>
                <CFormSelect
                  id="patientId"
                  name="patientId"
                  value={appointment.patientId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName}
                    </option>
                  ))}
                </CFormSelect>
                <CFormFeedback invalid>Please select a patient.</CFormFeedback>
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="appointmentDate">
                  Appointment Date
                </CFormLabel>
                <CFormInput
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={appointment.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
                <CFormFeedback invalid>
                  Please select appointment date.
                </CFormFeedback>
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="appointmentTime">
                  Appointment Time
                </CFormLabel>
                <CFormInput
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={appointment.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
                <CFormFeedback invalid>
                  Please select appointment time.
                </CFormFeedback>
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="status">Status</CFormLabel>
                <CFormSelect
                  id="status"
                  name="status"
                  value={appointment.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </CFormSelect>
                <CFormFeedback invalid>Please select status.</CFormFeedback>
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
              <CCol xs={12}>
                <CButton type="submit" color="primary">
                  Submit
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={4}>
        <CCard className="mb-5">
          <CCardHeader>Appointments Calendar</CCardHeader>
          <CCardBody>
            <div style={{ height: calendarHeight }}>
              <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", width: "100%" }}
                components={{ event: EventWrapper }}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddAppointment;

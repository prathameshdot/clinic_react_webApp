import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import config from "../config";
import { useNavigate, useParams } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CFormLabel,
  CButton,
} from "@coreui/react";

const EditAppointment = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointment();
    fetchDoctors();
    fetchPatients();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}appointment/${appointmentId}`,
      );
      setAppointment(response.data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Error fetching appointment details. Please try again.");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Error fetching doctors. Please try again.");
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Error fetching patients. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      // Ensure all necessary data is present in the appointment object
      const updatedAppointment = {
        ...appointment,
        doctorId: appointment.doctor?.id || "",
        patientId: appointment.patientId || "",
      };

      console.log("Updating appointment with data:", updatedAppointment);

      const response = await axios.put(
        `${config.apiUrl}appointment/${appointmentId}`,
        updatedAppointment,
      );

      if (response.status === 200) {
        toast.success("Updated Successfully!", { autoClose: 3000 });
        navigate("/appointmentDetails");
      } else {
        throw new Error("Failed to update appointment.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment. Please try again.");
    }
  };

  if (!appointment) return <div>Loading...</div>;

  return (
    <CCard>
      <CCardHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <span>Update Appointment Details</span>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md={4}>
            <CFormLabel htmlFor="patientId">Select Patient</CFormLabel>
            <Select
              id="patientId"
              name="patientId"
              options={patients.map((patient) => ({
                value: patient.id,
                label: patient.fullName,
                mobile: patient.mobile,
              }))}
              value={
                appointment.patientId
                  ? {
                      value: appointment.patientId,
                      label: appointment.fullName,
                      mobile: appointment.mobile,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setAppointment((prev) => ({
                  ...prev,
                  patientId: selectedOption?.value || "",
                  fullName: selectedOption?.label || "",
                  mobile: selectedOption?.mobile || "",
                }));
              }}
              isClearable
            />
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
          <CCol md={4}>
            <CFormLabel htmlFor="doctorId">Select Doctor</CFormLabel>
            <Select
              id="doctorId"
              name="doctorId"
              options={doctors.map((doctor) => ({
                value: doctor.id, // Use the doctor id for value
                label: doctor.fullName, // Display the full name
              }))}
              value={
                appointment.doctor?.id
                  ? {
                      value: appointment.doctor.id,
                      label: appointment.doctor.fullName,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setAppointment((prev) => ({
                  ...prev,
                  doctorId: selectedOption?.value || "",
                  doctor: {
                    id: selectedOption?.value || "",
                    fullName: selectedOption?.label || "",
                  },
                }))
              }
            />
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={4}>
            <CFormLabel htmlFor="appointmentDate">Appointment Date</CFormLabel>
            <input
              type="date"
              id="appointmentDate"
              className="form-control"
              value={appointment.appointmentDate || ""}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointmentDate: e.target.value,
                })
              }
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="appointmentTime">Appointment Time</CFormLabel>
            <input
              type="time"
              id="appointmentTime"
              className="form-control"
              value={appointment.appointmentTime || ""}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointmentTime: e.target.value,
                })
              }
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <select
              id="status"
              className="form-control"
              value={appointment.status || ""}
              onChange={(e) =>
                setAppointment({ ...appointment, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </CCol>
        </CRow>
        <div style={{ marginTop: "20px" }}>
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
          <CButton
            color="secondary"
            onClick={() => navigate("/appointmentDetails")}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default EditAppointment;

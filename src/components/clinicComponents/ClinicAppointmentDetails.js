import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CFormLabel,
  CForm,
  CButton,
  CFormFeedback,
} from "@coreui/react";
import Draggable from "react-draggable";
import { CSVLink } from "react-csv";
import { Link, useParams } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";

const ClinicAppointmentDetails = () => {
  const { clinicId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const [selectedAppointment, setSelectedAppointment] = useState({
    patientName: "",
    patientMobile: "",
    doctorId: "",
    patientId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentId: "",
    status: "pending",
    clinicId: clinicId,
  });

  useEffect(() => {
    fetchData();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}patients/findAllPatientsByClinicId/${clinicId}`,
      );
      console.log("Patients response:", response); // Debugging log
      if (response.status === 200) {
        setPatients(response.data);
      } else {
        console.error("Failed to fetch patients. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}doctor/findAllDoctorsByClinicId/${clinicId}`,
      );
      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    setFilteredAppointments(
      appointments.filter((appointment) =>
        Object.values(appointment).some((value) =>
          typeof value === "string"
            ? value.toLowerCase().includes(searchInput.toLowerCase())
            : typeof value === "number" &&
              value.toString().includes(searchInput),
        ),
      ),
    );
  }, [searchInput, appointments]);

  useEffect(() => {
    setCSVData(
      appointments.map((appointment) => ({
        "Appointment ID": appointment.appointmentId,
        "Patient Name": appointment.patientName,
        "Patient Mobile": appointment.patientMobile,
        "Appointment Date": appointment.appointmentDate,
        "Appointment Time": appointment.appointmentTime,
        Status: appointment.status,
      })),
    );
  }, [appointments]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}appointment/findAllAppointmentsByClinicId/${clinicId}`,
      );

      if (response.status === 200) {
        setAppointments(response.data);
      } else {
        console.error("Failed to fetch appointments. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch appointments. Please try again later.");
    }
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedAppointment({ ...selectedAppointment, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${config.apiUrl}editForClinic/${selectedAppointment.appointmentId}`,
        selectedAppointment,
      );
      setShowEditModal(false);
      fetchData(); // Fetch updated data after save
      toast.success("Updated Successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating appointment:", error);
      // Handle error - show toast message or any other UI indication
    }
  };

  // const handleEdit = (appointmentId) => {
  //   const appointment = appointments.find(
  //     (appointment) => appointment.appointmentId === appointmentId,
  //   );
  //   setSelectedAppointment(appointment);
  //   setShowEditModal(true);
  // };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`${config.apiUrl}appointment/${appointmentId}`);
        fetchData(); // Fetch updated data after deletion
        toast.success("Appointment deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting appointment:", error);
        // Handle error - show toast message or any other UI indication
      }
    }
  };

  const renderDoctorOptions = () => {
    return doctors.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.fullName}
      </option>
    ));
  };

  const renderPatientOptions = () => {
    return patients.map((patient) => (
      <option key={patient.id} value={patient.id}>
        {patient.fullName}
      </option>
    ));
  };

  const handleEdit = (appointmentId) => {
    alert("HI" + appointmentId);
    navigate(`/EditClinicAppointmentDetails/${appointmentId}`);
  };

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Appointment Details</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={toggleSearchBar}
              style={{ marginRight: "10px" }}
            >
              <CIcon icon={cilSearch} />
            </button>
            <div className={`input-group ${searchBarVisible ? "" : "d-none"}`}>
              <input
                type="text"
                placeholder="Search appointment details"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link
                to={`/ClinicAddAppointments/${clinicId}`}
                className="btn btn-primary"
              >
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"appointment_data.csv"}>
                <CIcon icon={cilCloudDownload} size="lg" />
              </CSVLink>
            </div>
          </div>
        </CCardHeader>
        <CCardBody style={{ overflowY: "auto" }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Actions</th>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Patient Mobile</th>
                <th>Doctor Name</th>
                <th> Date</th>
                <th> Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.appointmentId}>
                  <td style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        title="Edit Appointment"
                        onClick={() => handleEdit(appointment.appointmentId)}
                      >
                        <AiFillEdit />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        title="Delete"
                        onClick={() => handleDelete(appointment.appointmentId)}
                      >
                        <FaTrash />
                      </CButton>
                    </div>
                  </td>
                  <td>{appointment.appointmentId}</td>
                  <td>{appointment.fullName}</td>
                  <td>{appointment.mobile}</td>
                  <td>{appointment.doctor.fullName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      {/* Edit Modal */}
      {selectedAppointment && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{
              display: showEditModal ? "block" : "none",
              position: "fixed",
              top: "5%",
              left: "20%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CCard className="mb-5" style={{ width: "50%", maxHeight: "90vh" }}>
              <CCardHeader
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <span style={{ lineHeight: "44px" }}>
                  Update Appointment Details
                </span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
              </CCardHeader>
              <CCardBody>
                <CForm>
                  <CCol md={4}>
                    <CFormLabel htmlFor="doctorId">Select Patient</CFormLabel>
                    <select
                      id="patientId"
                      name="patientId"
                      className="form-select"
                      value={selectedAppointment.patientId}
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
                  <CCol md={6}>
                    <CFormLabel>Patient Mobile</CFormLabel>
                    <input
                      type="text"
                      name="patientMobile"
                      value={selectedAppointment.patientMobile}
                      className="form-control"
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Appointment Date</CFormLabel>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={selectedAppointment.appointmentDate}
                      className="form-control"
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Appointment Time</CFormLabel>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={selectedAppointment.appointmentTime}
                      className="form-control"
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Status</CFormLabel>
                    <Select
                      value={{
                        label: selectedAppointment.status,
                        value: selectedAppointment.status,
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
                </CForm>
                <CButton
                  color="primary"
                  onClick={handleSave}
                  style={{ marginTop: "20px" }}
                >
                  Save
                </CButton>
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default ClinicAppointmentDetails;

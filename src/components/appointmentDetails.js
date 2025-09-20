import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../config";
import { useNavigate } from "react-router-dom";
import { CCard, CCardHeader, CCardBody, CButton } from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import moment from "moment"; // Import moment.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchDoctors();
    fetchPatients();
  }, []);

  useEffect(() => {
    const sortedAppointments = [...appointments].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredAppointments(
      sortedAppointments.filter((appointment) =>
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
        "Patient Name": appointment.fullName || "N/A",
        "Patient Mobile": appointment.mobile || "N/A",
        "Appointment Date": appointment.appointmentDate || "N/A",
        "Appointment Time":
          moment(appointment.appointmentTime, "HH:mm:ss").format("hh:mm A") ||
          "N/A",
        Status: appointment.status || "N/A",
      })),
    );
  }, [appointments]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}appointment`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownloadExcel = async () => {
    const input = document.getElementById("excel-content");
    if (!input) {
      console.error("Element with id 'excel-content' not found.");
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Get the table data
    const table = input.querySelector("table");
    const rows = table.querySelectorAll("tr");

    // Add header row
    const headerRow = worksheet.addRow(
      [...rows[0].querySelectorAll("th")].map((th) => th.innerText),
    );
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Yellow background
      };
      cell.font = {
        bold: true, // Bold text
      };
    });

    // Add the rest of the rows
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip the header row
      const rowData = [...row.querySelectorAll("td")].map((td) => td.innerText);
      worksheet.addRow(rowData);
    });

    // Adjust column width
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    // Generate and trigger the download
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "Appointments.xlsx");
    });
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleEdit = (appointmentId) => {
    navigate(`/updateAppointments/${appointmentId}`);
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axios.delete(`${config.apiUrl}appointment/${appointmentId}`);
        fetchData(); // Refresh data after deletion
        toast.success("Appointment deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast.error("Failed to delete appointment. Please try again.");
      }
    }
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
              <Link to="/addappointment" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <div className="input-group-append">
                <CIcon
                  icon={cilCloudDownload}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  size="lg"
                  onClick={handleDownloadExcel}
                />
              </div>
            </div>
          </div>
        </CCardHeader>

        <CCardBody id="excel-content" style={{ overflowY: "auto" }}>
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Patient Mobile</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.appointmentId}>
                      <td style={{ alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <CButton
                            color="info"
                            variant="outline"
                            size="sm"
                            title="Edit Appointment"
                            onClick={() =>
                              handleEdit(appointment.appointmentId)
                            }
                          >
                            <AiFillEdit />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            title="Delete"
                            onClick={() =>
                              handleDelete(appointment.appointmentId)
                            }
                          >
                            <FaTrash />
                          </CButton>
                        </div>
                      </td>
                      <td>{appointment.appointmentId}</td>
                      <td>{appointment.fullName || "N/A"}</td>
                      <td>{appointment.mobile || "N/A"}</td>
                      <td>{appointment.doctor.fullName || "N/A"}</td>
                      <td>{appointment.appointmentDate || "N/A"}</td>
                      <td>
                        {moment(appointment.appointmentTime, "HH:mm:ss").format(
                          "hh:mm A",
                        ) || "N/A"}
                      </td>
                      <td>{appointment.status || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No appointments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Appointment;

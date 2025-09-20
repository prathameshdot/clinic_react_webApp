import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs"; // Import ExcelJS library
import { CSVLink } from "react-csv";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import config from "../config";
import {
  CCard,
  CButton,
  CCardBody,
  CCardHeader,
  CTable,
  CFormLabel,
} from "@coreui/react";

const ReportScreen = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [csvData, setCSVData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(""); // Add selectedPatientId state

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}doctor`);
        if (response.status === 200) {
          setDoctors(response.data);
        } else {
          console.error(
            "Failed to fetch doctors. Status code:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}patients`);
        if (response.status === 200) {
          setPatients(response.data);
        } else {
          console.error(
            "Failed to fetch patients. Status code:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchDoctors();
    fetchPatients();
  }, []);

  const handleDateChange = (date, isFromDate) => {
    if (isFromDate) {
      setFromDate(date);
    } else {
      setToDate(date);
    }
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const getReport = async () => {
    if (fromDate && toDate && (selectedDoctorId || selectedPatientId)) {
      const apiUrl = `${config.apiUrl}treatment/getReport`;

      const filters = {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      };

      if (selectedDoctorId) {
        filters.doctorId = selectedDoctorId;
      }

      if (selectedPatientId) {
        filters.patientId = selectedPatientId;
      }

      try {
        const response = await axios.post(apiUrl, filters);

        if (response.status === 200) {
          const treatments = response.data;

          // Filter treatments based on selectedDoctorId and selectedPatientId
          const filteredTreatments = treatments.filter((treatment) => {
            const matchDoctor =
              !selectedDoctorId ||
              treatment.doctor.id === parseInt(selectedDoctorId);
            const matchPatient =
              !selectedPatientId ||
              treatment.patient.id === parseInt(selectedPatientId);
            return matchDoctor && matchPatient;
          });

          // Generate Excel and CSV data for filtered treatments
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet("Report");

          // Add headers
          sheet.addRow([
            "Treatment ID",
            "Patient Name",
            "Doctor Name",
            "Treatment Date",
            "Services",
            "Charges",
          ]);

          let totalGrandCharge = 0.0;

          filteredTreatments.forEach((treatment) => {
            // Add rows for each treatment
            let totalCharge = 0.0;
            let concatenatedNames = "";

            treatment.treatmentItemDetailsList.forEach((itemDetails) => {
              try {
                totalCharge += itemDetails.serviceItem.charge;
              } catch (error) {
                console.error("Error parsing charge:", error);
              }

              concatenatedNames += `${itemDetails.serviceItem.serviceName}, `;
            });

            totalGrandCharge += totalCharge;

            sheet.addRow([
              treatment.id,
              treatment.patient.fullName,
              treatment.doctor.fullName,
              treatment.treatmentDate,
              concatenatedNames,
              totalCharge,
            ]);
          });

          sheet.addRow(["Total", "", "", "", "", totalGrandCharge]);

          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "clinic_treatment_report.xlsx");

          setReportData(filteredTreatments);

          setCSVData(
            filteredTreatments.map((treatment) => ({
              "Treatment ID": treatment.id,
              "Patient Name": treatment.patient.fullName,
              "Doctor Name": treatment.doctor.fullName,
              "Treatment Date": treatment.treatmentDate,
              Services: treatment.treatmentItemDetailsList
                .map((itemDetails) => itemDetails.serviceItem.serviceName)
                .join(", "),
              Charges: treatment.treatmentItemDetailsList.reduce(
                (total, itemDetails) => total + itemDetails.serviceItem.charge,
                0,
              ),
            })),
          );
        } else {
          console.error(
            "Failed to submit report. Status code:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    } else {
      console.log(
        "Please select From Date, To Date, and either a Doctor or a Patient",
      );
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

  const inputStyle = {
    width: "150px",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  return (
    <div>
      <CCard className="mb-3">
        <CCardHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ lineHeight: "44px" }}>Generate Report</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleSearchBar}
                style={{ marginRight: "10px" }}
              >
                <CIcon icon={cilSearch} />
              </button>
              <div
                className={`input-group ${searchBarVisible ? "" : "d-none"}`}
              >
                <input
                  type="text"
                  placeholder="Search service details"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control"
                  style={{ height: "30px", marginRight: "10px", ...inputStyle }}
                />
              </div>
              <div
                className="input-group-append"
                style={{ marginRight: "10px" }}
              >
                <CSVLink
                  data={csvData}
                  filename={"clinic_treatment_report.xlsx"}
                >
                  <CIcon icon={cilCloudDownload} size="lg" />
                </CSVLink>
              </div>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <div
            className="form-inline"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          ></div>

          <div
            className="form-inline"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div className="form-group mx-3" style={formGroupStyle}>
              <CFormLabel htmlFor="fromDate">From Date</CFormLabel>
              <input
                type="date"
                id="fromDate"
                value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  handleDateChange(new Date(e.target.value), true)
                }
                className="form-control"
                style={inputStyle}
              />
            </div>
            <div className="form-group mx-3" style={formGroupStyle}>
              <CFormLabel htmlFor="toDate">To Date</CFormLabel>
              <input
                type="date"
                id="toDate"
                value={toDate ? toDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  handleDateChange(new Date(e.target.value), false)
                }
                className="form-control"
                style={inputStyle}
              />
            </div>
            <div className="form-group mx-3" style={formGroupStyle}>
              <CFormLabel htmlFor="doctor">Doctor</CFormLabel>
              <select
                id="doctor"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="form-control"
                style={inputStyle}
              >
                <option value="">Select Doctor</option>
                {renderDoctorOptions()}
              </select>
            </div>
            <div className="form-group mx-3" style={formGroupStyle}>
              <CFormLabel htmlFor="patient">Patient</CFormLabel>
              <select
                id="patient"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="form-control"
                style={inputStyle}
              >
                <option value="">Select Patient</option>
                {renderPatientOptions()}
              </select>
            </div>
            <div className="form-group mx-3" style={formGroupStyle}>
              <CFormLabel style={{ visibility: "hidden" }}>
                Get Report
              </CFormLabel>
              <CButton color="primary" onClick={getReport}>
                Get Report
              </CButton>
            </div>
          </div>
        </CCardBody>
      </CCard>
      {reportData.length > 0 && (
        <CCard>
          <CCardBody>
            <CTable
              hover
              striped
              responsive
              className="table-outline mb-0 d-none d-sm-table"
            >
              <thead className="thead-light">
                <tr>
                  <th>Treatment ID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Treatment Date</th>
                  <th>Services</th>
                  <th>Charges</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((treatment) => (
                  <tr key={treatment.id}>
                    <td>{treatment.id}</td>
                    <td>{treatment.patient.fullName}</td>
                    <td>{treatment.doctor.fullName}</td>
                    <td>{treatment.treatmentDate}</td>
                    <td>
                      {treatment.treatmentItemDetailsList
                        .map(
                          (itemDetails) => itemDetails.serviceItem.serviceName,
                        )
                        .join(", ")}
                    </td>
                    <td>
                      {treatment.treatmentItemDetailsList.reduce(
                        (total, itemDetails) =>
                          total + itemDetails.serviceItem.charge,
                        0,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
      )}
    </div>
  );
};

export default ReportScreen;

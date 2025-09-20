import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { Link, useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import lottieHeart from "../assets/Lottie/lottieClinic.json";

const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const patientsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const offset = (currentPage - 1) * patientsPerPage;
    setFilteredPatients(patients.slice(offset, offset + patientsPerPage));
  }, [patients, currentPage]);

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
      saveAs(blob, "Patients.xlsx");
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const formatDateOfBirth = (dob) => {
    const date = new Date(dob);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    const filtered = patients.filter((patient) =>
      patient.fullName.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredPatients(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`${config.apiUrl}patients/${id}`);
        fetchData();
        toast.success("Deleted Successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/updatePatient/${id}`);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Player
          autoplay
          loop
          src={lottieHeart}
          style={{ height: "300px", width: "300px" }}
        />
      </div>
    );
  }

  return (
    <CRow className="">
      <CCol xs={15} lg={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Patient List</strong>
            <div className="d-flex align-items-center">
              <CButton color="info" className="me-2" onClick={toggleSearchBar}>
                <CIcon icon={cilSearch} />
              </CButton>

              <Link to="/addpatient">
                <CButton color="primary">Add New Patient</CButton>
              </Link>
              <div>
                <CIcon
                  icon={cilCloudDownload}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  size="lg"
                  onClick={handleDownloadExcel}
                />
              </div>
            </div>
          </CCardHeader>

          <CCardBody id="excel-content">
            {searchBarVisible && (
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={searchInput}
                  onChange={handleSearch}
                />
              </div>
            )}
            <div
              style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
            >
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Full Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Clinic Name</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPatients.map((patient, index) => (
                    <CTableRow key={patient.id}>
                      <CTableDataCell style={{ alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <CButton
                            color="info"
                            variant="outline"
                            size="sm"
                            title="Edit"
                            onClick={() => handleEdit(patient.id)}
                          >
                            <AiFillEdit />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            title="Delete"
                            onClick={() => handleDelete(patient.id)}
                          >
                            <FaTrash />
                          </CButton>
                        </div>
                      </CTableDataCell>
                      <CTableHeaderCell scope="row">
                        {index + 1 + (currentPage - 1) * patientsPerPage}
                      </CTableHeaderCell>
                      <CTableDataCell>{patient.fullName}</CTableDataCell>
                      <CTableDataCell>{patient.mobile}</CTableDataCell>
                      <CTableDataCell>{patient.email}</CTableDataCell>
                      <CTableDataCell>{patient.gender}</CTableDataCell>
                      <CTableDataCell>{patient.address}</CTableDataCell>
                      <CTableDataCell>{patient.clinicName}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>

            {/* Add pagination controls */}
            <nav>
              <ul className="pagination pagination-sm justify-content-center">
                {Array.from(
                  { length: Math.ceil(patients.length / patientsPerPage) },
                  (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        i + 1 === currentPage ? "active" : ""
                      }`}
                      ṇ
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Patient;

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { Link, useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
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
// import lottieHeart from "../../assets/Lottie/lotieeHeart.json";

const OPD = () => {
  const [patients, setPatients] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [csvData, setCSVData] = useState([]);
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

  useEffect(() => {
    setCSVData(
      patients.map((patient) => ({
        Id: patient.id,
        "Full Name": patient.fullName,
        Mobile: patient.mobile,
        Email: patient.email,
        Address: patient.address,
        Gender: patient.gender,
        "Date of Birth": formatDateOfBirth(patient.dob),
        Age: patient.age,
        Weight: patient.weight,
        "Blood Group": patient.bloodGroup,
        "Last Visit": formatDateOfBirth(patient.lastVisit),
        "Next Visit": formatDateOfBirth(patient.nextVisit),
        "Medical History": patient.medicalHistory,
        clinicName: patient.clinicName,
      })),
    );
  }, [patients]);

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
        {/* <Player
          autoplay
          loop
          src={lottieHeart}
          style={{ height: "300px", width: "300px" }}
        /> */}
      </div>
    );
  }

  return (
    <CRow className="">
      <CCol xs={15} lg={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>OPD List</strong>
            <div>
              <CButton color="info" className="me-2" onClick={toggleSearchBar}>
                <CIcon icon={cilSearch} />
              </CButton>
              <CSVLink
                data={csvData}
                filename="patient-list.csv"
                className="btn btn-success me-2"
              >
                <CIcon icon={cilCloudDownload} />
              </CSVLink>
              <Link to="/AddOpd">
                <CButton color="primary">Add OPD</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
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
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  <CTableHeaderCell scope="col">S.No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                  <CTableHeaderCell scope="col">DOB</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Occupation</CTableHeaderCell>
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
                    <CTableDataCell>{patient.address}</CTableDataCell>
                    <CTableDataCell>{patient.age}</CTableDataCell>
                    <CTableDataCell>{patient.gender}</CTableDataCell>
                    <CTableDataCell>
                      {formatDateOfBirth(patient.dob)}
                    </CTableDataCell>
                    <CTableDataCell>{patient.occupation}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
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

export default OPD;

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { CCard, CCardHeader, CCardBody, CButton } from "@coreui/react";
import { CSVLink } from "react-csv";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { Link, useNavigate } from "react-router-dom";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredDoctors(
      doctors.filter((doctor) =>
        Object.values(doctor).some((value) => {
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchInput.toLowerCase())
          ) {
            return true;
          }
          if (
            typeof value === "number" &&
            value.toString().includes(searchInput)
          ) {
            return true;
          }
          return false;
        }),
      ),
    );
  }, [searchInput, doctors]);

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
      saveAs(blob, "Doctor.xlsx");
    });
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);

      console.log(response);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (doctorId) => {
    navigate(`/updateDoctor/${doctorId}`);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`${config.apiUrl}doctor/${doctorId}`);
        fetchData();
        toast.success("Doctor deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting doctor:", error);
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
          <span style={{ lineHeight: "44px" }}>Doctor Details</span>
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
                placeholder="Search doctor details"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addDoctor" className="btn btn-primary">
                Add
              </Link>
            </div>
            <div className="input-group-append">
              <CIcon
                icon={cilCloudDownload}
                style={{ marginLeft: "8px", cursor: "pointer" }}
                size="lg"
                onClick={handleDownloadExcel}
              />
            </div>
          </div>
        </CCardHeader>
        <CCardBody id="excel-content" style={{ overflowY: "auto" }}>
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>Id</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Contact No</th>
                  <th>Gender</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Address</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Postal Code</th>
                  <th>Qualification</th>
                  <th>Registration No.</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td style={{ alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          title="Edit Doctor"
                          onClick={() => handleEdit(doctor.id)}
                        >
                          <AiFillEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          title="Delete"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doctor.id)}
                        >
                          <FaTrash />
                        </CButton>
                      </div>
                    </td>
                    <td>{doctor.id}</td>
                    <td>{doctor.fullName}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.contactNo}</td>
                    <td>{doctor.gender}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.experience}</td>
                    <td>{doctor.address}</td>
                    <td>{doctor.country}</td>
                    <td>{doctor.city}</td>
                    <td>{doctor.postalCode}</td>
                    <td>{doctor.qualification}</td>
                    <td>{doctor.regNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Doctor;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { cilCloudDownload, cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import config from "../config";
import { CCard, CButton, CCardBody, CCardHeader } from "@coreui/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Clinic = () => {
  const [clinics, setClinics] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (clinicId) => {
    setVisiblePasswords((prevState) => ({
      ...prevState,
      [clinicId]: !prevState[clinicId],
    }));
  };

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}clinics`, {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        });
        if (response.status === 200) {
          setClinics(response.data);
        } else {
          console.error("Failed to fetch clinics. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  const filteredClinics = searchInput
    ? clinics.filter((clinic) =>
        Object.values(clinic).some((value) => {
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
      )
    : clinics; // If no search input, show all clinics

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleDownloadExcel = async () => {
    if (filteredClinics.length === 0) {
      alert("No clinics available to download.");
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clinics");

    // Add header row
    worksheet
      .addRow(["ID", "Name", "Address", "Detail", "Mobile", "Password"])
      .eachCell({ includeEmpty: true }, (cell, colNumber) => {
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
    filteredClinics.forEach((clinic) => {
      worksheet.addRow([
        clinic.id,
        clinic.name || "N/A",
        clinic.address || "N/A",
        clinic.detail || "N/A",
        clinic.mobile || "N/A",
        clinic.password || "N/A",
      ]);
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
      saveAs(blob, "Clinics.xlsx");
    });
  };

  const handleDelete = async (clinicId) => {
    if (window.confirm("Are you sure you want to delete this clinic?")) {
      try {
        const response = await axios.delete(
          `${config.apiUrl}clinics/${clinicId}`,
          {
            headers: { Authorization: `Bearer ${config.apiKey}` },
          },
        );
        if (response.status === 200) {
          setClinics((prevClinics) =>
            prevClinics.filter((clinic) => clinic.id !== clinicId),
          );
          console.log("Clinic deleted successfully.");
        } else {
          console.error("Failed to delete clinic. Status:", response.status);
        }
      } catch (error) {
        console.error("Error deleting clinic:", error);
        alert("Failed to delete the clinic. Please try again later.");
      }
    }
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const pageHeight = (canvas.height * imgWidth) / canvas.width;
      const pageMargin = 10;

      pdf.addImage(
        imgData,
        "PNG",
        pageMargin,
        pageMargin,
        imgWidth - 2 * pageMargin,
        pageHeight - 2 * pageMargin,
      );

      pdf.save("Clinics.pdf");
    });
  };

  return (
    <CCard className="mb-5" style={styles.card}>
      <CCardHeader style={styles.cardHeader}>
        <span style={{ lineHeight: "44px" }}>Clinics</span>
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
              placeholder="Search clinic details"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
              style={{ height: "30px", marginRight: "10px" }}
            />
          </div>
          <div className="input-group">
            <Link to="/AddClinics" className="btn btn-primary">
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
      <CCardBody id="excel-content">
        <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Detail</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id}>
                  <td style={styles.td}>{clinic.id}</td>
                  <td style={styles.td}>{clinic.name || "N/A"}</td>
                  <td style={styles.td}>{clinic.address || "N/A"}</td>
                  <td style={styles.td}>{clinic.detail || "N/A"}</td>
                  <td style={styles.td}>{clinic.mobile || "N/A"}</td>
                  <td style={styles.td}>
                    <span style={{ color: "grey" }}>
                      {visiblePasswords[clinic.id]
                        ? clinic.password || "N/A"
                        : "******"}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(clinic.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    >
                      {visiblePasswords[clinic.id] ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )}
                    </button>
                  </td>
                  <td style={styles.td}>
                    <Link to={`/editClinic/${clinic.id}`}>
                      <AiFillEdit />
                    </Link>
                    <FaTrash
                      onClick={() => handleDelete(clinic.id)}
                      style={{
                        marginLeft: "10px",
                        cursor: "pointer",
                        color: "red",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CCardBody>
    </CCard>
  );
};

const styles = {
  card: {
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderBottom: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    textAlign: "left",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
};

export default Clinic;

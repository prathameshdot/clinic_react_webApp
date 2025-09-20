import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { CCard, CCardHeader, CCardBody, CCol, CButton } from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const Medicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredMedicines(
      medicines.filter((medicine) =>
        Object.values(medicine).some((value) => {
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
  }, [searchInput, medicines]);

  const handleDownloadExcel = async () => {
    const input = document.getElementById("excel-content");
    if (!input) {
      console.error("Element with id 'excel-content' not found.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const table = input.querySelector("table");
    const rows = table.querySelectorAll("tr");

    const headerRow = worksheet.addRow(
      [...rows[0].querySelectorAll("th")].map((th) => th.innerText),
    );
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      cell.font = {
        bold: true,
      };
    });

    rows.forEach((row, index) => {
      if (index === 0) return;
      const rowData = [...row.querySelectorAll("td")].map((td) => td.innerText);
      worksheet.addRow(rowData);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "MedicineMaster.xlsx");
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleEdit = (medicineId) => {
    navigate(`/updateMedicineMaster/${medicineId}`);
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${config.apiUrl}medicine/${medicineId}`);
        fetchData();
        toast.success("Medicine deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting medicine:", error);
      }
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Medicine Details</span>
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
                placeholder="Search medicine details"
                value={searchInput}
                onChange={handleSearchInputChange}
                className="form-control"
                style={{ height: "30px", marginRight: "10px" }}
              />
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <Link to="/addMedicineMaster" className="btn btn-primary">
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
                  <th>ID</th>
                  <th>Medicine Name</th>
                  <th>Medicine Type</th>
                  <th>Medicine Contents</th>
                  <th>Manufacturer</th>
                  <th>Form Type</th>
                  <th>Dosage</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.medicineId}>
                    <td style={{ alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          title="Edit Medicine"
                          onClick={() => handleEdit(medicine.medicineId)}
                        >
                          <AiFillEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          title="Delete"
                          size="sm"
                          onClick={() => handleDelete(medicine.medicineId)}
                        >
                          <FaTrash />
                        </CButton>
                      </div>
                    </td>
                    <td>{medicine.medicineId}</td>
                    <td>{medicine.medicineName}</td>
                    <td>{medicine.medicineType}</td>
                    <td>{medicine.medicineContents}</td>
                    <td>{medicine.manufacturer}</td>
                    <td>{medicine.formType}</td>
                    <td>{medicine.dosage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Medicine;

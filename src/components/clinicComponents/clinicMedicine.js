import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CFormLabel,
  CButton,
} from "@coreui/react";
import { CSVLink } from "react-csv";
import { Link, useParams } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";

const ClinicMedicine = () => {
  const { clinicId } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false);

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

  useEffect(() => {
    setCSVData(
      filteredMedicines.map((medicine) => ({
        ...medicine,
      })),
    );
  }, [filteredMedicines]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}medicine/findAllMedicineByClinicId/${clinicId}`,
      );
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

  const handleDelete = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`${config.apiUrl}medicine/${medicineId}`);
        fetchData(); // Refresh the table after deletion
        toast.success("Medicine deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting medicine:", error);
        // Handle error - show toast message or any other UI indication
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
              <Link
                to={`/clinicAddMedicine/${clinicId}`}
                className="btn btn-primary"
              >
                Add
              </Link>
            </div>
            <div className="input-group-append" style={{ marginRight: "10px" }}>
              <CSVLink data={csvData} filename={"medicine_data.csv"}>
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
                      <Link
                        to={`/editClinicMedicine/${medicine.medicineId}`}
                        className="btn btn-info btn-sm"
                        title="Edit Medicine"
                      >
                        <AiFillEdit />
                      </Link>
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
        </CCardBody>
      </CCard>
    </>
  );
};

export default ClinicMedicine;

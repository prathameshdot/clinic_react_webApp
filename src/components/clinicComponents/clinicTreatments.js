import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import $ from "jquery";
import "select2"; // Import Select2 CSS styles as well, if needed
import ViewTreatment from "./viewTreatment"; // Assuming this is where InvoicePDF is defined
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { Modal, Button } from "react-bootstrap"; // Example using react-bootstrap for modal components
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaFileMedical } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { FaRunning } from "react-icons/fa";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormLabel,
  CButton,
  CFormTextarea,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import Draggable from "react-draggable"; // Import Draggable component
import { CSVLink } from "react-csv";

import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilCloudDownload } from "@coreui/icons";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import EditTreatment from "./EditTreatment";

const ClinicTreatment = () => {
  const [treatments, setTreatments] = useState([]);
  // here assigned navigate for close modal
  const navigate = useNavigate();

  const formatDateDMY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);
  const [csvData, setCSVData] = useState([]);
  const [searchBarVisible, setSearchBarVisible] = useState(false); // Add state for search bar visibility
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [medicineNames, setMedicineNames] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl1, setImageUrl1] = useState(null);

  const handleViewTreatment = (treatmentId) => {
    // Navigate to the viewTreatment page with the treatment ID
    navigate(`/viewTreatment/${treatmentId}`);
    // Or if you use a modal
    const selectedTreatment = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    setSelectedTreatment(selectedTreatment);
    setShowViewModal(true); // Set a state to control modal visibility
  };

  const handleViewBilling = (treatmentId) => {
    // Navigate to the viewTreatment page with the treatment ID
    navigate(`/billing/${treatmentId}`);
    // Or if you use a modal
    const selectedTreatment = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    setSelectedTreatment(selectedTreatment);
    setShowViewModal(true); // Set a state to control modal visibility
  };

  const handleViewMedicalCertificate = (treatmentId) => {
    // Navigate to the viewMedicalCertificate page with the treatment ID
    navigate(`/Medical/${treatmentId}`);

    // Or if you use a modal
    const selectedTreatment = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    setSelectedTreatment(selectedTreatment);
    setShowViewModal(true); // Set a state to control modal visibility
  };

  const handleViewFitnessCertificate = (treatmentId) => {
    // Navigate to the viewFitnessCertificate page with the treatment ID
    navigate(`/Fitness/${treatmentId}`);

    // Or if you use a modal
    const selectedTreatment = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    setSelectedTreatment(selectedTreatment);
    setShowViewModal(true); // Set a state to control modal visibility
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: [],
    medicineForms: [],
    medicineName: "",
    medicineId: "",
    dosageName: "",
    durationName: "",
    description: "",
    bp: "",
    temp: "",
    spo: "",
    treatmentPhoto: null,
    treatmentPhoto1: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      saveAs(blob, "Treatment.xlsx");
    });
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchServices();
    fetchMedicineNames();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
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

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      if (selectedTreatment && selectedTreatment.treatmentPhoto) {
        try {
          const response1 = await fetch(
            `${config.apiUrl}treatment/getImageByName/${selectedTreatment.treatmentPhoto}`,
          );
          if (!response1.ok) {
            throw new Error("Failed to fetch image 1");
          }
          const blob1 = await response1.blob();
          setImageUrl(URL.createObjectURL(blob1));
        } catch (error) {
          console.error(error);
        }
      }

      if (selectedTreatment && selectedTreatment.treatmentPhoto) {
        try {
          const response1 = await fetch(
            `${config.apiUrl}treatment/getImageByName/${selectedTreatment.treatmentPhoto1}`,
          );
          if (!response1.ok) {
            throw new Error("Failed to fetch image 2");
          }
          const blob1 = await response1.blob();
          setImageUrl1(URL.createObjectURL(blob1));
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchImage();
  }, [selectedTreatment]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);
      // alert(JSON.stringify(response));
      if (response.status === 200) {
        setDoctors(response.data);
      } else {
        console.error("Failed to fetch doctors. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}service`);
      console.log("Services response:", response); // Debugging log
      if (response.status === 200) {
        setServices(response.data);
      } else {
        console.error("Failed to fetch services. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchMedicineNames = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      if (response.status === 200) {
        const medicineOptions = response.data.map((medicine) => ({
          value: medicine.medicineId,
          label: medicine.medicineName,
        }));

        // alert("HHHHHHHHHH  ___ " + JSON.stringify(medicineOptions));

        setMedicineNames(medicineOptions);
      }
    } catch (error) {
      console.error("Error fetching medicine names:", error);
    }
  };

  useEffect(() => {
    fetchMedicineNames();
  }, []);

  const handleDeleteMedicine = async (index, medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        // Construct the API endpoint for deleting the medicine
        const apiUrl = `${config.apiUrl}treatment/medicine/${medicineId}/${selectedTreatment.id}`;

        // Make the DELETE request
        const response = await axios.delete(apiUrl);

        // Check response status
        if (response.status === 200) {
          toast.success("Medicine deleted successfully!", { autoClose: 3000 });

          // Update the frontend state to reflect deletion
          const updatedDetailsList =
            selectedTreatment.treatmentMedicineDetailsList.filter(
              (med) => med.medicine.medicineId !== medicineId,
            );

          setSelectedTreatment({
            ...selectedTreatment,
            treatmentMedicineDetailsList: updatedDetailsList,
          });

          // Optionally, refetch data or update treatmentsList if necessary
          // fetchData();
          // setTreatmentsList(updatedTreatmentsList);
        } else {
          toast.error("Failed to delete medicine. Please try again.", {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error deleting medicine:", error);
        toast.error("Error deleting medicine. Please try again.", {
          autoClose: 3000,
        });
      }
    }
  };

  const renderMedicineTableRows = () => {
    if (!selectedTreatment || !selectedTreatment.treatmentMedicineDetailsList) {
      return null;
    }

    // Combine the selected treatment medicine details with the new treatments list
    const allMedicineDetails = [
      ...selectedTreatment.treatmentMedicineDetailsList,
      ...treatmentsList.map((item) => ({
        medicine: { medicineName: item.medicineName },
        dosageInstruction: item.dosageInstruction,
        duration: item.duration,
      })),
    ];

    return allMedicineDetails.map((medicineDetail, index) => (
      <CTableRow key={index}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>{medicineDetail.medicine.medicineName}</CTableDataCell>
        <CTableDataCell>{medicineDetail.dosageInstruction}</CTableDataCell>
        <CTableDataCell>{medicineDetail.duration}</CTableDataCell>
        <CTableDataCell>
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() =>
              handleDeleteMedicine(index, medicineDetail.medicine.medicineId)
            }
          >
            <FaTrash />
          </CButton>
        </CTableDataCell>
      </CTableRow>
    ));
  };

  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    section: {
      marginBottom: 10,
    },
    header: {
      fontSize: 18,
      marginBottom: 10,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
    },
    value: {
      fontSize: 12,
      marginBottom: 5,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    tableColHeader: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#bdbdbd",
    },
    tableCol: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCellHeader: {
      margin: 5,
      fontSize: 12,
      fontWeight: "bold",
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
    },
    chartImg: {
      width: "100px",
      height: "100px",
      // other styles you might have
    },
  });

  const InvoicePDFDocument = ({ treatment }) => {
    const {
      patient,
      doctor,
      treatmentDate,
      description,
      treatmentItemDetailsList,
      treatmentMedicineDetailsList,
    } = treatment;

    // alert(JSON.stringify(treatment));
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Treatment Invoice</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{patient.fullName}</Text>
            <Text style={styles.label}>Patient Mobile:</Text>
            <Text style={styles.value}>{patient.mobile}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Doctor Name:</Text>
            <Text style={styles.value}>{doctor.fullName}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Treatment Date:</Text>
            <Text style={styles.value}>{treatmentDate}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{description}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Services:</Text>
            {treatmentItemDetailsList.map((item, index) => (
              <Text key={index} style={styles.value}>
                - {item.serviceItem.serviceName}
              </Text>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Medicines:</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Sr. No</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Medicine</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Dosage</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Duration</Text>
                </View>
              </View>
              {treatmentMedicineDetailsList.map((medicine, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {medicine.medicine.medicineName}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {medicine.dosageInstruction}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{medicine.duration}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  const generatePDF = () => {
    if (selectedTreatment) {
      return (
        <PDFDownloadLink
          document={<InvoicePDFDocument treatment={selectedTreatment} />}
          fileName="invoice.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Loading document..."
            ) : (
              <button type="button" className="btn btn-primary">
                Download
              </button>
            )
          }
        </PDFDownloadLink>
      );
    }
    return null;
  };

  useEffect(() => {
    // Filter treatments based on search input
    setFilteredTreatments(
      treatments.filter((treatment) =>
        Object.values(treatment).some((value) =>
          String(value).toLowerCase().includes(searchInput.toLowerCase()),
        ),
      ),
    );
  }, [searchInput, treatments]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}treatment`);

      setTreatments(response.data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // Define toggleSearchBar function to toggle search bar visibility
  const toggleSearchBar = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  // const handleSearch = () => {
  //   setFilteredTreatments(
  //     treatments.filter((treatment) =>
  //       Object.values(treatment).some((value) =>
  //         String(value).toLowerCase().includes(searchInput.toLowerCase()),
  //       ),
  //     ),
  //   );
  // };

  const handleEdit = (treatmentId) => {
    const selected = treatments.find(
      (treatment) => treatment.id === treatmentId,
    );
    setSelectedTreatment({
      ...selected,
      patientId: selected.patient.id,
      doctorId: selected.doctor.id,
      treatmentDate: selected.treatmentDate,
    });
    setShowEditModal(true);
  };

  const handleMedicineChange = (selectedOption) => {
    // alert("hihi   ==   " + JSON.stringify(selectedOption));

    if (selectedOption) {
      setTreatment({
        ...treatment,
        medicineId: selectedOption.value,
        medicineName: selectedOption.label,
      });
    } else {
      // Handle case where selectedOption is null or undefined
      setTreatment({
        ...treatment,
        medicineId: "",
        medicineName: "",
      });
    }
  };

  const [treatmentsList, setTreatmentsList] = useState([]);
  const [dosageOptions] = useState([
    { value: "1:0:0", label: "1:0:0" },
    { value: "1:1:0", label: "1:1:0" },
    { value: "0:1:0", label: "0:1:0" },
    { value: "0:1:1", label: "0:1:1" },
    { value: "1:1:1", label: "1:1:1" },
    { value: "0:0:1", label: "0:0:1" },
    { value: "1:0:1", label: "1:0:1" },
  ]);
  const [durationOptions] = useState([
    { value: "7 days", label: "7 days" },
    { value: "5 days", label: "5 days" },
    { value: "30 days", label: "30 days" },
    { value: "1 day", label: "1 day" },
    { value: "other custom days", label: "Other custom days" },
  ]);

  useEffect(() => {
    fetchMedicines();
  }, []);
  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      if (response.status === 200) {
        if (Array.isArray(response.data)) {
          setMedicine(response.data);
          console.log(response.data);
        } else {
          console.error(
            "Expected an array of medicines, but received:",
            response.data,
          );
        }
      } else {
        console.error("Failed to fetch medicines. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // alert(name + value);
    setTreatment({
      ...treatment,
      [name]: value,
    });
  };

  const handleSubmitMedicine = async (event) => {
    event.preventDefault();

    // Create a new medicine object with the selected medicine details
    const newMedicine = {
      medicineId: treatment.medicineId,
      medicineName: treatment.medicineName,
      dosageInstruction: treatment.dosageName,
      duration: treatment.durationName,
    };

    // alert("hihi   ==   " + JSON.stringify(newMedicine));

    setTreatmentsList([...treatmentsList, newMedicine]);
    // Update the selectedTreatment state with the new medicine
    setSelectedTreatment((prevState) => ({
      ...prevState,
      medicines: Array.isArray(prevState.medicines)
        ? [...prevState.medicines, newMedicine]
        : [newMedicine],
    }));
  };

  // Correct the handleSave function

  const handleSave = async () => {
    try {
      if (!selectedTreatment) {
        throw new Error("Selected treatment is not defined.");
      }

      const {
        patientId,
        doctorId,
        description,
        treatmentItemDetailsList,
        bp,
        temp,
        spo,
        medicines,
        treatmentPhoto,
        treatmentPhoto1,
      } = selectedTreatment;

      const serviceItems = treatmentItemDetailsList.map((item) => ({
        id: item.serviceItem.id,
        serviceName: item.serviceItem.serviceName,
        // Add other necessary fields here if needed
      }));

      const medicinesPayload = selectedTreatment.medicines
        ? selectedTreatment.medicines.map((medicine) => ({
            medicine: {
              medicineId: medicine.medicineId,
            },
            dosageInstruction: medicine.dosageInstruction,
            duration: medicine.duration,
          }))
        : [];

      alert(treatmentPhoto);

      alert(treatmentPhoto1);

      const formData = new FormData();
      formData.append("file", treatmentPhoto);
      formData.append("file1", treatmentPhoto1);

      formData.append(
        "request",
        JSON.stringify({
          patientId: patientId,
          doctorId: doctorId,
          description: description,
          serviceItems: serviceItems,
          bp: bp,
          temp: temp,
          spo: spo,
          medicines: medicinesPayload,
        }),
      );

      const res = await axios.put(
        `${config.apiUrl}treatment/${selectedTreatment.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 200) {
        toast.success("Treatment data updated successfully!");

        setSelectedTreatment({
          patientId: "",
          doctorId: "",
          treatmentItemDetailsList: [],
          medicines: [],
          description: "",
          bp: "",
          temp: "",
          spo: "",
          treatmentPhoto: "",
          treatmentPhoto1: "",
        });
        setShowEditModal(false);

        window.location.reload();
      } else {
        throw new Error("Failed to update treatment data.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Failed to update treatment data. ${error.message}`);
    }
  };

  const handleEditImageChange = (event) => {
    const { name, files } = event.target;

    if (files && files[0]) {
      if (name === "file") {
        setSelectedTreatment((prevState) => ({
          ...prevState,
          treatmentPhoto: files[0],
        }));
      } else if (name === "file1") {
        setSelectedTreatment((prevState) => ({
          ...prevState,
          treatmentPhoto1: files[0],
        }));
      } else {
        setSelectedTreatment((prevState) => ({
          ...prevState,
          [name]: files[0],
        }));
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service from treatment?",
      )
    ) {
      try {
        const apiUrl = `${config.apiUrl}treatment/service/${serviceId}/${selectedTreatment.id}`;
        setLoading(true);

        const response = await axios.delete(apiUrl);

        if (response.status === 200) {
          // Remove the deleted service from the state
          const updatedServiceList =
            selectedTreatment.treatmentItemDetailsList.filter(
              (item) => item.serviceItem.id !== serviceId,
            );

          setSelectedTreatment({
            ...selectedTreatment,
            treatmentItemDetailsList: updatedServiceList,
          });

          setLoading(false);
          alert("Service deleted successfully!");
        } else {
          console.error("Failed to delete service:", response.data);
          alert("Failed to delete service. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service. Please try again later.");
      }
    }
  };

  // Inside your functional component
  const handleDelete = async (treatmentId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        // Implement deletion logic here
        await axios.delete(`${config.apiUrl}treatment/${treatmentId}`);
        // Optionally update state or perform other actions upon successful deletion
        fetchData(); // Assuming fetchData is a function to refetch treatments
        toast.success("Patient deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("Error deleting treatment:", error);
        toast.error("Failed to delete treatment. Please try again.");
      }
    }
  };

  // const renderServiceList = () => {
  //   if (!selectedTreatment || !selectedTreatment.treatmentItemDetailsList) {
  //     return null;
  //   }

  //   return selectedTreatment.treatmentItemDetailsList.map((item) => (
  //     <div key={item.serviceItem.id}>
  //       <span>{item.serviceItem.serviceName}</span>
  //       <button onClick={() => handleEditService(item.serviceItem.id)}>
  //         Edit
  //       </button>
  //       <button onClick={() => handleDeleteService(item.serviceItem.id)}>
  //         Delete
  //       </button>
  //     </div>
  //   ));
  // };

  return (
    <div>
      <CCard className="mb-5">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Treatment Details</span>
          <div style={{ display: "flex", alignItems: "center" }}>
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
                  placeholder="Search treatment details"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control"
                  style={{ height: "30px", marginRight: "10px" }}
                />
              </div>
              <div
                className="input-group-append"
                style={{ marginRight: "10px" }}
              >
                <Link to="/addTreatment" className="btn btn-primary">
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
                  <th>Description</th>
                  <th>Treatment Date</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.id}>
                    <td style={{ alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CButton
                          color="info"
                          title="view prescription"
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTreatment(treatment.id)} // Correct usage of handleViewTreatment
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </CButton>

                        <CButton
                          color="info"
                          variant="outline"
                          title="Edit Treatment"
                          size="sm"
                          onClick={() => handleEdit(treatment.id)}
                        >
                          <AiFillEdit />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          title="Delete"
                          size="sm"
                          onClick={() => handleDelete(treatment.id)}
                        >
                          <FaTrash />
                        </CButton>
                        <CButton
                          color="info"
                          title="Bill"
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBilling(treatment.id)} // Correct usage of handleViewTreatment
                        >
                          <FaFileInvoiceDollar />
                        </CButton>

                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          title="Medical Certificate"
                          onClick={() =>
                            handleViewMedicalCertificate(treatment.id)
                          } // Correct usage of handleViewTreatment
                        >
                          <FaFileMedical />
                        </CButton>

                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          title="Fitnes Certificate"
                          onClick={() =>
                            handleViewFitnessCertificate(treatment.id)
                          } // Correct usage of handleViewTreatment
                        >
                          <FaRunning />
                        </CButton>
                        <div></div>
                      </div>
                    </td>
                    <td>{treatment.id}</td> {/* Displaying doctor's ID */}
                    <td>{treatment.patient.fullName}</td>
                    <td>{treatment.patient.mobile}</td>
                    <td>{treatment.doctor.fullName}</td>
                    <td>{treatment.description}</td>
                    <td>{formatDateDMY(treatment.treatmentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CCardBody>
      </CCard>
      {/* Modal to display treatment details */}
      <Modal show={showViewModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Treatment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTreatment && (
            <div>
              <p>
                <strong>Description:</strong> {selectedTreatment.description}
              </p>
              {/* Display other treatment details */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* This is edit modal for updating the treatment deta */}
      {/* Edit Modal */}
      {selectedTreatment && (
        <Draggable handle=".modal-header">
          <div
            className="modal"
            style={{
              display: showEditModal ? "block" : "none",
              position: "fixed",
              top: "5%",
              left: "20%",
            }}
          >
            <CCard style={{ width: "800px" }}>
              {/* Adjust the width as needed */}{" "}
              <CCardHeader
                className="modal-header" // Make sure the className matches the handle
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <span style={{ lineHeight: "44px" }}>Update details</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="input-group-append"
                    style={{ marginRight: "10px" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody>
                <CForm
                  className="mb-3 row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={""}
                >
                  <CCol md={4}>
                    <CFormLabel htmlFor="patientId" style={{ color: "#000" }}>
                      Select Patient
                    </CFormLabel>
                    <Select
                      id="patientId"
                      name="patientId"
                      options={
                        Array.isArray(patients)
                          ? patients.map((patient) => ({
                              value: patient.id,
                              label: patient.fullName,
                            }))
                          : []
                      }
                      value={
                        selectedTreatment.patientId
                          ? {
                              value: selectedTreatment.patientId,
                              label: selectedTreatment.patient.fullName,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setSelectedTreatment((prevTreatment) => ({
                          ...prevTreatment,
                          patientId: selectedOption?.value || "",
                          patient: {
                            id: selectedOption?.value || "",
                            fullName: selectedOption?.label || "",
                            // Include other patient details you need
                          },
                        }))
                      }
                      isClearable
                    />
                    {/* <CFormFeedback invalid>
                      Please select a patient.
                    </CFormFeedback> */}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="doctorId" style={{ color: "#000" }}>
                      Select Doctor
                    </CFormLabel>

                    <Select
                      id="doctorId"
                      name="doctorId"
                      options={
                        Array.isArray(doctors)
                          ? doctors.map((doctor) => ({
                              value: doctor.id,
                              label: doctor.fullName,
                            }))
                          : []
                      }
                      value={
                        selectedTreatment.doctorId
                          ? {
                              value: selectedTreatment.doctorId,
                              label: selectedTreatment.doctor.fullName,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setSelectedTreatment((prevTreatment) => ({
                          ...prevTreatment,
                          doctorId: selectedOption?.value || "",
                          doctor: {
                            id: selectedOption?.value || "",
                            fullName: selectedOption?.label || "",
                            // Include other doctor details you need
                          },
                        }))
                      }
                      isClearable
                    />

                    {/* <CFormFeedback invalid>
                      Please select a Doctor.
                    </CFormFeedback> */}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="serviceId" style={{ color: "#000" }}>
                      Select Service
                    </CFormLabel>
                    <Select
                      id="serviceId"
                      name="serviceId"
                      options={
                        services && services.length > 0
                          ? services.map((service) => ({
                              value: service.id,
                              label: service.serviceName,
                            }))
                          : []
                      }
                      onChange={(selectedOptions) =>
                        setSelectedTreatment((prev) => ({
                          ...prev,
                          treatmentItemDetailsList: selectedOptions.map(
                            (selectedOption) => ({
                              serviceItem: {
                                id: selectedOption.value,
                                serviceName: selectedOption.label,
                              },
                            }),
                          ),
                        }))
                      }
                      isClearable
                      isMulti
                      // className={
                      //   !selectedTreatment.treatmentItemDetailsList.length
                      //     ? "is-invalid"
                      //     : ""
                      // }
                      value={selectedTreatment.treatmentItemDetailsList.map(
                        (item) => ({
                          value: item.serviceItem.id,
                          label: item.serviceItem.serviceName,
                        }),
                      )}
                      required
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#000",
                        }),
                      }}
                      components={{
                        MultiValueLabel: ({ data }) => (
                          <div>
                            <span>{data.label}</span>
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-danger"
                              onClick={() => handleDeleteService(data.value)}
                              style={{ paddingLeft: "5px" }}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ),
                        MultiValueRemove: () => null, // This will remove the default cross icon
                      }}
                    />

                    <CFormFeedback invalid>
                      Please select a service.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="treatmentDate"
                      style={{ color: "#000" }}
                    >
                      Update Date
                    </CFormLabel>
                    <input
                      id="treatmentDate"
                      type="date"
                      className="form-control"
                      value={selectedTreatment.treatmentDate}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          treatmentDate: e.target.value,
                        })
                      }
                      style={{ color: "#000", height: "30px" }}
                    />
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="bp">BP</CFormLabel>
                    <CFormInput
                      id="bp"
                      name="bp"
                      value={selectedTreatment.bp}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          bp: e.target.value,
                        })
                      }
                      required
                    />
                    <CFormFeedback invalid>
                      Please provide a blood pressure.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="temp">Temperature</CFormLabel>
                    <CFormInput
                      id="temp"
                      name="temp"
                      value={selectedTreatment.temp}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          temp: e.target.value,
                        })
                      }
                      required
                    />
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="spo">SPO2</CFormLabel>
                    <CFormInput
                      id="spo"
                      name="spo"
                      value={selectedTreatment.spo}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          spo: e.target.value,
                        })
                      }
                      required
                    />
                  </CCol>

                  <CCol md={8}>
                    <CFormLabel htmlFor="description">Description</CFormLabel>
                    <textarea
                      id="description"
                      className="form-control"
                      value={selectedTreatment.description}
                      onChange={(e) =>
                        setSelectedTreatment({
                          ...selectedTreatment,
                          description: e.target.value,
                        })
                      }
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="image1">
                      Upload Image 1 -{" "}
                      {selectedTreatment.treatmentPhoto &&
                        selectedTreatment.treatmentPhoto.name}
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Chart"
                          style={styles.chartImg}
                        />
                      )}
                    </CFormLabel>
                    <input
                      type="file"
                      id="image1"
                      name="treatmentPhoto" // Use 'treatmentPhoto' as the name here
                      onChange={handleEditImageChange}
                      accept="image/*"
                      required
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="image2">
                      Upload Image 2 -{" "}
                      {selectedTreatment.treatmentPhoto1 &&
                        selectedTreatment.treatmentPhoto1.name}
                      {imageUrl1 && (
                        <img
                          src={imageUrl1}
                          alt="Chart"
                          style={styles.chartImg}
                        />
                      )}
                    </CFormLabel>
                    <input
                      type="file"
                      id="image2"
                      name="treatmentPhoto1" // Use 'treatmentPhoto1' as the name here
                      onChange={handleEditImageChange}
                      accept="image/*"
                      required
                    />
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="medicineName">
                      Select Medicine
                    </CFormLabel>
                    <Select
                      options={
                        Array.isArray(medicineNames) && medicineNames.length > 0
                          ? medicineNames
                          : []
                      }
                      name="medicineId"
                      onChange={handleMedicineChange}
                      // required
                    />

                    {/* <CFormFeedback invalid>
                      Please select a medicine.
                    </CFormFeedback> */}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="dosageName">Select Dosage</CFormLabel>
                    <Select
                      id="dosageName"
                      name="dosageName"
                      options={dosageOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "dosageName",
                            value: selectedOption ? selectedOption.value : "", // Ensure value is set or empty string
                          },
                        })
                      }
                      isClearable
                      placeholder="Select a dosage"
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a Dosage.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="durationName">
                      Select Duration
                    </CFormLabel>
                    <Select
                      id="durationName"
                      name="durationName"
                      options={durationOptions}
                      onChange={(selectedOption) =>
                        handleInputChange({
                          target: {
                            name: "durationName",
                            value: selectedOption.value,
                          },
                        })
                      }
                      isClearable
                      placeholder="Select a duration"
                      required
                    />
                    <CFormFeedback invalid>
                      Please select a duration.
                    </CFormFeedback>
                  </CCol>

                  <CCol md={12}>
                    <CButton color="primary" onClick={handleSubmitMedicine}>
                      Add Medicine
                    </CButton>
                  </CCol>

                  {/* here is the rendered table */}
                  <CCol xs={12}>
                    <CCard>
                      <CCardHeader>Medicine Details</CCardHeader>
                      <CCardBody>
                        <CTable>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Sr.no</CTableHeaderCell>
                              <CTableHeaderCell>Medicine</CTableHeaderCell>
                              <CTableHeaderCell>Dosage</CTableHeaderCell>
                              <CTableHeaderCell>Duration</CTableHeaderCell>
                              <CTableHeaderCell>Delete</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>{renderMedicineTableRows()}</CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CCol md={18}>
                      <button
                        type="button"
                        className="btn btn-primary "
                        onClick={() => handleSave()} // Call handleSave on click
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)} // Close modal on cancel
                      >
                        Cancel
                      </button>
                    </CCol>

                    {/* <div
                      className="input-group-append"
                      style={{ marginRight: "10px" }}
                    >
                      {generatePDF()}
                    </div> */}

                    <div
                      className="input-group-append"
                      style={{ marginRight: "10px" }}
                    >
                      {/* <CButton onClick={""}>
                        <FaWhatsapp size={25} />
                      </CButton> */}
                    </div>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default ClinicTreatment;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  CCard,
  CRow,
  CCardBody,
  CCardHeader,
  CFormInput,
  CCol,
  CForm,
  CFormFeedback,
  CFormLabel,
  CButton,
  CFormTextarea,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import config from "../../config";

const ClinicAddTreatmentList = () => {
  const [validated, setValidated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [services, setServices] = useState([]);
  const [treatmentsList, setTreatmentsList] = useState([]);
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState({
    patientId: "",
    doctorId: "",
    serviceId: [],
    medicineId: "",
    medicineName: "",
    dosageName: "",
    durationName: "",
    description: "",
    bp: "",
    temp: "",
    spo: "",
    treatmentPhoto: null,
    treatmentPhoto1: null,
  });

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
    fetchPatients();
    fetchDoctors();
    fetchServices();
    fetchMedicines();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients`);
      if (response.status === 200) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor`);
      if (response.status === 200) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}service`);
      if (response.status === 200) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}medicine`);
      if (response.status === 200) {
        setMedicine(response.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "file") {
      setTreatment((prevState) => ({
        ...prevState,
        treatmentPhoto: files[0],
      }));
    } else {
      setTreatment((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (name === "file1") {
      setTreatment((prevState) => ({
        ...prevState,
        treatmentPhoto1: files[0],
      }));
    } else {
      setTreatment((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    //  alert(treatment.treatmentPhoto);
    //  alert(treatment.treatmentPhoto1);

    try {
      const formData = new FormData();

      const serviceIds = Array.isArray(treatment.serviceId)
        ? treatment.serviceId.map((service) => service.value)
        : [];

      const medicines = treatmentsList.map((item) => ({
        medicineId: item.medicineId,
        dosageInstruction: item.dosageName,
        duration: item.durationName,
      }));

      //alert(treatment.treatmentPhoto);

      formData.append("file", treatment.treatmentPhoto);
      formData.append("file1", treatment.treatmentPhoto1);
      formData.append(
        "request",
        JSON.stringify({
          patientId: treatment.patientId,
          doctorId: treatment.doctorId,
          serviceItems: serviceIds.map((serviceId) => ({ id: serviceId })),
          medicines: medicines.map((medicine) => ({
            medicine: {
              medicineId: medicine.medicineId,
            },
            dosageInstruction: medicine.dosageInstruction,
            duration: medicine.duration,
          })),
          description: treatment.description,
          bp: treatment.bp,
          temp: treatment.temp,
          spo: treatment.spo,
        }),
      );

      const uploadRes = await axios.post(
        `${config.apiUrl}treatment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (uploadRes.status === 200) {
        window.alert("Treatment data submitted successfully!");
        form.reset();
        setValidated(false);
        setTreatment({
          patientId: "",
          doctorId: "",
          serviceId: [],
          medicineId: "",
          medicineName: "",
          dosageName: "",
          durationName: "",
          description: "",
          bp: "",
          temp: "",
          spo: "",
          treatmentPhoto: null,
          treatmentPhoto1: null,
        });
        setTreatmentsList([]);
        navigate("/treatment");
      } else {
        throw new Error("Failed to submit treatment data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit treatment data. Please try again later.");
    }
  };

  const handleServiceChange = (selectedOption) => {
    setTreatment({
      ...treatment,
      serviceId: selectedOption || [],
    });
  };

  const handleMedicineChange = (selectedOption) => {
    setTreatment({
      ...treatment,
      medicineId: selectedOption ? selectedOption.value : "",
      medicineName: selectedOption ? selectedOption.label : "",
    });
  };

  const handleSubmitMedicine = async (event) => {
    event.preventDefault();
    setTreatmentsList([...treatmentsList, treatment]);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <span style={{ lineHeight: "44px" }}>Add Treatment</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="input-group-append">
                <Link to="/treatment" className="btn btn-primary">
                  Back
                </Link>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="mb-3 row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={4}>
                <CFormLabel htmlFor="patientId" style={{ color: "#000" }}>
                  Select Patient
                </CFormLabel>
                <Select
                  id="patientId"
                  name="patientId"
                  options={patients.map((patient) => ({
                    value: patient.id,
                    label: patient.fullName,
                  }))}
                  onChange={(selectedOption) =>
                    setTreatment({
                      ...treatment,
                      patientId: selectedOption.value,
                    })
                  }
                  isClearable
                  placeholder="Select a patient"
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
                />
                <CFormFeedback invalid>Please select a patient.</CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="doctorId" style={{ color: "#000" }}>
                  Select Doctor
                </CFormLabel>
                <Select
                  id="doctorId"
                  name="doctorId"
                  options={doctors.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.fullName,
                  }))}
                  onChange={(selectedOption) =>
                    setTreatment({
                      ...treatment,
                      doctorId: selectedOption.value,
                    })
                  }
                  isClearable
                  placeholder="Select a doctor"
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
                />
                <CFormFeedback invalid>Please select a doctor.</CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="serviceId">Select Service</CFormLabel>
                <Select
                  id="serviceId"
                  name="serviceId"
                  options={services.map((service) => ({
                    value: service.id,
                    label: service.serviceName,
                  }))}
                  onChange={handleServiceChange}
                  isClearable
                  placeholder="Select a service"
                  isMulti
                  required
                />
                <CFormFeedback invalid>Please select a service.</CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="bp">BP</CFormLabel>
                <CFormInput
                  id="bp"
                  name="bp"
                  value={treatment.bp}
                  onChange={handleInputChange}
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
                  value={treatment.temp}
                  onChange={handleInputChange}
                  required
                />
                <CFormFeedback invalid>
                  Please provide a temperature.
                </CFormFeedback>
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="spo">SPO2</CFormLabel>
                <CFormInput
                  id="spo"
                  name="spo"
                  value={treatment.spo}
                  onChange={handleInputChange}
                  required
                />
                <CFormFeedback invalid>Please provide an SPO2.</CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={treatment.description}
                  onChange={handleInputChange}
                  required
                />
                <CFormFeedback invalid>
                  Please provide a description.
                </CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="treatmentPhoto">Upload Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="treatmentPhoto"
                  name="file"
                  onChange={handleInputChange}
                  accept="image/*"
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="treatmentPhoto">Upload Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="treatmentPhoto1"
                  name="file1"
                  onChange={handleInputChange}
                  accept="image/*"
                  required
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="medicineId">Select Medicine</CFormLabel>
                <Select
                  options={medicine.map((med) => ({
                    value: med.medicineId,
                    label: med.medicineName,
                  }))}
                  name="medicineId"
                  onChange={handleMedicineChange}
                  required
                />

                <CFormFeedback invalid>Please select a medicine.</CFormFeedback>
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
                        value: selectedOption.value,
                      },
                    })
                  }
                  isClearable
                  placeholder="Select a dosage"
                  required
                />
                <CFormFeedback invalid>Please select a dosage.</CFormFeedback>
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="durationName">Select Duration</CFormLabel>
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
                <CFormFeedback invalid>Please select a duration.</CFormFeedback>
              </CCol>
              <CCol md={4} className="d-flex">
                <div className="mb-3" flex>
                  <CButton
                    className="mx-2"
                    color="primary"
                    onClick={handleSubmitMedicine}
                  >
                    Add Medicine
                  </CButton>
                </div>

                <div className="mb-3">
                  <CButton color="primary" type="submit">
                    Submit
                  </CButton>
                </div>
              </CCol>
            </CForm>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Medicine</CTableHeaderCell>
                  <CTableHeaderCell>Dosage</CTableHeaderCell>
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {treatmentsList.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.medicineName}</CTableDataCell>
                    <CTableDataCell>{item.dosageName}</CTableDataCell>
                    <CTableDataCell>{item.durationName}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ClinicAddTreatmentList;

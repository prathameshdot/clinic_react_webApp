import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import config from "../../config";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CButton,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react";

const AddOpd = () => {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState({
    name: "",
    address: "",
    age: "",
    gender: "",
    dob: "",
    occupation: "",
    height: "",
    weight: "",
    bp: "",
    signs: "",
    symptoms: "",
    generalHistory: "",
    allergiesHistory: "",
    medicationsHistory: "",
    familyHistory: "",
    skinHistory: "",
    skinLesionCourse: "",
    when: "",
    how: "",
    preliminaryHistory: "",
    specificHistory: "",
    physicalExamination: "",
    lesionInspection: "",
    morphology: "",
    primaryLesion: "",
    secondaryLesions: "",
    specificLesions: "",
    shape: "",
    color: "",
    thickness: "",
    size: "",
    distribution: "",
    configuration: "",
    associatedSymptoms: "",
    itching: "",
    burning: "",
    chronicity: "",
    scales: "",
    changeWithTiming: "",
    changeWithEnvironment: "",
    excessiveSweating: "",
    description: "",
    otherAilments: "",
    opinionSeekFor: "",
    diagnosis: "",
    treatmentAdvice: "",
    treatmentDate: "",
    treatment: "",
    results: "",
  });
  const [cameraOpen, setCameraOpen] = useState(false); // State to control webcam visibility
  const [capturedPhoto, setCapturedPhoto] = useState(""); // State to store captured photo URL
  const [photoFile, setPhotoFile] = useState(null); // State to store photo file
  const [photoName, setPhotoName] = useState(""); // State to store photo filename
  const navigate = useNavigate(); // Initialize useNavigate hook

  const webcamRef = useRef(null);

  const toggleCamera = () => {
    setCameraOpen((prev) => !prev);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const filename = `${user.name}_${Date.now()}.jpg`;

    // Convert imageSrc to a Blob
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: "image/jpeg" });
        setPhotoFile(file);
        setCapturedPhoto(imageSrc);
        setPhotoName(filename); // Set the filename
        setUser({ ...user, photo: filename }); // Update user with photo filename
      });
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const formData = new FormData();
    formData.append("request", JSON.stringify(user)); // Append the user data as JSON string

    // Append the photo file if it exists
    if (photoFile) {
      formData.append("file", photoFile);
    }

    try {
      const res = await axios.post(`${config.apiUrl}patients`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        form.reset();
        setUser({
          name: "",
          address: "",
          age: "",
          gender: "",
          dob: "",
          occupation: "",
          height: "",
          weight: "",
          bp: "",
          signs: "",
          symptoms: "",
          generalHistory: "",
          allergiesHistory: "",
          medicationsHistory: "",
          familyHistory: "",
          skinHistory: "",
          skinLesionCourse: "",
          when: "",
          how: "",
          preliminaryHistory: "",
          specificHistory: "",
          physicalExamination: "",
          lesionInspection: "",
          morphology: "",
          primaryLesion: "",
          secondaryLesions: "",
          specificLesions: "",
          shape: "",
          color: "",
          thickness: "",
          size: "",
          distribution: "",
          configuration: "",
          associatedSymptoms: "",
          itching: "",
          burning: "",
          chronicity: "",
          scales: "",
          changeWithTiming: "",
          changeWithEnvironment: "",
          excessiveSweating: "",
          description: "",
          otherAilments: "",
          opinionSeekFor: "",
          diagnosis: "",
          treatmentAdvice: "",
          treatmentDate: "",
          treatment: "",
          results: "",
        });
        setCapturedPhoto(""); // Clear captured photo after submit
        setPhotoFile(null); // Clear photo file after submit
        setPhotoName(""); // Clear photo name after submit
        setSubmitted(true);
        setValidated(false);
        window.alert("Patient data submitted successfully!");
        navigate("/PatientDetails"); // Navigate to PatientDetails page
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to submit data. Please try again later.");
    }

    setValidated(true);
  };

  return (
    <CCard className="mb-5">
      <CCardHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <span style={{ lineHeight: "44px" }}>Add Patient</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/PatientDetails" className="btn btn-primary">
              Back
            </Link>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 ml needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={4}>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <CFormInput
              type="text"
              id="address"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your address.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="age">Age</CFormLabel>
            <CFormInput
              type="number"
              id="age"
              name="age"
              value={user.age}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your age.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          {/* Add additional fields following the same pattern */}
          <CCol md={4}>
            <CFormLabel htmlFor="gender">Gender</CFormLabel>
            <CFormSelect
              id="gender"
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </CFormSelect>
            <CFormFeedback invalid>Please select your gender.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
            <CFormInput
              type="date"
              id="dob"
              name="dob"
              value={user.dob}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter your date of birth.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="occupation">Occupation</CFormLabel>
            <CFormInput
              type="text"
              id="occupation"
              name="occupation"
              value={user.occupation}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your occupation.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          {/* Add more fields as required */}
          {/* Add webcam photo capture section */}
          <CCol md={4}>
            <CFormLabel>Photo</CFormLabel>
            <div>
              {cameraOpen ? (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={150}
                    height={100}
                  />
                  <CButton color="primary" onClick={capturePhoto}>
                    Capture
                  </CButton>
                </div>
              ) : (
                <CButton color="primary" onClick={toggleCamera}>
                  Open Camera
                </CButton>
              )}
              {capturedPhoto && (
                <div>
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    width={150}
                    height={100}
                  />
                  <CFormLabel>{photoName}</CFormLabel> {/* Display filename */}
                </div>
              )}
            </div>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="treatmentDate">Treatment Date</CFormLabel>
            <CFormInput
              type="date"
              id="treatmentDate"
              name="treatmentDate"
              value={user.treatmentDate}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the treatment date.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          {/* Add more fields based on your requirements */}
          <CCol xs={12} className="text-center">
            <CButton color="primary" type="submit" disabled={submitted}>
              {submitted ? "Submitted" : "Submit"}
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddOpd;

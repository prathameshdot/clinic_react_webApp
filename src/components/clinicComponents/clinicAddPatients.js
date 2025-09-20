import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import config from "../../config";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  CButton,
  CFormSelect,
} from "@coreui/react";

const ClinicAddPatient = () => {
  const { clinicId } = useParams();
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    gender: "",
    dob: "",
    age: "",
    weight: "",
    bloodGroup: "",
    photo: "", // Store the filename of the photo
    clinicId: clinicId,
  });
  const [cameraOpen, setCameraOpen] = useState(false); // State to control webcam visibility
  const [capturedPhoto, setCapturedPhoto] = useState(""); // State to store captured photo URL
  const [photoFile, setPhotoFile] = useState(null); // State to store photo file
  const navigate = useNavigate(); // Initialize useNavigate hook

  const webcamRef = useRef(null);

  const toggleCamera = () => {
    setCameraOpen((prev) => !prev);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const filename = `${user.fullName}_${Date.now()}.jpg`;

    // Convert imageSrc to a Blob
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: "image/jpeg" });
        setPhotoFile(file);
        setCapturedPhoto(imageSrc);
        setUser((prev) => ({ ...prev, photo: filename })); // Update user with photo filename
      });
  }, [user.fullName]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
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

    // Append user data as a JSON string
    formData.append("request", JSON.stringify(user));
    console.log("User Data (JSON):", JSON.stringify(user)); // Log user data

    // Append the photo file with the name expected by the backend
    if (photoFile) {
      formData.append("file", photoFile);
      console.log("Photo File:", photoFile); // Log photo file details
    }

    // Log all entries in formData
    for (const [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    try {
      const res = await axios.post(
        `${config.apiUrl}patients/createPatientForClinic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("API Response:", res); // Log API response

      if (res.status === 200) {
        form.reset();
        setUser({
          fullName: "",
          mobile: "",
          email: "",
          address: "",
          gender: "",
          dob: "",
          age: "",
          weight: "",
          bloodGroup: "",
          photo: "",
          clinicId: clinicId,
        });
        setCapturedPhoto(""); // Clear captured photo after submit
        setPhotoFile(null); // Clear photo file after submit
        setValidated(false);
        window.alert("Patient data submitted successfully!");
        navigate(`/ClinicPatients/${clinicId}`);
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message,
      ); // Log detailed error
      window.alert("Failed to submit data. Please try again later.");
    }
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
            <Link
              to={`/clinicpatients/${clinicId}`}
              className="btn btn-primary"
            >
              Back
            </Link>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CCol md={4}>
            <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
            <CFormInput
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your full name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
            <CFormInput
              type="text"
              id="mobile"
              name="mobile"
              value={user.mobile}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter your mobile number.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter a valid email address.
            </CFormFeedback>
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
              <option value="Other">Other</option>
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
          <CCol md={4}>
            <CFormLabel htmlFor="weight">Weight</CFormLabel>
            <CFormInput
              type="number"
              id="weight"
              name="weight"
              value={user.weight}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter your weight.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="bloodGroup">Blood Group</CFormLabel>
            <CFormSelect
              id="bloodGroup"
              name="bloodGroup"
              value={user.bloodGroup}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </CFormSelect>
            <CFormFeedback invalid>
              Please select your blood group.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="photo">Photo</CFormLabel>
            <div>
              {cameraOpen ? (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                  />
                  <CButton
                    type="button"
                    color="primary"
                    className="mt-2"
                    onClick={capturePhoto}
                  >
                    Capture Photo
                  </CButton>
                </div>
              ) : (
                capturedPhoto && (
                  <div>
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      style={{ width: "100%" }}
                    />
                  </div>
                )
              )}
              <CButton
                type="button"
                color="secondary"
                className="mt-2"
                onClick={toggleCamera}
              >
                {cameraOpen ? "Close Camera" : "Open Camera"}
              </CButton>
            </div>
          </CCol>
          <CCol xs={12}>
            <CButton type="submit" color="primary">
              Submit
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ClinicAddPatient;

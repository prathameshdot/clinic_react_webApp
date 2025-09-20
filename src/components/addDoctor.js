import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import config from "../config";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
} from "@coreui/react";

const Doctor = () => {
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false); // State variable to track form submission

  const [doctor, setDoctor] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    gender: "",
    specialization: "",
    experience: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    qualification: "",
    regNo: "",
    photo: "",
    clinicId: "4",
    // Store the filename of the photo
  });
  const navigate = useNavigate();
  const [cameraOpen, setCameraOpen] = useState(false); // State to control webcam visibility
  const [capturedPhoto, setCapturedPhoto] = useState(""); // State to store captured photo URL
  const [photoFile, setPhotoFile] = useState(null); // State to store photo file
  const [photoName, setPhotoName] = useState(""); // State to store photo filename

  const webcamRef = useRef(null);

  const toggleCamera = () => {
    setCameraOpen((prev) => !prev);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const filename = `${doctor.fullName}_${Date.now()}.jpg`;

    // Convert imageSrc to a Blob
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: "image/jpeg" });
        setPhotoFile(file);
        setCapturedPhoto(imageSrc);
        setPhotoName(filename); // Set the filename
        setDoctor({ ...doctor, photo: filename }); // Update doctor with photo filename
      });
  }, [doctor]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDoctor({ ...doctor, [name]: value });
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
    formData.append("request", JSON.stringify(doctor)); // Append the doctor data as JSON string

    // Append the photo file if it exists
    if (photoFile) {
      formData.append("file", photoFile);
    }

    if (!submitted) {
      // Check if the form has not been submitted before
      try {
        const res = await axios.post(`${config.apiUrl}doctor`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 200) {
          window.alert("Data is submitted successfully");
          form.reset();
          setSubmitted(true); // Update state to indicate form submission
          setCapturedPhoto(""); // Clear captured photo after submit
          setPhotoFile(null); // Clear photo file after submit
          setPhotoName(""); // Clear photo name after submit
          navigate("/doctor"); // Navigate to PatientDetails page
        } else {
          throw new Error("Failed to submit data");
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert("Failed to submit data. Please try again later.");
      }
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
        <span style={{ lineHeight: "44px" }}>Add Docor</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group-append">
            <Link to="/clinicdoctors" className="btn btn-primary">
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
            <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
            <CFormInput
              type="text"
              id="fullName"
              name="fullName"
              value={doctor.fullName}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the full name.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={doctor.email}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter a valid email address.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="contactNo">Contact Number</CFormLabel>
            <CFormInput
              type="text"
              id="contactNo"
              name="contactNo"
              value={doctor.contactNo}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the contact number.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="gender">Gender</CFormLabel>
            <CFormSelect
              id="gender"
              name="gender"
              value={doctor.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </CFormSelect>
            <CFormFeedback invalid>Please select the gender.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="specialization">Specialization</CFormLabel>
            <CFormInput
              type="text"
              id="specialization"
              name="specialization"
              value={doctor.specialization}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the specialization.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="experience">Experience</CFormLabel>
            <CFormInput
              type="text"
              id="experience"
              name="experience"
              value={doctor.experience}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the experience.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <CFormInput
              type="text"
              id="address"
              name="address"
              value={doctor.address}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the address.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="country">Country</CFormLabel>
            <CFormInput
              type="text"
              id="country"
              name="country"
              value={doctor.country}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the country.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="city">City</CFormLabel>
            <CFormInput
              type="text"
              id="city"
              name="city"
              value={doctor.city}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the city.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
            <CFormInput
              type="text"
              id="postalCode"
              name="postalCode"
              value={doctor.postalCode}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>Please enter the postal code.</CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="qualification">Qualification</CFormLabel>
            <CFormInput
              type="text"
              id="qualification"
              name="qualification"
              value={doctor.qualification}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the qualification.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="regNo">Registration No.</CFormLabel>
            <CFormInput
              type="text"
              id="regNo"
              name="regNo"
              value={doctor.regNo}
              onChange={handleInputChange}
              required
            />
            <CFormFeedback invalid>
              Please enter the registration number.
            </CFormFeedback>
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={4}>
            <CFormLabel htmlFor="photo">Photo</CFormLabel>
            {cameraOpen ? (
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                />
                <CButton color="primary" onClick={capturePhoto}>
                  Capture Photo
                </CButton>
                <CButton color="secondary" onClick={toggleCamera}>
                  Close Camera
                </CButton>
              </div>
            ) : (
              <div>
                {capturedPhoto ? (
                  <div>
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <div>{photoName}</div>
                    <CButton
                      color="secondary"
                      onClick={() => setCapturedPhoto("")}
                    >
                      Remove Photo
                    </CButton>
                  </div>
                ) : (
                  <CButton color="primary" onClick={toggleCamera}>
                    Open Camera
                  </CButton>
                )}
              </div>
            )}
          </CCol>

          <CCol xs={4} />
          <CCol xs={4}>
            <CButton color="primary" type="submit" disabled={submitted}>
              Submit form
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Doctor;

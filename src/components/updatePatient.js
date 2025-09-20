import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import config from "../config";
import { Link, useParams, useNavigate } from "react-router-dom";
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
} from "@coreui/react";

const UpdatePatient = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
  });
  const [cameraOpen, setCameraOpen] = useState(false); // State to control webcam visibility
  const [capturedPhoto, setCapturedPhoto] = useState(""); // State to store captured photo URL
  const [photoFile, setPhotoFile] = useState(null); // State to store photo file
  const [photoName, setPhotoName] = useState(""); // State to store photo filename
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}patients/${id}`);
        if (response.status === 200) {
          setUser(response.data);
          //   setCapturedPhoto(`${config.apiUrl}uploads/${response.data.photo}`);

          if (response.data && response.data.photo) {
            try {
              const response1 = await fetch(
                `${config.apiUrl}treatment/getImageByName/${response.data.photo}`,
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
        } else {
          throw new Error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert("Failed to fetch patient data. Please try again later.");
      }
    };
    fetchPatientData();
  }, [id]);

  const toggleCamera = () => {
    setCameraOpen((prev) => !prev);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 1350,
      height: 820,
    }); // Adjust the resolution as needed
    const filename = `${user.fullName}_${Date.now()}.jpg`;

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
      const res = await axios.put(`${config.apiUrl}patients/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
        });
        setCapturedPhoto(""); // Clear captured photo after submit
        setPhotoFile(null); // Clear photo file after submit
        setPhotoName(""); // Clear photo name after submit
        setSubmitted(true);
        setValidated(false);
        window.alert("Patient data updated successfully!");
        navigate("/PatientDetails"); // Navigate to PatientDetails page
      } else {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to update data. Please try again later.");
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
        <span style={{ lineHeight: "44px" }}>Update Patient</span>
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
          <CRow className="mb-3">
            <CCol md={2}>
              <CFormLabel htmlFor="photo">Photo</CFormLabel>
              {cameraOpen ? (
                <>
                  <div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </div>
                  <div>
                    <CButton onClick={capturePhoto} color="primary">
                      Capture Photo
                    </CButton>
                  </div>
                </>
              ) : (
                <CButton onClick={toggleCamera} color="primary">
                  Open Camera
                </CButton>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="photo">Photo</CFormLabel>

              {capturedPhoto && (
                <div>
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              )}
              {!capturedPhoto && imageUrl && (
                <div>
                  <img
                    src={imageUrl}
                    alt="Current"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                  />
                </div>
              )}
            </CCol>
          </CRow>
          <CCol md={12}>
            <CButton type="submit" color="primary">
              Update Patient
            </CButton>
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default UpdatePatient;

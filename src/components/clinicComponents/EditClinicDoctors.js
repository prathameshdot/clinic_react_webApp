// src/components/EditDoctor.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CFormLabel,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from "@coreui/react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const UpdateDoctor = () => {
  const [doctor, setDoctor] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const webcamRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState({
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
    clinicId: "clinicId",
    photo: "",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}doctor/${id}`);
        setDoctor(response.data);
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
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.id]: e.target.value,
    });
  };

  const toggleCamera = () => {
    setCameraOpen((prev) => !prev);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const formData = new FormData();

    // Ensure the entire doctor object is being appended, along with the image file.
    formData.append(
      "request",
      JSON.stringify({
        ...doctor, // Contains all the doctor details
        photo: photoName, // The name of the photo file
      }),
    );

    // Add the image file if available
    if (photoFile) {
      formData.append("file", photoFile); // Append the image file
    }

    try {
      // Make sure to include a slash before ${id} to form the correct endpoint
      const res = await axios.put(
        `${config.apiUrl}doctor/updateDoctorForClinic/${id}`, // Fix URL here
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure multipart content type is set
          },
        },
      );

      if (res.status === 200) {
        toast.success("Updated Successfully!", { autoClose: 3000 });
      } else {
        throw new Error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      window.alert("Failed to update data. Please try again later.");
    }
    navigate(`/clinicdoctors/${clinicId}`); // Navigate to PatientDetails page

    setValidated(true);
  };

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("No screenshot available");
      return;
    }

    const filename = `${user.fullName}_${Date.now()}.jpg`;

    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      setPhotoFile(file);
      setCapturedPhoto(imageSrc); // Set the captured image as a base64 URL
      setPhotoName(filename);
      setUser({ ...user, photo: filename });
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  }, [user]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <CCard className="mb-4">
        <CCardHeader
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ lineHeight: "44px" }}>Update Doctor</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="input-group-append">
            <Link
              to={`/clinicDoctors/${user.clinicId}`}
              className="btn btn-primary"
            >
              Back
            </Link>
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <CForm
            wasValidated={validated}
            onSubmit={handleSave}
            style={styles.form}
          >
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="fullName"
                  value={doctor.fullName}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  value={doctor.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="contactNo">Contact No</CFormLabel>
                <CFormInput
                  type="text"
                  id="contactNo"
                  value={doctor.contactNo}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="gender">Gender</CFormLabel>
                <CFormSelect
                  id="gender"
                  value={doctor.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormLabel htmlFor="specialization">Specialization</CFormLabel>
                <CFormInput
                  type="text"
                  id="specialization"
                  value={doctor.specialization}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="experience">Experience</CFormLabel>
                <CFormInput
                  type="number"
                  id="experience"
                  value={doctor.experience}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormInput
                  type="text"
                  id="address"
                  value={doctor.address}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="country">Country</CFormLabel>
                <CFormInput
                  type="text"
                  id="country"
                  value={doctor.country}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormLabel htmlFor="city">City</CFormLabel>
                <CFormInput
                  type="text"
                  id="city"
                  value={doctor.city}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="postalCode">Postal Code</CFormLabel>
                <CFormInput
                  type="text"
                  id="postalCode"
                  value={doctor.postalCode}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="qualification">Qualification</CFormLabel>
                <CFormInput
                  type="text"
                  id="qualification"
                  value={doctor.qualification}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="regNo">Registration No</CFormLabel>
                <CFormInput
                  type="text"
                  id="regNo"
                  value={doctor.regNo}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
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
                      src={capturedPhoto} // Use base64 image
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
            <div className="text-right" style={styles.buttonContainer}>
              <CButton type="submit" color="primary">
                Update
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex",
  },
  buttonContainer: {
    textAlign: "right",
  },
};

export default UpdateDoctor;

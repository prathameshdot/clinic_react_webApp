import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../../config";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilEnvelopeOpen } from "@coreui/icons";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!username) {
        alert("Please enter your email address.");
        return;
      }

      const response = await axios.post(
        `${config.apiUrl}users/forgotPassword`,
        {
          username,
        },
      );

      if (response.status === 200) {
        toast.success("Password reset link sent to your email!");
        setTimeout(() => navigate("/login"), 1500); // Redirect after 1.5 seconds
      } else {
        toast.error("Failed to send password reset link.");
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send password reset link.";
      toast.error(errorMessage);
      console.error("Error:", error.response || error.message);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Forgot Password</h1>
                    <p className="text-body-secondary">
                      Enter your email address to receive a password reset link.
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeOpen} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="User Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit">
                          Send Reset Link
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Remembered?</h2>
                    <p>If you remember your password, you can login here.</p>
                    <Link to="/login">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Login
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;

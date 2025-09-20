import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
import { cilLockLocked, cilUser } from "@coreui/icons";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin"); // Added role state
  const [enabled, setEnabled] = useState(true); // Added enabled state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Client-side validation
      if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }

      // Debugging the request payload
      console.log("Registering user:", {
        username,
        password,
        enabled,
        role,
        email,
      });
      // Sending the registration request
      const response = await axios.post(`${config.apiUrl}users`, {
        username,
        password,
        enabled, // Ensure this matches your backend's field name
        role,
        email,
      });

      // Handle the response
      if (response.status === 201) {
        // Status code for resource creation
        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      } else {
        alert("Registration failed: " + response.statusText);
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );
      alert("Registration failed: " + (error.response?.data || error.message));
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
                  <CForm onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <p className="text-body-secondary">Create your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>Role</CInputGroupText>
                      <CFormInput
                        placeholder="Role"
                        autoComplete="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </CInputGroup>
                    {/* <CInputGroup className="mb-3">
                      <CInputGroupText>Enabled</CInputGroupText>
                      <CFormInput
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                      />
                    </CInputGroup> */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit">
                          Create Account
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/login">
                          <CButton color="link" className="px-0">
                            Already have an account? Login
                          </CButton>
                        </Link>
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
                    <h2>Welcome Back!</h2>
                    <p>
                      Already have an account? Sign in to access your dashboard.
                    </p>
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
    </div>
  );
};

export default Register;

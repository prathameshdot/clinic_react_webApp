// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch } from "react-redux";
// import config from "../../../config";

// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from "@coreui/react";
// import CIcon from "@coreui/icons-react";
// import { cilLockLocked, cilUser } from "@coreui/icons";

// // Redux action types
// const LOGIN_SUCCESS = "LOGIN_SUCCESS";

// const ClinicLogin = () => {
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${config.apiUrl}clinics/clinicLogin`, {
//         mobile,
//         password,
//       });

//       console.log("API Response:", response.data); // Debugging

//       if (response.status === 200) {
//         toast.success("Login successful!");

//         // Extract clinicID and role from response
//         const clinicID = response.data.id; // Adjust this if your field name is different
//         const role = "clinic"; // Assign role directly

//         console.log("Clinic ID:", clinicID); // Debugging
//         console.log("Role:", role); // Debugging

//         if (clinicID) {
//           localStorage.setItem("clinicID", clinicID); // Store clinicID in localStorage
//           localStorage.setItem("role", role); // Store role in localStorage
//           alert(`Role saved: ${role}`);
//           setTimeout(() => {
//             navigate("/clinicDashboard");
//           }, 1500); // Redirect after 1.5 seconds
//         } else {
//           toast.error("Clinic ID not found.");
//           console.error("Clinic ID not found in response:", response);
//         }
//       } else {
//         toast.error("Login failed. Please try again.");
//         console.error("Unexpected response:", response);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Login failed. Please try again.";
//       toast.error(errorMessage);
//       console.error("Login failed:", error.response || error.message);
//     }
//   };

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={8}>
//             <CCardGroup>
//               <CCard className="p-4">
//                 <CCardBody>
//                   <CForm onSubmit={handleLogin}>
//                     <h1>Clinic Login</h1>
//                     <p className="text-body-secondary">
//                       Sign In to your account
//                     </p>
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Enter your mobile number"
//                         autoComplete="mobile"
//                         value={mobile}
//                         onChange={(e) => setMobile(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="Password"
//                         autoComplete="current-password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CRow>
//                       <CCol xs={6}>
//                         <CButton color="primary" className="px-4" type="submit">
//                           Login
//                         </CButton>
//                       </CCol>
//                       <CCol xs={6} className="text-right">
//                         <Link to="/ForgotPassword_clinic">
//                           <CButton color="link" className="px-0">
//                             Forgot password?
//                           </CButton>
//                         </Link>
//                       </CCol>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//               <CCard
//                 className="text-white bg-primary py-5"
//                 style={{ width: "44%" }}
//               >
//                 <CCardBody className="text-center">
//                   <div>
//                     <h2>Sign up</h2>
//                     <p>
//                       Join our clinic today to experience healthcare that’s not
//                       just about treatment, but about care that’s convenient,
//                       connected, and comprehensive.
//                     </p>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//       <ToastContainer />
//     </div>
//   );
// };

// export default ClinicLogin;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
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

// Redux action types
const LOGIN_SUCCESS = "LOGIN_SUCCESS";

const ClinicLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.apiUrl}clinics/clinicLogin`, {
        mobile,
        password,
      });

      console.log("API Response:", response.data); // Debugging

      if (response.status === 200) {
        toast.success("Login successful!");

        // Extract clinicID and role from response
        const clinicID = response.data.id; // Adjust this if your field name is different
        const role = "clinic"; // Assign role directly

        console.log("Clinic ID:", clinicID); // Debugging
        console.log("Role:", role); // Debugging

        if (clinicID) {
          localStorage.setItem("clinicID", clinicID); // Store clinicID in localStorage
          localStorage.setItem("role", role); // Store role in localStorage
          alert(`Role saved: ${role}`);
          setTimeout(() => {
            navigate(`/ClinicDashboard/${clinicID}`);
          }, 1500); // Redirect after 1.5 seconds
        } else {
          toast.error("Clinic ID not found.");
          console.error("Clinic ID not found in response:", response);
        }
      } else {
        toast.error("Login failed. Please try again.");
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      console.error("Login failed:", error.response || error.message);
    }
  };

  const logout = () => {
    // localStorage.removeItem("clinicID");
    localStorage.removeItem("role");
    // Optionally, redirect to the login page or another page
    navigate("/"); // Redirect to home or login page
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Clinic Login</h1>
                    <p className="text-body-secondary">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Enter your mobile number"
                        autoComplete="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/ForgotPassword_clinic">
                          <CButton color="link" className="px-0">
                            Forgot password?
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
                    <h2>Sign up</h2>
                    <p>
                      Join our clinic today to experience healthcare that’s not
                      just about treatment, but about care that’s convenient,
                      connected, and comprehensive.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>

        <p style={{ textAlign: "center", margin: 0 }}>
  If you encounter any issues, please contact support.{" "}
  <a href="http://akash-kore-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
    Click here
  </a>
</p>

      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default ClinicLogin;

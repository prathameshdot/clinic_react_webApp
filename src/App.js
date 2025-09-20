import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import ForgotPassword from "./views/pages/login/ForgotPassword";
import { CSpinner, useColorModes } from "@coreui/react";
import "./scss/style.scss";

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const ClinicDefaultLayout = React.lazy(
  () => import("./components/clinicComponents/Layout/ClinicDefaultLayout"),
);

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const ClinicLogin = React.lazy(
  () => import("./views/pages/login/Clinic_login"),
);
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme",
  );
  const storedTheme = useSelector((state) => state.theme);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [clinicID, setClinicID] = useState(
    localStorage.getItem("clinicID") || null,
  ); // Retrieve clinicID

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme =
      urlParams.get("theme") &&
      urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);

    // Get role and clinicID from localStorage
    const storedRole = localStorage.getItem("role");
    const storedClinicID = localStorage.getItem("clinicID"); // Get clinicID from localStorage
    setRole(storedRole);
    setClinicID(storedClinicID); // Set clinicID state

    // Alert the role
    alert(`Role coming from localStorage: ${storedRole}`);
  }, [storedTheme, isColorModeSet, setColorMode]);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/Clinic_login"
            name="Login Page"
            element={<ClinicLogin />}
          />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={<Register />}
          />
          <Route
            exact
            path="/forgotpassword"
            name="Forgot password Page"
            element={<ForgotPassword />}
          />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          {/* Conditionally render DefaultLayout or ClinicDefaultLayout based on role */}
          {role === "clinic" ? (
            <>
              <Route
                path={`/ClinicDefaultLayout/${clinicID}`}
                name="Clinic Home"
                element={<ClinicDefaultLayout />}
              />
              <Route path="*" name="Home" element={<ClinicDefaultLayout />} />
            </>
          ) : (
            <Route path="*" name="Home" element={<DefaultLayout />} />
          )}
          <Route path="/" name="Login Page" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

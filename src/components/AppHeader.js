import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import config from "../config";

import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CBadge,
  CNavItem,
  useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilMenu,
  cilMoon,
  cilSun,
  cilUser,
} from "@coreui/icons";

import { AppHeaderDropdown } from "./header/index";

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme",
  );

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [appointments, setAppointments] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${config.apiUrl}appointment`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
          checkNotificationPermission();
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const checkNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      setNotificationPermission(true);
    }
  };

  const handleNotify = () => {
    if (notificationPermission) {
      // Code to send push notification goes here
      console.log("Sending push notification...");
    } else {
      // Ask for notification permission
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationPermission(true);
          // Code to send push notification goes here
          console.log("Sending push notification...");
        }
      });
    }
  };

  // Function to filter appointments by upcoming dates and times
  const filterUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.appointmentDate}T${appointment.appointmentTime}`,
      );
      return appointmentDateTime > now;
    });
  };

  const upcomingAppointments = filterUpcomingAppointments();

  return (
    <>
      <style>{`
        .position-relative {
          position: relative;
        }
        .position-absolute {
          position: absolute;
        }
        .top-0 {
          top: 0;
        }
        .start-100 {
          left: 100%;
        }
        .translate-middle {
          transform: translate(-50%, -50%);
        }
        .badge-rounded-pill {
          border-radius: 100%;
          padding: 0.25em 0.45em;
        }
        .notification-item {
          display: flex;
          align-items: center;
          white-space: normal;
          padding: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-icon {
          margin-right: 0.5rem;
          color: #007bff;
        }
        .notification-content {
          flex: 1;
        }
        .notification-patient-name {
          font-weight: bold;
        }
        .notification-doctor-name {
          color: #6c757d;
          margin-left: 0.25rem;
        }
        .notification-date-time {
          color: #6c757d;
          font-size: 0.875rem;
        }
      `}</style>
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
            onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: "-14px" }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav className="d-none d-md-flex">
            <CNavItem>
              <CNavLink
                href="#"
                style={{ fontWeight: "bold", color: "blue" }}
              ></CNavLink>
            </CNavItem>
          </CHeaderNav>
          <CHeaderNav className="ms-auto">
            <CDropdown variant="nav-item">
              <CDropdownToggle caret={false} className="position-relative">
                <CIcon icon={cilBell} size="lg" />
                <CBadge
                  color="danger"
                  className=" top-0 mb-start-100 translate-middle badge-rounded-pill"
                >
                  {upcomingAppointments.length}
                </CBadge>
              </CDropdownToggle>
              <CDropdownMenu
                style={{
                  minWidth: "300px",
                  transform: "translate3d(26.8px, 40.8px)",
                }}
              >
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <CDropdownItem
                      key={appointment.appointmentId}
                      className="notification-item"
                    >
                      <CIcon
                        icon={cilUser}
                        className="notification-icon"
                        size="lg"
                      />
                      <div className="notification-content">
                        <span className="notification-patient-name">
                          {appointment.patientName}
                        </span>
                        <span className="notification-doctor-name">
                          with Dr. {appointment.doctor.fullName}
                        </span>
                        <div className="notification-date-time">
                          {appointment.appointmentDate} at{" "}
                          {appointment.appointmentTime}
                        </div>
                      </div>
                    </CDropdownItem>
                  ))
                ) : (
                  <CDropdownItem>No upcoming appointments...</CDropdownItem>
                )}
              </CDropdownMenu>
            </CDropdown>

            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilEnvelopeOpen} size="lg" />
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === "dark" ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === "auto" ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === "light"}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode("light")}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === "dark"}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode("dark")}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === "auto"}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode("auto")}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>
      </CHeader>
    </>
  );
};

export default AppHeader;

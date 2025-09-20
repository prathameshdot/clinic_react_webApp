import React from "react";
import CIcon from "@coreui/icons-react";
import {
  AiFillMedicineBox,
  AiOutlineFileText,
  AiOutlineDollar,
} from "react-icons/ai";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import {
  FaUser,
  FaCalendarAlt,
  FaUserMd,
  FaClinicMedical,
} from "react-icons/fa";

const clinicID = localStorage.getItem("clinicID");

const Clinicnav = [
  {
    component: CNavItem,
    name: "ClinicDashboard",
    to: `/ClinicDashboard/${clinicID}`, // Include clinicID in path
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  {
    component: CNavItem,
    name: "Clinic Appointment Details",
    to: `/ClinicAppointmentDetails/${clinicID}`, // Include clinicID in path
    icon: <FaCalendarAlt className="nav-icon" />,
  },

  // {
  //   component: CNavItem,
  //   name: "OPD",
  //   to: `/OPD`, // Include clinicID in path
  //   icon: <FaUser className="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: "Clinic Patient ",
    to: `/clinicPatients/${clinicID}`, // Include clinicID in path
    icon: <FaUser className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Clinic Doctor",
    to: `/clinicdoctors/${clinicID}`, // Include clinicID in path
    icon: <FaUserMd className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Clinic Services",
    to: `/clinicservice/${clinicID}`, // Include clinicID in path
    icon: <FaUserMd className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Clinic Medicine Master",
    to: `/clinicmedicine/${clinicID}`, // Include clinicID in path
    icon: <FaUserMd className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Clinic Category Master",
    to: `/clinicCategory/${clinicID}`, // Include clinicID in path
    icon: <FaUserMd className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Clinic Expense ",
    to: `/clinicExpense/${clinicID}`, // Include clinicID in path
    icon: <FaUserMd className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Clinic Reports",
    to: `/clinicReport/${clinicID}`, // Include clinicID in path
    icon: <AiOutlineFileText className="nav-icon" />,
  },
];

export default Clinicnav;

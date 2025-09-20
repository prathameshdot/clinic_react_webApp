import React from "react";
import CIcon from "@coreui/icons-react";
import {
  AiFillMedicineBox,
  AiOutlineFileText,
  AiOutlineDollar,
} from "react-icons/ai";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import {
  FaUser,
  FaCalendarAlt,
  FaUserMd,
  FaClinicMedical,
} from "react-icons/fa";
import {
  cilSpeedometer,
  cilNotes,
  cilCalendar,
  cilPuzzle,
  cilDrop,
  cilDollar,
} from "@coreui/icons";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  {
    component: CNavItem,
    name: "Appointment",
    to: "/appointmentDetails",
    icon: <FaCalendarAlt className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Management",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Clinics",
        to: "/Clinics",
        icon: <FaClinicMedical className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Doctors",
        to: "/doctor",
        icon: <FaUserMd className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Patients",
        to: "/patientDetails",
        icon: <FaUser className="nav-icon" />,
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Services",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Treatment",
        to: "/treatment",
        icon: <FaCalendarAlt className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Services",
        to: "/services",
        icon: <FaUserMd className="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Inventory",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Medicine Master",
        to: "/medicineMaster",
        icon: <FaUserMd className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Category Master",
        to: "/categoryMaster",
        icon: <AiFillMedicineBox className="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Finance",
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Expense",
        to: "/Expense",
        icon: <AiOutlineDollar className="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Reports",
    to: "/Reports",
    icon: <AiOutlineFileText className="nav-icon" />,
  },
];

export default _nav;

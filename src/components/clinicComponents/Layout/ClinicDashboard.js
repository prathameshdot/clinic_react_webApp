import React from "react";

import ClinicWidgetsDropdown from "./ClinicWidgetsDropdown";
import ClinicUpcomingAppointments from "./ClinicUpcomingAppointments";
import { useParams } from "react-router-dom";

const clinicDashboard = () => {
  const { clinicId } = useParams(); // Get clinicId from URL params

  return (
    <>
      <h5>Clinic Dashboard for Clinic ID: {clinicId}</h5>
      <ClinicWidgetsDropdown className="mb-4" />
      <br></br>
      <ClinicUpcomingAppointments className="mb-4" />
    </>
  );
};

export default clinicDashboard;

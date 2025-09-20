import React from "react";

import WidgetsDropdown from "../widgets/WidgetsDropdown";
import UpcomingAppointments from "../widgets/UpcomingAppointments";

const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <br></br>
      <UpcomingAppointments className="mb-4" />
    </>
  );
};

export default Dashboard;

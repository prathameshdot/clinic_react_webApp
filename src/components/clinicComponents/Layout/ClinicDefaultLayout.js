import React from "react";
import {
  ClinicAppContent,
  ClinicAppSidebar,
  ClinicAppFooter,
  ClinicAppHeader,
} from "../../index";

const ClinicDefaultLayout = () => {
  return (
    <div>
      <ClinicAppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <ClinicAppHeader />
        <div className="body flex-grow-1">
          <ClinicAppContent />
        </div>
        <ClinicAppFooter />
      </div>
    </div>
  );
};

export default ClinicDefaultLayout;

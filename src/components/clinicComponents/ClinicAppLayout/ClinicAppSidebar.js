import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from "@coreui/react";
import { ClinicAppSidebarNav } from "../ClinicAppSidebarNav";
import navigation from "../Layout/ClinicNav";
import clinicLogo from "../../../assets/clinic_logo.png";

const ClinicAppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          to="/"
          className="sidebar-brand"
          style={{
            textDecoration: "none",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Your logo JSX element */}
          <img
            src={clinicLogo} // Use the imported logo
            alt="Logo"
            style={{ height: "32px", marginRight: "8px" }}
          />

          {/* Clinic Admin */}
          <h6 style={{ margin: 0 }}>Clinic Admin Panel</h6>
        </CSidebarBrand>
      </CSidebarHeader>
      <ClinicAppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(ClinicAppSidebar);

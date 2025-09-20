import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <CSpinner color="primary" />
          </div>
        }
      >
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            );
          })}
          <Route path="/" element={<Navigate to="login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);

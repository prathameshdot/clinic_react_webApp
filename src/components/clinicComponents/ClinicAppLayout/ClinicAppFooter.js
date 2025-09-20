import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter className="px-4 flex justify-content-center">
      <div>
        <span>&copy; Clinic Admin Panel | Powered by </span>
        <a
          href="http://akash-kore-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
        >
          Akash Kore
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);

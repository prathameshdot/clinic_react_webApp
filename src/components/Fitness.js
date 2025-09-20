import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import clinic_logo from "../assets/clinic_logo.png"; // replace with your actual logo path
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import config from "../config";

const FitnessCertificate = () => {
  const { treatmentId } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [medicalDate, setMedicalDate] = useState("");

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}treatment/getAllTreatmentById/${treatmentId}`,
        );
        if (response.status === 200) {
          setTreatment(response.data);
        } else {
          console.error("Failed to fetch treatment. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching treatment:", error);
      }
    };

    fetchTreatment();
  }, [treatmentId]);

  const handleDownloadPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const margin = 10; // margin in mm
      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, imgHeight);

      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1,
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      // Incorporate patient's name into the filename
      const patientName = treatment.patient.fullName.replace(/\s+/g, "_");
      const filename = `Fitness_Certificate-${patientName}-${formattedDate}.pdf`;

      pdf.save(filename);
    });
  };

  const formatDateDMY = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!treatment) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CCard className="mb-5" style={styles.card}>
        <CCardHeader style={styles.cardHeader}>
          <span style={{ lineHeight: "44px" }}>Fitness Certificate</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to="/treatment" className="btn btn-primary">
              Back
            </Link>
            <div className="input-group-append">
              <CIcon
                icon={cilCloudDownload}
                style={{ marginLeft: "8px" }}
                size="lg"
                onClick={handleDownloadPDF}
              />
            </div>
          </div>
        </CCardHeader>
        <CCardBody className="mt-3 mx-4" id="pdf-content">
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <img src={clinic_logo} alt="Clinic Logo" style={styles.logo} />
            </div>
            <div style={styles.headerRight}>
              <p style={styles.headerText}>
                <strong>{treatment.doctor.fullName}</strong>
              </p>
              <p style={styles.headerText}>{treatment.doctor.specialization}</p>
              <p>
                Reg No.{treatment.doctor.regNo} | {treatment.doctor.contactNo}
              </p>
            </div>
            <div style={styles.headerRight}>
              <p style={styles.headerText}>Landmark Polyclinic</p>
              <p style={styles.headerText}>
                12/4, Paud Road, Kothrud, Pune - 411023
              </p>
              <p style={styles.headerText}>
                Ph: 0202526245, Timing: 09:00 AM - 02:00 PM, 05:00 PM - 09:00 PM
                | Closed: Monday
              </p>
            </div>
          </div>
          <hr />
          <div style={styles.bodyContent}>
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              FITNESS CERTIFICATE
            </p>
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              TO WHOMSOEVER IT MAY CONCERN
            </p>
            <p>
              This is to certify that I have carefully examined{" "}
              {treatment.patient.fullName}( Age -{" "}
              {treatment.patient.age || "N/A"} years) on{" "}
              {formatDateDMY(treatment.treatmentDate)}.
            </p>
            <p>
              {treatment.patient.gender === "Male" ? "He" : "She"} has
              Hypertension which is under control by medicines.
            </p>
            <p>
              <strong>Vision Details:</strong>
              <br />
              • His eyesight is - farsight vision 6/6, near vision 0.6 without
              correction.
              <br />
              • He is free from color blindness and able to identify and
              distinguish colors.
              <br />• He can read and understand display in English and
              Devanagari alphabets and numerals.
            </p>
            <p>
              <strong>Hearing Details:</strong>
              <br />• He is free from hearing defect and is able to hear and
              respond to spoken voice and alarms.
            </p>
            <p>
              <strong>Other Major Diseases:</strong> Diabetes
            </p>
            <p>
              {treatment.patient.gender === "Male" ? "He" : "She"} has taken all
              necessary vaccination.
            </p>
            <p>
              I certify that Mr./Ms. {treatment.patient.fullName} is physically
              fit for work.
            </p>
          </div>
          <div style={styles.footer}>
            <div style={styles.footerLeft}>
              <p>Place:</p>
              <p>
                Date:{" "}
                <input
                  type="text"
                  value={medicalDate}
                  onChange={(e) => setMedicalDate(e.target.value)}
                  placeholder="Today's Date"
                  style={styles.input}
                />
              </p>
            </div>
            <div style={styles.footerRight}>
              <p>{treatment.doctor.fullName}</p>
              <p>{treatment.doctor.specialization}</p>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

const styles = {
  card: {
    width: "100%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    textAlign: "left",
    flex: 1,
  },
  headerRight: {
    textAlign: "left",
    flex: 2,
  },
  headerText: {
    margin: 0,
    padding: 0,
  },
  logo: {
    width: "150px",
    height: "150px",
  },
  bodyContent: {
    padding: "20px 0",
  },
  input: {
    border: "none",
    borderBottom: "1px solid black",
    outline: "none",
    marginLeft: "10px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "20px",
  },
  footerLeft: {
    textAlign: "left",
  },
  footerRight: {
    textAlign: "right",
  },
};

export default FitnessCertificate;

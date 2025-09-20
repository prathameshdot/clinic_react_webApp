import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import config from "../config";
import clinic_logo from "../assets/clinic_logo.png";
import ChartTreatment from "../assets/ChartTreatment.png";

import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const ViewTreatment = () => {
  const { treatmentId } = useParams();
  const [treatment, setTreatment] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl1, setImageUrl1] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch treatment details
        const treatmentResponse = await axios.get(
          `${config.apiUrl}treatment/getAllTreatmentById/${treatmentId}`,
        );
        if (treatmentResponse.status === 200) {
          setTreatment(treatmentResponse.data);
        } else {
          console.error(
            "Failed to fetch treatment. Status:",
            treatmentResponse.status,
          );
        }
        // Fetch images if treatment details are available
        if (treatmentResponse.data && treatmentResponse.data.treatmentPhoto) {
          const response1 = await fetch(
            `${config.apiUrl}treatment/getImageByName/${treatmentResponse.data.treatmentPhoto}`,
          );
          if (!response1.ok) {
            throw new Error("Failed to fetch image 1");
          }
          const blob1 = await response1.blob();
          setImageUrl(URL.createObjectURL(blob1));
        }
        // alert(treatmentId);

        if (treatmentResponse.data && treatmentResponse.data.treatmentPhoto1) {
          const response2 = await fetch(
            `${config.apiUrl}treatment/getImageByName/${treatmentResponse.data.treatmentPhoto1}`,
          );
          if (!response2.ok) {
            throw new Error("Failed to fetch image 2");
          }
          const blob2 = await response2.blob();
          setImageUrl1(URL.createObjectURL(blob2)); // Assuming you have another state variable for the second image URL
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [treatmentId]); // Dependency array to re-run effect when treatmentId changes

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

      // Add watermark
      pdf.setFontSize(40);
      pdf.setTextColor(150, 150, 150);
      pdf.text(pdfWidth / 2 + margin, pdfHeight / 2 + margin, "", {
        align: "center",
        angle: 45,
      });

      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1,
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      // Create a dynamic filename based on patient's name and current date
      const patientName = treatment.patient.fullName || "Prescription";
      const filename = `Prescription-${patientName}-${formattedDate}.pdf`;

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
          <span style={{ lineHeight: "44px" }}>Prescription</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="input-group">
              <Link to="/treatment" className="btn btn-primary">
                Back
              </Link>
            </div>
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
        <CCardBody class="mt-3 mx-4" id="pdf-content">
          <div style={styles.watermark}>
            <img
              src={clinic_logo}
              alt="Watermark"
              style={styles.watermarkImg}
            />
          </div>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <p style={styles.headerText}>
                <strong>{treatment.doctor.fullName}</strong>
              </p>
              <p style={styles.headerText}>{treatment.doctor.specialization}</p>
              <p>
                Reg No.{treatment.doctor.regNo} | {treatment.doctor.contactNo}
              </p>
            </div>
            <div style={styles.headerCenter}>
              <img src={clinic_logo} alt="Clinic Logo" style={styles.logo} />
            </div>
            <div style={styles.headerRight}>
              <p style={styles.headerText}>Care Clinic</p>
              <p style={styles.headerText}>
                Near Axis Bank, Kothrud, Pune - 411038
              </p>
              <p style={styles.headerText}>Timing: 09:00 AM - 02:00 PM</p>
              <p style={styles.headerText}>Closed: Thursday</p>
              <p style={styles.headerText}>Ph: 09422380390</p>
            </div>
          </div>
          <hr />
          <div style={styles.patientInfo}>
            <p style={styles.patientInfoText}>
              <strong>ID:</strong> 266 - {treatment.patient.fullName} (M)
            </p>
            <p style={styles.patientInfoText}>
              <strong>Address:</strong> {treatment.patient.address}
            </p>
            <p style={styles.patientInfoText}>
              <strong>Age:</strong> {treatment.patient.age} ,
              <strong>BP:</strong> {treatment.bp}
            </p>
            <p style={styles.patientInfoText}>
              <strong>Temperature: </strong>
              {treatment.temp} , <strong>SPO2: </strong>
              {treatment.spo}%
            </p>
            <p style={styles.patientInfoText}>
              <strong>Diagnosis: </strong>
              {treatment.treatmentItemDetailsList.length > 0
                ? treatment.treatmentItemDetailsList[0].serviceItem.serviceName
                : "N/A"}
            </p>
          </div>
          <hr />
          <div style={styles.date}>
            <p>
              <strong>Date:</strong> {formatDateDMY(treatment.treatmentDate)}
            </p>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Medicine Name</th>
                <th style={styles.th}>Dosage</th>
                <th style={styles.th}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {treatment.treatmentMedicineDetailsList.map((medicine, index) => (
                <tr key={medicine.id}>
                  <td style={styles.td}>
                    {index + 1}. {medicine.medicine.medicineName}
                  </td>
                  <td style={styles.td}>{medicine.dosageInstruction}</td>
                  <td style={styles.td}>{medicine.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <strong>Advice Given:</strong>
          </p>
          <ul>
            <li>{treatment.description}</li>
          </ul>
          <div style={styles.container}>
            <div style={styles.charts}>
              <p>Chart 1</p>
              {imageUrl && (
                <img src={imageUrl} alt="Chart" style={styles.chartImg} />
              )}
              <p>{treatment.treatmentPhoto}</p>
            </div>
            <div style={styles.charts}>
              <p>Chart 2</p>
              {imageUrl1 && (
                <img src={imageUrl1} alt="Chart" style={styles.chartImg} />
              )}
              <p>{treatment.treatmentPhoto1}</p>
            </div>
          </div>
          <div className="mt-5 pt-5" style={styles.signature}>
            <p>Signature</p>
            <p>Dr. Onkar Bhave</p>
            <p>M.B.B.S., M.D., M.S.</p>
          </div>
          <p>Images</p>
        </CCardBody>
      </CCard>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: "100px",
  },
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
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.1,
    zIndex: -1,
  },
  watermarkImg: {
    width: "300px",
    height: "300px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    textAlign: "left",
  },
  headerCenter: {
    textAlign: "center",
    alignSelf: "center",
  },
  headerRight: {
    textAlign: "right",
  },
  headerText: {
    margin: 0,
    padding: 0,
  },
  logo: {
    width: "100px",
    height: "100px",
  },
  patientInfo: {
    paddingBottom: "10px",
  },
  patientInfoText: {
    margin: 0,
  },
  date: {
    textAlign: "right",
    paddingBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "10px",
  },
  th: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
  },
  td: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
  },
  charts: {
    marginBottom: "10px",
  },
  chartImg: {
    width: "40%",
  },
  signature: {
    margintop: "200px",
    textAlign: "right",
    paddingTop: "20px",
  },
};

export default ViewTreatment;

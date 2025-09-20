import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import config from "../config";
import clinic_logo from "../assets/clinic_logo.png";

import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const Billing = () => {
  const { treatmentId } = useParams();
  const [treatment, setTreatment] = useState(null);

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
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const ctx = canvas.getContext("2d");
      const watermark = new Image();
      watermark.src = clinic_logo;

      watermark.onload = () => {
        const { width, height } = canvas;
        const watermarkWidth = width * 0.2; // Adjust size as needed
        const watermarkHeight =
          (watermark.height / watermark.width) * watermarkWidth;
        const watermarkX = (width - watermarkWidth) / 2;
        const watermarkY = (height - watermarkHeight) / 2;

        ctx.globalAlpha = 0.1; // Adjust transparency as needed
        ctx.drawImage(
          watermark,
          watermarkX,
          watermarkY,
          watermarkWidth,
          watermarkHeight,
        );
        ctx.globalAlpha = 1.0;

        const imgData = canvas.toDataURL("image/png"); // Generate image data from canvas
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const imgWidth = 210;
        const pageHeight = (canvas.height * imgWidth) / canvas.width;
        const pageMargin = 10; // Add a margin of 10mm

        pdf.addImage(
          imgData,
          "PNG",
          pageMargin,
          pageMargin,
          imgWidth - 2 * pageMargin,
          pageHeight - 2 * pageMargin,
        );

        // current date

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

        // Create a dynamic filename based on patient's name and current date

        const patientName = treatment.patient.fullName || "Receipt";
        const filename = `Receipt-${patientName}-${formattedDate}.pdf`;

        pdf.save(filename);
      };
    });
  };

  const formatDateDMY = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertAmountToWords = (amount) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const thousands = ["", "Thousand", "Million", "Billion"];

    if (amount === 0) return "Zero";

    let wordRepresentation = "";
    let thousandCounter = 0;

    while (amount > 0) {
      let remainder = amount % 1000;
      if (remainder !== 0) {
        let part = "";
        if (remainder >= 100) {
          part += units[Math.floor(remainder / 100)] + " Hundred ";
          remainder %= 100;
        }
        if (remainder >= 10 && remainder < 20) {
          part += teens[remainder - 10] + " ";
        } else if (remainder >= 20) {
          part += tens[Math.floor(remainder / 10)] + " ";
          remainder %= 10;
        }
        if (remainder > 0 && remainder < 10) {
          part += units[remainder] + " ";
        }
        wordRepresentation =
          part + thousands[thousandCounter] + " " + wordRepresentation;
      }
      amount = Math.floor(amount / 1000);
      thousandCounter++;
    }

    return wordRepresentation.trim();
  };

  if (!treatment) {
    return <div>Loading...</div>;
  }

  // Calculate total amount for services
  const totalAmount = treatment.treatmentItemDetailsList.reduce(
    (total, item) => total + item.serviceItem.charge,
    0,
  );

  return (
    <>
      <CCard className="mb-5" style={styles.card}>
        <CCardHeader style={styles.cardHeader}>
          <span style={{ lineHeight: "44px" }}>Receipt</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="input-group ">
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
        <CCardBody class="mt-5 mx-5" id="pdf-content">
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <p style={styles.headerText}>
                <strong>Care Clinic</strong>
              </p>
              <p style={styles.headerText}>
                <strong> {treatment.doctor.fullName}</strong>
              </p>
              <p style={styles.headerText}>
                {treatment.doctor.specialization} | Reg No.
                {treatment.doctor.regNo} | {treatment.doctor.contactNo}
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
              <p style={styles.headerText}>
                Ph: 09422380390, Timing: 09:00 AM - 02:00 PM | Closed: Thursday
              </p>
            </div>
          </div>
          <hr />
          <div style={styles.patientInfo}>
            <div style={styles.patientInfoLeft}>
              <p style={styles.patientInfoText}>
                <strong>Patient Name:</strong> {treatment.patient.fullName}
              </p>
              <p style={styles.patientInfoText}>
                <strong>Age:</strong> {treatment.patient.age} Years
              </p>

              <p style={styles.patientInfoText}>
                <strong>Sex:</strong> {treatment.patient.gender}
              </p>
              <p style={styles.patientInfoText}>
                <strong>Patient Address:</strong> {treatment.patient.address}
              </p>
            </div>
            <div style={styles.patientInfoRight}>
              <p style={styles.patientInfoText}>
                <strong>IPD Bill No.:</strong> {treatment.id}
              </p>
              <p style={styles.patientInfoText}>
                <strong>Diagnosis: </strong>
                {treatment.treatmentItemDetailsList.length > 0
                  ? treatment.treatmentItemDetailsList[0].serviceItem
                      .serviceName
                  : "N/A"}
              </p>
              <p style={styles.patientInfoText}>
                <strong>Ph:</strong> {treatment.patient.mobile}
              </p>
              <p style={styles.patientInfoText}>
                <strong>Bill Date:</strong>{" "}
                {formatDateDMY(treatment.treatmentDate)}
              </p>
              {/* <p style={styles.patientInfoText}>
                <strong>Admission Date:</strong> [Admission Date]
              </p>
              <p style={styles.patientInfoText}>
                <strong>Discharge Date:</strong> [Discharge Date]
              </p> */}
            </div>
          </div>
          <hr />
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Sr</th>
                <th style={styles.th}>IPD Services Details</th>
                <th style={styles.th}>Rate</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {treatment.treatmentItemDetailsList.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{item.serviceItem.serviceName}</td>
                  <td style={styles.td}>{item.serviceItem.charge}</td>
                  <td style={styles.td}>1</td>
                  <td style={styles.td}>{item.serviceItem.charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div style={styles.totalAmount}>
            <p>
              <strong>Total Amount:</strong> ₹ {totalAmount}
            </p>
            <p>
              <strong>Total Amount (in words):</strong>{" "}
              {convertAmountToWords(totalAmount)} Rupees Only
            </p>
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
  },
  headerCenter: {
    textAlign: "center",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientInfoLeft: {
    textAlign: "left",
  },
  patientInfoRight: {
    textAlign: "right",
  },
  patientInfoText: {
    margin: "5px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  totalAmount: {
    textAlign: "right",
    marginTop: "20px",
  },
};

export default Billing;

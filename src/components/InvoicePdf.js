import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    padding: 8,
    textAlign: "center",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    padding: 8,
    textAlign: "center",
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
});

const InvoicePDFDocument = ({ treatment }) => {
  const {
    patient,
    doctor,
    treatmentDate,
    description,
    treatmentItemDetailsList,
    treatmentMedicineDetailsList,
  } = treatment;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Treatment Invoice</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Patient Name:</Text>
          <Text style={styles.value}>{patient.fullName}</Text>
          <Text style={styles.label}>Patient Mobile:</Text>
          <Text style={styles.value}>{patient.mobile}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Doctor Name:</Text>
          <Text style={styles.value}>{doctor.fullName}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Treatment Date:</Text>
          <Text style={styles.value}>{treatmentDate}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Services:</Text>
          {treatmentItemDetailsList.map((item, index) => (
            <Text key={index} style={styles.value}>
              - {item.serviceItem.serviceName}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Medicines:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Sr. No</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Medicine</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Dosage</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Duration</Text>
              </View>
            </View>
            {treatmentMedicineDetailsList.map((medicine, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {medicine.medicine.medicineName}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {medicine.dosageInstruction}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{medicine.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const GeneratePDF = ({ selectedTreatment }) => {
  const downloadInvoice = () => {
    if (selectedTreatment) {
      return (
        <PDFDownloadLink
          document={<InvoicePDFDocument treatment={selectedTreatment} />}
          fileName="invoice.pdf"
        >
          {({ loading }) =>
            loading ? (
              "Loading document..."
            ) : (
              <button type="button" className="btn btn-primary">
                Download Invoice
              </button>
            )
          }
        </PDFDownloadLink>
      );
    }
    return null;
  };

  return <div>{downloadInvoice()}</div>;
};

export default GeneratePDF;

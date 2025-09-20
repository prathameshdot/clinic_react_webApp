// src/components/Expense.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import config from "../config";
import {
  CCard,
  CButton,
  CCardBody,
  CCardHeader,
  CTable,
  CFormLabel,
  CCol,
} from "@coreui/react";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}expense`);
        if (response.status === 200) {
          console.log(response.data);
          setExpenses(response.data);
        } else {
          console.error("Failed to fetch expenses. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleEdit = (expenseId) => {
    navigate(`/updateExpense/${expenseId}`);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`${config.apiUrl}expense/${expenseId}`);
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== expenseId),
        );
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const handleDownloadExcel = async () => {
    const input = document.getElementById("excel-content");
    if (!input) {
      console.error("Element with id 'excel-content' not found.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const table = input.querySelector("table");
    const rows = table.querySelectorAll("tr");

    const headerRow = worksheet.addRow(
      [...rows[0].querySelectorAll("th")].map((th) => th.innerText),
    );
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Yellow background
      };
      cell.font = {
        bold: true, // Bold text
      };
    });

    rows.forEach((row, index) => {
      if (index === 0) return;
      const rowData = [...row.querySelectorAll("td")].map((td) => td.innerText);
      worksheet.addRow(rowData);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "Expenses.xlsx");
    });
  };

  const formatDateDMY = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <CCard className="mb-5" style={styles.card}>
      <CCardHeader style={styles.cardHeader}>
        <span style={{ lineHeight: "44px" }}>Expenses</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="input-group">
            <Link to="/addExpense" className="btn btn-primary">
              Add
            </Link>
          </div>
          <div className="input-group-append">
            <CIcon
              icon={cilCloudDownload}
              style={{ marginLeft: "8px", cursor: "pointer" }}
              size="lg"
              onClick={handleDownloadExcel}
            />
          </div>
        </div>
      </CCardHeader>
      <CCardBody id="excel-content">
        <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <table className="table table-striped" style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Actions</th>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Responsible Person</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td style={{ alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        title="Edit Category"
                        onClick={() => handleEdit(expense.id)}
                      >
                        <AiFillEdit />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        title="Delete"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <FaTrash />
                      </CButton>
                    </div>
                  </td>
                  <td>{expense.id}</td>
                  <td>{expense.name}</td>
                  <td>{expense.description}</td>
                  <td>{formatDateDMY(expense.date)}</td>
                  <td>{expense.responsiblePerson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CCardBody>
    </CCard>
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
    padding: "8px 18px",
    borderBottom: "1px solid #ccc",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
  },
  table: {
    width: "100%",
    marginTop: "20px",
  },
  th: {
    padding: "8px",
    textAlign: "left",
  },
  td: {
    padding: "8px",
  },
};

export default Expense;

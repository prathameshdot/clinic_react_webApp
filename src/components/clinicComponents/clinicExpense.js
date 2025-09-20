import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FaTrash } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import config from "../../config";
import { CCard, CButton, CCardBody, CCardHeader, CTable } from "@coreui/react";

const ClinicExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { clinicId } = useParams();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}expense/findAllExpenseByClinicId/${clinicId}`,
        );
        if (response.status === 200) {
          setExpenses(response.data);
        } else {
          console.error("Failed to fetch expenses. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [clinicId]);

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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    const header = [
      "Actions",
      "ID",
      "Name",
      "Description",
      "Date",
      "Responsible Person",
    ];
    worksheet.addRow(header).font = { bold: true };

    expenses.forEach((expense) => {
      worksheet.addRow([
        "Edit | Delete", // You can customize this to show buttons if needed
        expense.id,
        expense.name,
        expense.description,
        formatDateDMY(expense.date),
        expense.responsiblePerson,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "Expenses.xlsx");
    });
  };

  const formatDateDMY = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <CCard className="mb-5">
      <CCardHeader style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ lineHeight: "44px" }}>Expenses</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to={`/ClinicAddExpense/${clinicId}`}
            className="btn btn-primary"
          >
            Add
          </Link>
          <CIcon
            icon={cilCloudDownload}
            style={{ marginLeft: "8px", cursor: "pointer" }}
            size="lg"
            onClick={handleDownloadExcel}
          />
        </div>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div>Loading expenses...</div>
        ) : (
          <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            <CTable striped>
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Responsible Person</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          title="Edit"
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
            </CTable>
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default ClinicExpense;

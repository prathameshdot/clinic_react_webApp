import React, { useEffect, useState } from "react";
import axios from "axios";
import { CRow, CCol, CWidgetStatsD } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilCalendar, cilMedicalCross } from "@coreui/icons";
import { CChart } from "@coreui/react-chartjs";
import config from "../../config"; // Adjust the import path as necessary

const WidgetsDropdown = () => {
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);
  const [malePatientsCount, setMalePatientsCount] = useState(0);
  const [femalePatientsCount, setFemalePatientsCount] = useState(0);
  const [otherPatientsCount, setOtherPatientsCount] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState(0);

  useEffect(() => {
    fetchPatientsData();
    fetchAppointmentsData();
    fetchDoctorsCount();
  }, []);

  const fetchPatientsData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}patients/total`);
      if (response.status === 200) {
        const data = response.data;
        setTotalPatientsCount(data.totalPatients || 0);
        setMalePatientsCount(data.malePatients || 0);
        setFemalePatientsCount(data.femalePatients || 0);
        setOtherPatientsCount(data.otherPatients || 0);
      } else {
        console.error(
          "Failed to fetch patients data. Status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error fetching patients data:", error);
    }
  };

  const fetchAppointmentsData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}appointment/counts`);
      if (response.status === 200) {
        const data = response.data;
        setTotalAppointments(data.totalCount || 0);
        setCompletedCount(data.completedCount || 0);
        setScheduledCount(data.scheduledCount || 0);
        setCancelledCount(data.cancelledCount || 0);
      } else {
        console.error(
          "Failed to fetch appointments data. Status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error fetching appointments data:", error);
    }
  };

  const fetchDoctorsCount = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}doctor/total`);
      if (response.status === 200) {
        setTotalDoctorsCount(response.data || 0);
      } else {
        console.error(
          "Failed to fetch doctors count. Status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error fetching doctors count:", error);
    }
  };

  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  const widgetHeight = { height: "250px" };

  const widgetData = [
    {
      icon: cilUser,
      bgColor: "#3b5998",
      title: "Total Patients",
      value: totalPatientsCount.toString(),
      subValues: [
        { title: "Male", value: malePatientsCount.toString() },
        { title: "Female", value: femalePatientsCount.toString() },
        { title: "Other", value: otherPatientsCount.toString() },
      ],
      chartData: [65, 59, 84, 84, 51, 55, 40],
    },
    {
      icon: cilCalendar,
      bgColor: "#00aced",
      title: "Total Appointments",
      value: totalAppointments.toString(),
      subValues: [
        { title: "Completed", value: completedCount.toString() },
        { title: "Scheduled", value: scheduledCount.toString() },
        { title: "Cancelled", value: cancelledCount.toString() },
      ],
      chartData: [1, 13, 9, 17, 34, 41, 38],
    },
    {
      icon: cilMedicalCross,
      bgColor: "#4875b4",
      title: "Total Doctors",
      value: totalDoctorsCount.toString(),
      chartData: [78, 81, 80, 45, 34, 12, 40],
    },
  ];

  return (
    <CRow className="g-3">
      {widgetData.map((widget, index) => (
        <CCol sm={6} xl={4} xxl={4} key={index}>
          <CWidgetStatsD
            className="h-100"
            chart={
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      backgroundColor: "rgba(255,255,255,.1)",
                      borderColor: "rgba(255,255,255,.55)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: widget.chartData,
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            }
            icon={
              <CIcon
                icon={widget.icon}
                height={52}
                className="my-4 text-white"
              />
            }
            values={[
              { title: widget.title, value: widget.value },
              ...(widget.subValues
                ? widget.subValues.map((subValue) => ({
                    title: subValue.title,
                    value: subValue.value,
                  }))
                : []),
            ]}
            style={{
              "--cui-card-cap-bg": widget.bgColor,
              ...widgetHeight,
            }}
          />
        </CCol>
      ))}
    </CRow>
  );
};

export default WidgetsDropdown;

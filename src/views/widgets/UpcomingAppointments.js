import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CCardBody,
  CCard,
} from "@coreui/react";
import { parseISO, isBefore, addDays, startOfDay, subDays } from "date-fns";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpcomingAppointments.css";

const localizer = momentLocalizer(moment);

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStart, setCurrentStart] = useState(startOfDay(new Date())); // Starting today
  const [currentEnd, setCurrentEnd] = useState(
    addDays(startOfDay(new Date()), 7),
  ); // Ending in 7 days

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}appointment`);
        console.log(response.data); // Log the data
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      scheduleNotifications(appointments);
    }
  }, [appointments]);

  const scheduleNotifications = (appointments) => {
    appointments.forEach((appointment) => {
      const appointmentDate = parseISO(
        `${appointment.appointmentDate}T${appointment.appointmentTime}`,
      );
      const notificationTime = subDays(appointmentDate, 1);
      const now = new Date();
      if (notificationTime > now) {
        const timeout = notificationTime.getTime() - now.getTime();
        setTimeout(() => {
          toast.info(
            `Upcoming appointment for ${appointment.patientName} with Dr. ${appointment.doctor.fullName} in 24 hours!`,
            {
              position: "top-right",
              autoClose: false,
            },
          );
        }, timeout);
      }
    });
  };

  const filterAndSortAppointments = (appointments) => {
    const filteredAppointments = appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.appointmentDate);
      return (
        isBefore(currentStart, appointmentDate) &&
        isBefore(appointmentDate, currentEnd)
      );
    });

    return filteredAppointments.sort((a, b) => {
      const dateA = parseISO(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = parseISO(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateA - dateB;
    });
  };

  const upcomingAppointments = filterAndSortAppointments(appointments);

  const events = appointments.map((appointment) => ({
    title: `${appointment.patientName} with ${appointment.doctor.fullName}`,
    start: new Date(
      `${appointment.appointmentDate}T${appointment.appointmentTime}`,
    ),
    end: new Date(
      `${appointment.appointmentDate}T${appointment.appointmentTime}`,
    ),
    allDay: false,
  }));

  const showNextAppointments = () => {
    const newStart = addDays(currentStart, 7);
    const newEnd = addDays(currentEnd, 7);
    setCurrentStart(newStart);
    setCurrentEnd(newEnd);
  };

  return (
    <CCardBody >
      <ToastContainer />
      <CCard className="upcoming-appointments-card">
        <h3 className="card-title">Upcoming Appointments</h3>
        <p className="card-subtitle">
          Quick access to appointments for the next 7 days. More details
          available in the Appointments section.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <CTable hover responsive className="appointments-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Appointment No</CTableHeaderCell>
                  <CTableHeaderCell>Patient Name</CTableHeaderCell>
                  <CTableHeaderCell>Doctor</CTableHeaderCell>
                  <CTableHeaderCell>Session</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {upcomingAppointments.map((appointment) => (
                  <CTableRow key={appointment.appointmentId}>
                    <CTableDataCell>{appointment.appointmentId}</CTableDataCell>
                    <CTableDataCell>{appointment.patientName}</CTableDataCell>
                    <CTableDataCell>
                      {appointment.doctor.fullName}
                    </CTableDataCell>
                    <CTableDataCell>
                      {appointment.appointmentDate}{" "}
                      {appointment.appointmentTime}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CButton
              color="primary"
              className="show-next-button"
              onClick={showNextAppointments}
            >
              Show Next 7 Days
            </CButton>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, margin: "50px 0" }}
              className="appointments-calendar"
            />
          </>
        )}
        <CButton
          color="primary"
          className="show-all-button"
          onClick={() => (window.location.href = "/appointmentDetails")}
        >
          Show all Appointments
        </CButton>
      </CCard>
    </CCardBody>
  );
};

export default UpcomingAppointments;

import React from "react";
const userService = React.lazy(() => import("./views/pages/login/userService"));

const EditTreatment = React.lazy(() => import("./components/EditTreatment"));
const viewTreatment = React.lazy(() => import("./components/viewTreatment"));
const Reports = React.lazy(() => import("./components/Reports"));
const billing = React.lazy(() => import("./components/billing"));
const Medical = React.lazy(() => import("./components/Medical"));
const Fitness = React.lazy(() => import("./components/Fitness"));
const Expense = React.lazy(() => import("./components/Expense"));
const addExpense = React.lazy(() => import("./components/addExpense"));
const Clinics = React.lazy(() => import("./components/Clinics"));
const AddClinics = React.lazy(() => import("./components/AddClinics"));
const EditClinic = React.lazy(() => import("./components/EditClinic"));

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const ClinicDashboard = React.lazy(
  () => import("./components/clinicComponents/Layout/ClinicDashboard"),
);

const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const Typography = React.lazy(
  () => import("./views/theme/typography/Typography"),
);
const AddPatient = React.lazy(() => import("./components/addpatient"));
const AddOpd = React.lazy(() => import("./components/clinicComponents/AddOpd"));
const UpdatePatient = React.lazy(() => import("./components/updatePatient"));
const UpdateDoctor = React.lazy(() => import("./components/updateDoctor"));
const updateExpense = React.lazy(() => import("./components/updateExpense"));
const updateMedicineMaster = React.lazy(
  () => import("./components/updateMedicineMaster"),
);

const updateAppointments = React.lazy(
  () => import("./components/updateAppointments"),
);

const EditClinicPatients = React.lazy(
  () => import("./components/clinicComponents/EditClinicPatients"),
);

const EditClinicMedicines = React.lazy(
  () => import("./components/clinicComponents/EditClinicMedicines"),
);

const EditClinicDoctors = React.lazy(
  () => import("./components/clinicComponents/EditClinicDoctors"),
);

const PatientDetails = React.lazy(() => import("./components/patientDetails"));
const OPD = React.lazy(() => import("./components/clinicComponents/OPD"));
const clinicpatients = React.lazy(
  () => import("./components/clinicComponents/clinicPatients"),
);
const clinicdoctors = React.lazy(
  () => import("./components/clinicComponents/clinicDoctors"),
);
const clinicCategory = React.lazy(
  () => import("./components/clinicComponents/clinicCategory"),
);

const clinicservice = React.lazy(
  () => import("./components/clinicComponents/clinicService"),
);

const clinicReport = React.lazy(
  () => import("./components/clinicComponents/clinicReport"),
);

const clinicmedicine = React.lazy(
  () => import("./components/clinicComponents/clinicMedicine"),
);

const clinicExpense = React.lazy(
  () => import("./components/clinicComponents/clinicExpense"),
);

const clinicAppointmentDetails = React.lazy(
  () => import("./components/clinicComponents/ClinicAppointmentDetails"),
);

const AddAppointment = React.lazy(() => import("./components/addappointment"));
const AppointmentDetails = React.lazy(
  () => import("./components/appointmentDetails"),
);
const Doctor = React.lazy(() => import("./components/doctor"));
const AddDoctor = React.lazy(() => import("./components/addDoctor"));
const AddTreatment = React.lazy(() => import("./components/addTreatment"));

const Treatment = React.lazy(() => import("./components/treatment"));
const AddServices = React.lazy(() => import("./components/addServices"));

const Services = React.lazy(() => import("./components/services"));
const Medicine = React.lazy(() => import("./components/medicineMaster"));
const AddCategoryMaster = React.lazy(
  () => import("./components/addCategoryMaster"),
);

const CategoryMaster = React.lazy(() => import("./components/categoryMaster"));
const Addmedicinemaster = React.lazy(
  () => import("./components/addmedicinemaster"),
);

// Base
const Accordion = React.lazy(() => import("./views/base/accordion/Accordion"));
const Breadcrumbs = React.lazy(
  () => import("./views/base/breadcrumbs/Breadcrumbs"),
);
const Cards = React.lazy(() => import("./views/base/cards/Cards"));
const Collapses = React.lazy(() => import("./views/base/collapses/Collapses"));
const ListGroups = React.lazy(
  () => import("./views/base/list-groups/ListGroups"),
);
const Navs = React.lazy(() => import("./views/base/navs/Navs"));
const Paginations = React.lazy(
  () => import("./views/base/paginations/Paginations"),
);
const Placeholders = React.lazy(
  () => import("./views/base/placeholders/Placeholders"),
);
const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
const Progress = React.lazy(() => import("./views/base/progress/Progress"));
const Spinners = React.lazy(() => import("./views/base/spinners/Spinners"));
const Tables = React.lazy(() => import("./views/base/tables/Tables"));
const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));

// Buttons
const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
const ButtonGroups = React.lazy(
  () => import("./views/buttons/button-groups/ButtonGroups"),
);
const Dropdowns = React.lazy(
  () => import("./views/buttons/dropdowns/Dropdowns"),
);

//Forms
const ChecksRadios = React.lazy(
  () => import("./views/forms/checks-radios/ChecksRadios"),
);
const FloatingLabels = React.lazy(
  () => import("./views/forms/floating-labels/FloatingLabels"),
);
const FormControl = React.lazy(
  () => import("./views/forms/form-control/FormControl"),
);
const InputGroup = React.lazy(
  () => import("./views/forms/input-group/InputGroup"),
);
const Layout = React.lazy(() => import("./views/forms/layout/Layout"));
const Range = React.lazy(() => import("./views/forms/range/Range"));
const Select = React.lazy(() => import("./views/forms/select/Select"));
const Validation = React.lazy(
  () => import("./views/forms/validation/Validation"),
);

const Charts = React.lazy(() => import("./views/charts/Charts"));

// Icons
const CoreUIIcons = React.lazy(
  () => import("./views/icons/coreui-icons/CoreUIIcons"),
);
const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));

// Notifications
const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
const Toasts = React.lazy(() => import("./views/notifications/toasts/Toasts"));

const Widgets = React.lazy(() => import("./views/widgets/Widgets"));
const UpcomingAppointments = React.lazy(
  () => import("./views/widgets/UpcomingAppointments"),
);

const ClinicUpcomingAppointments = React.lazy(
  () =>
    import("./components/clinicComponents/Layout/ClinicUpcomingAppointments"),
);

const ClinicAddAppointments = React.lazy(
  () => import("./components/clinicComponents/clinicAddAppointments"),
);

const ClinicAddCategory = React.lazy(
  () => import("./components/clinicComponents/clinicAddCategory"),
);

const ClinicAddDoctors = React.lazy(
  () => import("./components/clinicComponents/clinicAddDoctors"),
);

const ClinicAddExpense = React.lazy(
  () => import("./components/clinicComponents/clinicAddExpense"),
);

const ClinicAddMedicine = React.lazy(
  () => import("./components/clinicComponents/clinicAddMedicines"),
);

const ClinicAddPatients = React.lazy(
  () => import("./components/clinicComponents/clinicAddPatients"),
);

const ClinicAddServices = React.lazy(
  () => import("./components/clinicComponents/clinicAddServices"),
);

const ClinicAddTreatment = React.lazy(
  () => import("./components/clinicComponents/clinicAddTreatments"),
);

const EditClinicAppointment = React.lazy(
  () => import("./components/clinicComponents/EditClinicAppointmentDetails"),
);

const addHairTrichology = React.lazy(
  () => import("./components/addHairTrichology"),
);

const ClinicWidgetsDropdown = React.lazy(
  () => import("./components/clinicComponents/Layout/ClinicWidgetsDropdown"),
);

const routes = [
  { path: "/userService", name: "userService", element: userService },
  {
    path: "/",
    exact: true,
    name: "Home",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: Dashboard,
  },

  {
    path: "/ClinicDashboard/:clinicId",
    name: "ClinicDashboard",
    element: ClinicDashboard,
  },

  {
    path: "/theme",
    name: "Theme",
    element: Colors,
    exact: true,
  },
  {
    path: "/addpatient",
    name: "Add Patient",
    element: AddPatient,
  },

  {
    path: "/addpatient/:clinicId",
    name: "Add Patient",
    element: AddPatient,
  },

  {
    path: "/AddpOpd",
    name: "Add OPD",
    element: AddOpd,
  },

  {
    path: "/patientDetails",
    name: "PatientDetails",
    element: PatientDetails,
  },
  {
    path: "/OPD",
    name: "OPD",
    element: OPD,
  },
  {
    path: "/clinicpatients/:clinicId",
    name: "clinicpatients",
    element: clinicpatients,
  },

  {
    path: "/clinicmedicine/:clinicId",
    name: "clinicmedicine",
    element: clinicmedicine,
  },

  {
    path: "/clinicCategory/:clinicId",
    name: "clinicCategory",
    element: clinicCategory,
  },

  {
    path: "/clinicdoctors/:clinicId",
    name: "clinicdoctors",
    element: clinicdoctors,
  },
  {
    path: "/clinicReport/:clinicId",
    name: "clinicreport",
    element: clinicReport,
  },

  {
    path: "/clinicservice/:clinicId",
    name: "clinicservice",
    element: clinicservice,
  },

  {
    path: "/clinicExpense/:clinicId",
    name: "Clinic Expense",
    element: clinicExpense,
  },

  {
    path: "/ClinicAppointmentDetails/:clinicId",
    name: "clinicAppointmentDetails",
    element: clinicAppointmentDetails,
  },

  {
    path: "/updateAppointments/:appointmentId",
    name: "updateAppointments",
    element: updateAppointments,
  },

  {
    path: "editClinicMedicine/:medicineId",
    name: "EditClinicMedicines",
    element: EditClinicMedicines,
  },

  {
    path: "/EditClinicPatients/:id",
    name: "EditClinicPatients",
    element: EditClinicPatients,
  },

  {
    path: "/EditClinicDoctors/:id",
    name: "EditClinicDoctors",
    element: EditClinicDoctors,
  },

  {
    path: "/UpdatePatient/:id",
    name: "UpdatePatient",
    element: UpdatePatient,
  },
  {
    path: "/UpdateDoctor/:id",
    name: "UpdateDoctor",
    element: UpdateDoctor,
  },
  {
    path: "/EditClinic/:id",
    name: "EditClinic",
    element: EditClinic,
  },

  {
    path: "/updateExpense/:expenseId",
    name: "updateExpense",
    element: updateExpense,
  },

  {
    path: "/updateMedicineMaster/:medicineId",
    name: "updateMedicineMaster",
    element: updateMedicineMaster,
  },

  { path: "/addappointment", name: "Add Appointment", element: AddAppointment },
  {
    path: "/viewTreatment/:treatmentId",
    name: "View Treatment",
    element: viewTreatment,
  },
  { path: "//Reports", name: "Reports", element: Reports },
  { path: "//billing/:treatmentId", name: "billing", element: billing },
  {
    path: "/appointmentDetails",
    name: "Appointment Details",
    element: AppointmentDetails,
  },
  { path: "/doctor", name: "Doctor", element: Doctor },
  { path: "/addDoctor", name: "Doctor", element: AddDoctor },
  { path: "/addtreatment", name: "Add Treatment", element: AddTreatment },
  {
    path: "//EditTreatment/:id",
    name: "Add Treatment",
    element: EditTreatment,
  },

  { path: "/treatment", name: "Treatment", element: Treatment },
  { path: "/addServices", name: "Add Services", element: AddServices },

  { path: "/services", name: "Services", element: Services },
  { path: "/medicineMaster", name: "Medicine Master", element: Medicine },
  {
    path: "/addCategoryMaster",
    name: "Add Category Master",
    element: AddCategoryMaster,
  },

  { path: "/categoryMaster", name: "Category Master", element: CategoryMaster },
  { path: "/addmedicinemaster", name: "Category", element: Addmedicinemaster },

  { path: "/theme/colors", name: "Colors", element: Colors },
  { path: "/theme/typography", name: "Typography", element: Typography },
  { path: "/base", name: "Base", element: Cards, exact: true },
  { path: "/base/accordion", name: "Accordion", element: Accordion },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", element: Breadcrumbs },
  { path: "/base/cards", name: "Cards", element: Cards },
  { path: "/base/collapses", name: "Collapse", element: Collapses },
  { path: "/base/list-groups", name: "List Groups", element: ListGroups },
  { path: "/base/navs", name: "Navs", element: Navs },
  { path: "/base/paginations", name: "Paginations", element: Paginations },
  { path: "/base/placeholders", name: "Placeholders", element: Placeholders },
  { path: "/base/popovers", name: "Popovers", element: Popovers },
  { path: "/base/progress", name: "Progress", element: Progress },
  { path: "/base/spinners", name: "Spinners", element: Spinners },
  { path: "/base/tables", name: "Tables", element: Tables },
  { path: "/base/tooltips", name: "Tooltips", element: Tooltips },
  { path: "/buttons", name: "Buttons", element: Buttons, exact: true },
  { path: "/buttons/buttons", name: "Buttons", element: Buttons },
  { path: "/buttons/dropdowns", name: "Dropdowns", element: Dropdowns },
  {
    path: "/buttons/button-groups",
    name: "Button Groups",
    element: ButtonGroups,
  },
  { path: "/charts", name: "Charts", element: Charts },
  { path: "/forms", name: "Forms", element: FormControl, exact: true },
  { path: "/forms/form-control", name: "Form Control", element: FormControl },
  { path: "/forms/select", name: "Select", element: Select },
  {
    path: "/forms/checks-radios",
    name: "Checks & Radios",
    element: ChecksRadios,
  },
  { path: "/forms/range", name: "Range", element: Range },
  { path: "/forms/input-group", name: "Input Group", element: InputGroup },
  {
    path: "/forms/floating-labels",
    name: "Floating Labels",
    element: FloatingLabels,
  },
  { path: "/forms/layout", name: "Layout", element: Layout },
  { path: "/forms/validation", name: "Validation", element: Validation },
  { path: "/icons", exact: true, name: "Icons", element: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", element: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", element: Flags },
  { path: "/icons/brands", name: "Brands", element: Brands },
  {
    path: "/notifications",
    name: "Notifications",
    element: Alerts,
    exact: true,
  },
  { path: "/notifications/alerts", name: "Alerts", element: Alerts },
  { path: "/notifications/badges", name: "Badges", element: Badges },
  { path: "/notifications/modals", name: "Modals", element: Modals },
  { path: "/notifications/toasts", name: "Toasts", element: Toasts },
  { path: "/widgets", name: "Widgets", element: Widgets },
  {
    path: "/UpcomingAppointments",
    name: "UpcomingAppointments",
    element: UpcomingAppointments,
  },

  {
    path: "/ClinicUpcomingAppointments/:clinicId",
    name: "ClinicUpcomingAppointments",
    element: ClinicUpcomingAppointments,
  },

  { path: "//Medical/:treatmentId", name: "Medical", element: Medical },
  { path: "//Fitness/:treatmentId", name: "Fitness", element: Fitness },
  { path: "/Expense", name: "Expense", element: Expense },
  { path: "/addExpense", name: "Expense", element: addExpense },

  { path: "/Clinics", name: "Clinics", element: Clinics },
  { path: "/AddClinics", name: "AddClinics", element: AddClinics },

  // Add components:
  {
    path: "/ClinicAddAppointments/:clinicId",
    name: "Clinic Add Appointments",
    element: ClinicAddAppointments,
  },
  {
    path: "/ClinicAddCategory/:clinicId",
    name: "Clinic Add Category",
    element: ClinicAddCategory,
  },
  {
    path: "/ClinicAddDoctors/:clinicId",
    name: "Clinic Add Doctors",
    element: ClinicAddDoctors,
  },
  {
    path: "/ClinicAddExpense/:clinicId",
    name: "Clinic Add Expense",
    element: ClinicAddExpense,
  },
  {
    path: "/ClinicAddMedicine/:clinicId",
    name: "Clinic Add Medicine",
    element: ClinicAddMedicine,
  },
  {
    path: "/ClinicAddPatients/:clinicId",
    name: "Clinic Add Patients",
    element: ClinicAddPatients,
  },
  {
    path: "/clinicAddServices/:clinicId",
    name: "Clinic Add Services",
    element: ClinicAddServices,
  },
  {
    path: "/ClinicAddTreatment/:clinicId",
    name: "Clinic Add Treatment",
    element: ClinicAddTreatment,
  },

  {
    path: "/ClinicWidgetsDropdown/:clinicId",
    name: "ClinicWidgetsDropdown",
    element: ClinicWidgetsDropdown,
  },

  //Edit components:
  {
    path: "/EditClinicAppointmentDetails/:id",
    name: "Edit Clinic Appointment",
    element: EditClinicAppointment,
  },

  {
    path: "/addHairTrichology",
    name: "addHairTrichology",
    element: addHairTrichology,
  },
];

export default routes;

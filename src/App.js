import { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import AboutUs from "./pages/About/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import GetInvolved from "./pages/GetInvolved/GetInvolved";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import DonorList from "./pages/Admin/DonorList/DonorList";
import BloodRequestHistory from "./pages/Admin/BloodRequestHistory/BloodRequestHistory";
import AddDonors from "./pages/Admin/AddDonors/AddDonors";
import UserList from "./pages/Admin/UserList/UserList";
import UserDashboard from "./pages/User/UserDashboard/UserDashboard";
import MakeRequest from "./pages/User/MakeRequest/MakeRequest";
import DonateBlood from "./pages/User/DonateBlood/DonateBlood";
import RequestHistory from "./pages/User/RequestHistory/RequestHistory";
import DonorLists from "./pages/User/DonorLists/DonorLists";
import { NotFound } from "./components/ErrorHandlerPages/404/NotFound";
import Events from "./pages/Home/components/Events/Events";
import EquipmentLeasingPage from "./components/EquipmentLeasingPage/EquipmentLeasingPage";  // Import new page
import MakeOrganRequest from "./pages/User/MakeOrganRequest/MakeOrganRequest";
import OrganDonationRequests from "./pages/OrganDonationRequests/OrganDonationRequests";
import DonateOrgan from "./pages/User/DonateOrgan/DonateOrgan";

import ScrollToTop from "./components/util/ScrollToTop/ScrollToTop";
import { Navbar } from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { SimpleToast } from "./components/util/Toast/Toast";
import { useToast } from "./services/toastService";
import FundRequestForm from "./pages/User/RequestFunds";
import FundRequestHistory from "./pages/User/FundRequestHistory";
import FundRequestDonation from "./pages/DonateMoney";
import AdminLogin from "./pages/AdminLogin";
import AddDoctor from "./pages/Admin/AddDoctor";
import BloodDonationRequests from "./pages/Admin/DonationRequests";
import OrganRequestHistory from "./pages/OrganRequestHistory/OrganRequestHistory";
import DeanDashboard from "./pages/Dean/DeanDashboard/DeanDashboard";

function App() {
  const getTheme = () => JSON.parse(localStorage.getItem("dark")) || false;
  const [theme, setTheme] = useState(getTheme());

  const { toast, showToast, hideToast } = useToast();

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("dark", newTheme);
      showToast(
        `switched to ${newTheme ? 'dark' : 'light'} theme.`,
        "info"
      );
      return newTheme;
    });
  };

  return (
    <Router>
      <Fragment>
        <Navbar handleClick={toggleTheme} theme={theme} />
        <main>
          <Routes>
            {/* Original Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/medical-camp" element={<Events />} />
            <Route path="/register" element={<Register theme={theme} />} />
            <Route path="/login" element={<Login theme={theme} />} />
            <Route path="/donorlist" element={<DonorList />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/makeRequest" element={<MakeRequest />} />
            <Route path="/requestHistory" element={<RequestHistory />} />
            <Route path="/donateBlood" element={<DonateBlood />} />
            <Route path="/donors" element={<DonorLists />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/addDonors" element={<AddDonors />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/bloodRequests" element={<BloodRequestHistory />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/request-funds" element={<FundRequestForm />} />
            <Route path="/fund-request-history" element={<FundRequestHistory />} />
            <Route path="/fund-donation" element={<FundRequestDonation />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/blood-donation-requests" element={<BloodDonationRequests />} />
            <Route path="/makeOrganRequest" element={<MakeOrganRequest />} />
            <Route path="/organ-request-history" element={<OrganRequestHistory />} />
            <Route path="/dean-dashboard" element={<DeanDashboard />} />
            {/* New Equipment Leasing Route */}
            <Route path="/equipment-leasing" element={<EquipmentLeasingPage />} />
            <Route path="/organ-donation-requests" element={<OrganDonationRequests />} />
            <Route path="/donate-organ" element={<DonateOrgan />} />
            {/* NotFound Route */}
            <Route path="*" element={<NotFound theme={theme} />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <SimpleToast
          open={toast.open}
          severity={toast.severity}
          message={toast.message}
          handleCloseToast={hideToast}
        />
      </Fragment>
    </Router>
  );
}

export default App;

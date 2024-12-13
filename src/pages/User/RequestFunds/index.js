import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../../config/api";
import { useNavigate } from "react-router-dom";

const FundRequestForm = () => {
  const [amount, setAmount] = useState("");
  const [patientName, setPatientName] = useState("");
  const [description, setDescription] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of doctors
    fetch(`${END_POINT}/user/listDoctors`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const doctorList = data.map((doctor) => ({
          value: doctor.id,
          text: doctor.username,
        }));
        setDoctorList(doctorList);
      })
      .catch((error) => {
        console.error("Error fetching doctor list:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load doctor list. Please try again later.",
        });
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user_data"));
    const fundRequestData = {
      user_id: user.id,
      amount,
      patient_name: patientName,
      description,
      doctor_id: doctorId,
      account_number: accountNumber || null,
      ifsc: ifsc || null,
      bank_name: bankName || null,
      account_holder_name: accountHolderName || null,
    };

    setIsLoading(true); // Start loading

    axios
      .post(`${END_POINT}/fund-request/create`, fundRequestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then(() => {
        setIsLoading(false); // Stop loading
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Fund request submitted successfully!",
        });
        resetForm();
        navigate("/user-dashboard");
      })
      .catch((error) => {
        setIsLoading(false); // Stop loading
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit fund request. Please try again later.",
        });
      });
  };

  const resetForm = () => {
    setAmount("");
    setPatientName("");
    setDescription("");
    setDoctorId("");
    setAccountNumber("");
    setIfsc("");
    setBankName("");
    setAccountHolderName("");
  };

  const isFormValid = () => {
    return amount && patientName && description && doctorId;
  };

  return (
    <div className="container mt-5 mb-5 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-6 d-none d-md-block">
          <img
            src="https://cslbd71.com/wp-content/uploads/2023/06/fundraising_cropped-500x353-1.jpg"
            alt="Fund Request Illustration"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h1 className="text-center mb-4">Request Funds</h1>
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-4 bg-light rounded"
          >
            {/* Amount */}
            <div className="form-group">
              <label htmlFor="amount">
                Amount <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter the required amount"
              />
            </div>

            {/* Patient Name */}
            <div className="form-group">
              <label htmlFor="patientName">
                Patient Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                placeholder="Enter the patient's name"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Provide a brief description of the case"
              />
            </div>

            {/* Doctor Selection */}
            <div className="form-group">
              <label htmlFor="doctorId">
                Doctor <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                id="doctorId"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
              >
                <option value="">Select a Doctor</option>
                {doctorList.map((doctor) => (
                  <option key={doctor.value} value={doctor.value}>
                    {doctor.text}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Details */}
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                className="form-control"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter the account number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ifsc">IFSC Code</label>
              <input
                type="text"
                className="form-control"
                id="ifsc"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="Enter the IFSC code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                className="form-control"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter the bank name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountHolderName">Account Holder Name</label>
              <input
                type="text"
                className="form-control"
                id="accountHolderName"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter the account holder's name"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FundRequestForm;

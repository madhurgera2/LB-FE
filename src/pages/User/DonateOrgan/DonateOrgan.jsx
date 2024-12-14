import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { END_POINT } from "../../../config/api";
import { useNavigate } from "react-router-dom";

const DonateOrgan = () => {
  const [organType, setOrganType] = useState("");
  const [units, setUnits] = useState(1);
  const [dateOfDonation, setDateOfDonation] = useState("");
  const [timeOfDonation, setTimeOfDonation] = useState("");
  const navigate = useNavigate();

  const ORGAN_TYPES = [
    "KIDNEY", 
    "LIVER", 
    "HEART", 
    "LUNG", 
    "PANCREAS", 
    "CORNEA", 
    "BONE_MARROW"
  ];

  const resetForm = () => {
    setOrganType('');
    setUnits(1);
    setDateOfDonation('');
    setTimeOfDonation('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get the JWT token from localStorage
    const token = localStorage.getItem("jwtToken");
    
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to submit the donation request.",
      });
      return;
    }

    const requestData = {
      organType,
      units,
      dateOfDonation,
      timeOfDonation
    };

    axios
      .post(`${END_POINT}/organ-donation/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Organ donation request added successfully!",
        });
        resetForm();
        navigate("/user-dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Failed to add the organ donation request. Please try again later.",
        });
      });
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5 d-none d-md-block">
          <img
            src="https://static.india.com/wp-content/uploads/2022/11/Organ-Donation-5-Things-to-Keep-in-Mind-When-Considering-to-Donate-Organ.jpeg?impolicy=Medium_Widthonly&w=700"
            alt="Organ Donation"
            className="img-fluid rounded"
            style={{ marginTop: "60px" }}
          />
        </div>

        <div className="col-md-6">
          <h1 className="text-center mb-4 text-primary">Donate Organ</h1>
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-4 bg-light rounded"
          >
            {/* Organ Type */}
            <div className="form-group">
              <label htmlFor="organType" className="font-weight-bold">
                Organ Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                id="organType"
                value={organType}
                onChange={(e) => setOrganType(e.target.value)}
                required
              >
                <option value="">Select Organ Type</option>
                {ORGAN_TYPES.map((organ) => (
                  <option key={organ} value={organ}>
                    {organ}
                  </option>
                ))}
              </select>
            </div>

            {/* Units */}
            <div className="form-group">
              <label htmlFor="units" className="font-weight-bold">
                Units <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="units"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                required
                disabled
                min="1"
                placeholder="Number of organ units"
              />
            </div>

            {/* Date of Donation */}
            <div className="form-group">
              <label htmlFor="dateOfDonation" className="font-weight-bold">
                Date of Donation <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="dateOfDonation"
                value={dateOfDonation}
                onChange={(e) => setDateOfDonation(e.target.value)}
                required
              />
            </div>

            {/* Time of Donation */}
            <div className="form-group">
              <label htmlFor="timeOfDonation" className="font-weight-bold">
                Time of Donation <span className="text-danger">*</span>
              </label>
              <input
                type="time"
                className="form-control"
                id="timeOfDonation"
                value={timeOfDonation}
                onChange={(e) => setTimeOfDonation(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary">
                Submit Organ Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonateOrgan;
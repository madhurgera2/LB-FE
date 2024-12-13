import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../../config/api";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DonateBlood = () => {
  const [units, setUnits] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user_data"));
    if (!user.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User is not authenticated. Please login again.",
      });
      return;
    }

    const donorData = {
      user_id: user.id,
      units,
      dateOfDonation: date,
      timeOfDonation: time,
    };

    setIsLoading(true); // Start loading

    axios
      .post(`${END_POINT}/blood-donation/requestToDonate`, donorData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then(() => {
        setIsLoading(false); // Stop loading
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Donation data added successfully!",
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
          text: "Failed to add donation data. Please try again later.",
        });
      });
  };

  const resetForm = () => {
    setUnits("");
    setCity("");
    setAddress("");
    setDate("");
    setTime("");
  };

  const isFormValid = () => {
    return units && date && time;
  };

  return (
    <div className="container mt-5 mb-5 flex align-items-center justify-content-center">
      <div className="row w-[100%]">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Donate Blood</h1>
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-4 bg-light rounded"
          >
            {/* Units */}
            <div className="form-group">
              <label htmlFor="units">
                Units <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                required
                placeholder="Enter the number of units"
              />
            </div>

            {/* City */}
            {/* <div className="form-group">
              <label htmlFor="city">City <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Enter your city"
              />
            </div> */}

            {/* Address */}
            {/* <div className="form-group">
              <label htmlFor="address">Address <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter your address"
              />
            </div> */}

            {/* Date and Time */}
            <div className="form-group">
              <label htmlFor="date">
                Date <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="time">
                Time <span className="text-danger">*</span>
              </label>
              <input
                type="time"
                className="form-control"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
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

export default DonateBlood;

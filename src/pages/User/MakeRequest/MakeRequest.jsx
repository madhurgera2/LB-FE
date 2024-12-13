import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { END_POINT } from "../../../config/api";
import { useNavigate } from "react-router-dom";

function formatDeadlineToFullDateTime(deadline) {
  // Parse the input deadline
  const date = new Date(deadline);

  // Extract year, month, day, hours, minutes, and seconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Combine into the desired format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

const MakeRequest = () => {
  const [quantity, setQuantity] = useState(0);
  const [group, setGroup] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const resetForm = () => {
    setPatientName('');
    setGroup('');
    setQuantity(0);
    setDoctorId('');
    setDeadline('');
  };
  const navigate = useNavigate();
  

  useEffect(() => {
    // Fetch the list of doctors
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios
        .get(`${END_POINT}/user/listDoctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        })
        .then((response) => {
          const doctors = response.data.map((doctor) => ({
            value: doctor.id,
            text: doctor.username,
          }));
          setDoctorList(doctors);
        })
        .catch((error) => {
          console.error("Error fetching doctors:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load doctor list.",
          });
        });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get the JWT token from localStorage and user ID
    const token = localStorage.getItem("jwtToken");
    const user = JSON.parse(localStorage.getItem("user_data"));
    if (!user.id) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to submit the request.",
      });
      return;
    }

    const requestData = {
      user_id: user.id,
      units: quantity,
      blood_group: group,
      patient_name: patientName,
      doctor_id: Number(doctorId),
      require_before: formatDeadlineToFullDateTime(deadline),
    };

    // Include the token in the Authorization header
    axios
      .post(`${END_POINT}/blood-request/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Blood request added successfully!",
        });
        resetForm();
        navigate("/user-dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add the blood request. Please try again later.",
        });
      });
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        {/* Left Side Image */}
        <div className="col-md-6 mt-5 d-none d-md-block">
          <img
            src="/images/blood-request-banner.jpg" // Add your image source here
            alt="Donate Blood"
            className="img-fluid rounded"
            style={{ marginTop: "60px" }}
          />
        </div>

        {/* Right Side Form */}
        <div className="col-md-6">
          <h1 className="text-center mb-4 text-primary">Make Blood Request</h1>
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-4 bg-light rounded"
          >
            {/* Patient Name */}
            <div className="form-group">
              <label htmlFor="patientName" className="font-weight-bold">
                Patient Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                placeholder="Enter patient's full name"
              />
            </div>

            {/* Blood Group */}
            <div className="form-group">
              <label htmlFor="group" className="font-weight-bold">
                Blood Group <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                id="group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Quantity (Units) */}
            <div className="form-group">
              <label htmlFor="quantity" className="font-weight-bold">
                Quantity (Units) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                placeholder="Enter number of units"
              />
            </div>

            {/* Doctor (Select from list) */}
            <div className="form-group">
              <label htmlFor="doctorId" className="font-weight-bold">
                Doctor <span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                id="doctorId"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
              >
                <option value="">Select Doctor</option>
                {doctorList.map((doctor) => (
                  <option key={doctor.value} value={doctor.value}>
                    {doctor.text}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline Date */}
            <div className="form-group">
              <label htmlFor="deadline" className="font-weight-bold">
                Deadline Date & Time <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !patientName ||
                  !group ||
                  quantity <= 0 ||
                  !doctorId ||
                  !deadline
                }
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeRequest;

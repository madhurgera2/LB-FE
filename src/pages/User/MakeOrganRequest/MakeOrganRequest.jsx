import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { END_POINT } from "../../../config/api";
import { useNavigate } from "react-router-dom";

function formatDeadlineToFullDateTime(deadline) {
  const date = new Date(deadline);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

const MakeOrganRequest = () => {
  const [organType, setOrganType] = useState("");
  const [units, setUnits] = useState(1);
  const [patientName, setPatientName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [requireBefore, setRequireBefore] = useState("");
  const [doctorList, setDoctorList] = useState([]);
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
    setPatientName('');
    setDoctorId('');
    setRequireBefore('');
  };

  useEffect(() => {
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
      organType,
      units,
      patientName,
      requireBefore: formatDeadlineToFullDateTime(requireBefore),
      doctorId: Number(doctorId)
    };

    axios
      .post(`${END_POINT}/organ-request/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Organ request added successfully!",
        });
        resetForm();
        navigate("/user-dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add the organ request. Please try again later.",
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
          <h1 className="text-center mb-4 text-primary">Make Organ Request</h1>
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
                disabled
                className="form-control"
                id="units"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                required
                min="1"
                placeholder="Number of organ units"
              />
            </div>

            {/* Doctor (Select from list) */}
            <div className="form-group">
              <label htmlFor="doctorId" className="font-weight-bold">
                Consulting Doctor <span className="text-danger">*</span>
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

            {/* Deadline */}
            <div className="form-group">
              <label htmlFor="requireBefore" className="font-weight-bold">
                Required By <span className="text-danger">*</span>
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="requireBefore"
                value={requireBefore}
                onChange={(e) => setRequireBefore(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary">
                Submit Organ Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeOrganRequest;
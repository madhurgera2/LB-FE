import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../../config/api";

const BloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBloodDonationRequests = () => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("No token found, please login.");
      setLoading(false);
      return;
    }

    axios
      .get(`${END_POINT}/blood-donation/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blood donation requests:", error);
        setError("Failed to fetch blood donation requests");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBloodDonationRequests();
  }, []);

  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve Donation",
      input: "number",
      inputLabel: "Enter number of units to approve",
      inputAttributes: {
        min: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "Please enter a valid number of units";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("jwtToken");

        axios
          .post(
            `${END_POINT}/blood-donation/approveDonation/${id}`,
            { approved_units: result.value },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            Swal.fire("Success", "Donation approved successfully", "success");
            fetchBloodDonationRequests();
          })
          .catch((error) => {
            console.error("Error approving donation:", error);
            Swal.fire("Error", "Failed to approve donation", "error");
          });
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will reject the donation request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("jwtToken");

        axios
          .post(
            `${END_POINT}/blood-donation/rejectDonation/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            Swal.fire(
              "Rejected",
              "Donation request has been rejected.",
              "success"
            );
            fetchBloodDonationRequests();
          })
          .catch((error) => {
            console.error("Error rejecting donation:", error);
            Swal.fire("Error", "Failed to reject donation", "error");
          });
      }
    });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center text-primary mb-4">Blood Donation Requests</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : requests.length === 0 ? (
        <div className="alert alert-info text-center">
          No blood donation requests available at the moment.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Age</th>
                <th>Units</th>
                <th>Date of Donation</th>
                <th>Time of Donation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.user.username}</td>
                  <td>{request.user.mobile}</td>
                  <td>{request.user.gender}</td>
                  <td>{request.user.bloodgroup}</td>
                  <td>{request.user.age}</td>
                  <td>{request.units}</td>
                  <td>{request.dateOfDonation}</td>
                  <td>{request.timeOfDonation}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "COMPLETED"
                          ? "bg-success"
                          : request.status === "PENDING"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>
                    {request.status === "PENDING" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BloodDonationRequests;

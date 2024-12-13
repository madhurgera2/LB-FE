import React, { useEffect, useState } from "react";
import axios from "axios";
import { END_POINT } from "../../../config/api";

const FundRequestHistory = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    // if (userId) {
    fetchFundRequestHistory(userId);
    // } else {
    //   setError('No user logged in');
    //   setLoading(false);
    // }
  }, []);

  const fetchFundRequestHistory = (userId) => {
    const token = localStorage.getItem("jwtToken");

    // if (!token) {
    //   setError('User is not authenticated');
    //   setLoading(false);
    //   return;
    // }

    // Mock API response for testing
    const mockApiResponse = [
      {
        id: 1,
        amount: 5000,
        patient_name: "John Doe",
        description: "Emergency surgery required",
        doctor_id: 101,
        status: "accepted",
      },
      {
        id: 2,
        amount: 10000,
        patient_name: "Jane Smith",
        description: "Cancer treatment",
        doctor_id: 102,
        status: "pending",
      },
      {
        id: 3,
        amount: 2000,
        patient_name: "Mark Lee",
        description: "Routine checkup",
        doctor_id: 103,
        status: "rejected",
      },
    ];

    setTimeout(() => {
      setFundRequests(mockApiResponse);
      setLoading(false);
    }, 1000); // Simulate API delay

    // axios
    //   .get(`${END_POINT}/fundRequestHistory?id=${userId}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     setFundRequests(response.data);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching fund request history:", error);
    //     if (error.response && error.response.status === 401) {
    //       setError("Authentication failed. Please login again.");
    //     } else {
    //       setError(
    //         "Failed to fetch the fund request history. Please try again later."
    //       );
    //     }
    //     setLoading(false);
    //   });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Fund Request History</h1>

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Fund Request History Table */}
      {!loading && !error && (
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Patient Name</th>
                  <th>Description</th>
                  <th>Doctor ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fundRequests.length > 0 ? (
                  fundRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.amount}</td>
                      <td>{request.patient_name}</td>
                      <td>{request.description}</td>
                      <td>{request.doctor_id}</td>
                      <td>
                        <span
                          className={`badge ${
                            request.status === "accepted"
                              ? "bg-success"
                              : request.status === "rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No fund requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundRequestHistory;

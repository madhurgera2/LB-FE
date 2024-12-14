import React, { useEffect, useState } from "react";
import axios from "axios";
import { END_POINT } from "../../../config/api";

const FundRequestListing = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_data"));

    if (user.id) {
      fetchFundRequests(user.id);
    } else {
      setError("No user logged in");
      setLoading(false);
    }
  }, []);

  const fetchFundRequests = (userId) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    axios
      .get(`${END_POINT}/fund-request/list?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setFundRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fund requests:", error);
        if (error.response && error.response.status === 401) {
          setError("Authentication failed. Please login again.");
        } else {
          setError(
            "Failed to fetch the fund requests. Please try again later."
          );
        }
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Fund Request Listing</h1>

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

      {/* Fund Request Table */}
      {!loading && !error && (
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Doctor</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {fundRequests.length > 0 ? (
                  fundRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.patientName}</td>
                      <td>{request.description}</td>
                      <td>{request.amount}</td>
                      <td>
                        <span
                          className={`badge ${
                            request.status === "PENDING"
                              ? "bg-warning"
                              : request.status === "APPROVED" ||
                                request.status === "COMPLETED"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {request.status.charAt(0) +
                            request.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>
                        {request.doctor ? request.doctor.username : "N/A"}
                      </td>
                      <td>{new Date(request.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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

export default FundRequestListing;

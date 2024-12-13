import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { END_POINT } from "../../../config/api";

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_data'));

    if (user.id) {
      fetchRequestHistory(user.id);
    } else {
      setError('No user logged in');
      setLoading(false);
    }
  }, []);

  const fetchRequestHistory = (userId) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }

    axios
      .get(`${END_POINT}/blood-request/list?userId=${userId}`, {
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
        console.error('Error fetching request history:', error);
        if (error.response && error.response.status === 401) {
          setError('Authentication failed. Please login again.');
        } else {
          setError('Failed to fetch the request history. Please try again later.');
        }
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Request History</h1>

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

      {/* Request History Table */}
      {!loading && !error && (
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Require Before</th>
                  <th>Status</th>
                  <th>Doctor</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.patientName}</td>
                      <td>{request.bloodGroup}</td>
                      <td>{request.units}</td>
                      <td>{new Date(request.requireBefore).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            request.status === 'PENDING'
                              ? 'bg-warning'
                              : request.status === 'ACCEPTED'
                              ? 'bg-success'
                              : 'bg-danger'
                          }`}
                        >
                          {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{request.doctor ? request.doctor.username : 'N/A'}</td>
                      <td>{new Date(request.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      You have not made any requests yet.
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

export default RequestHistory;

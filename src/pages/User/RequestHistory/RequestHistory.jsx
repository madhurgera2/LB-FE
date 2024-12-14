import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../../config/api";

const BloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchBloodDonationRequests = () => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    const user = JSON.parse(localStorage.getItem("user_data"));

    if (!token) {
      setError("No token found, please login.");
      setLoading(false);
      return;
    }
    const filter = user.role === "admin" ? "" : `?userId=${user.id}`;

    axios
      .get(`${END_POINT}/blood-request/list${filter}`, {
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

  const fetchBloodInventory = () => {
    const token = localStorage.getItem("jwtToken");

    axios
      .get(`${END_POINT}/blood-bank/blood-group-inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching blood inventory:", error);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_data"));

    if (user.role === "admin") {
      setIsAdmin(true);
      fetchBloodInventory();
    }

    fetchBloodDonationRequests();
  }, []);

  const handleApproveAndAllot = (id, requestedUnits, bloodGroup) => {
    if (!inventory || inventory[bloodGroup] === undefined) {
      Swal.fire("Error", "Blood inventory data is unavailable.", "error");
      return;
    }

    Swal.fire({
      title: "Approve and Allot",
      html: `<p>Requested Units: ${requestedUnits}</p>
             <p>Available Units: ${inventory[bloodGroup]}</p>
             <input type="number" id="allotedUnits" class="swal2-input" placeholder="Enter allotted units" min="1" max="${inventory[bloodGroup]}"/>`,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const allottedUnits = parseFloat(
          document.getElementById("allotedUnits").value
        );
        if (
          !allottedUnits ||
          allottedUnits > inventory[bloodGroup] ||
          allottedUnits <= 0
        ) {
          Swal.showValidationMessage(
            "Please enter a valid number of units within the inventory limits."
          );
        }
        return allottedUnits;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("jwtToken");

        axios
          .post(
            `${END_POINT}/blood-request/approve/${id}`,
            { approvedUnits: result.value },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          )
          .then(() => {
            Swal.fire(
              "Success",
              "Request approved and units allotted successfully.",
              "success"
            );
            fetchBloodDonationRequests();
            fetchBloodInventory();
          })
          .catch((error) => {
            console.error("Error approving and allotting request:", error);
            Swal.fire(
              "Error",
              "Failed to approve and allot the request.",
              "error"
            );
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
          .post(`${END_POINT}/blood-request/reject/${id}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          })
          .then(() => {
            Swal.fire("Rejected", "Request has been rejected.", "success");
            fetchBloodDonationRequests();
          })
          .catch((error) => {
            console.error("Error rejecting request:", error);
            Swal.fire("Error", "Failed to reject the request.", "error");
          });
      }
    });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center text-primary mb-4">Blood Requests</h1>

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
                <th>Blood Group</th>
                <th>Doctor</th>
                <th>Units</th>
                <th>Status</th>
                <th>Deadline</th>
                {isAdmin && <th>Requested By</th>}
                {isAdmin && <th>Actions</th>}
                <th>Alloted Units</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.patientName}</td>
                  <td>{request.user.mobile}</td>
                  <td>{request.bloodGroup}</td>
                  <td>{request.doctor.username}</td>
                  <td>{request.units}</td>
                  <td>{request.requireBefore}</td>
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
                  {isAdmin && <td>{request.user.username}</td>}
                  {isAdmin && (
                    <td>
                      {request.status === "PENDING" && (
                        <>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                handleApproveAndAllot(
                                  request.id,
                                  request.units,
                                  request.bloodGroup
                                )
                              }
                            >
                              Approve & Allot
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleReject(request.id)}
                            >
                              Reject
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  )}
                  <td>{request.approvedUnits || 0}</td>
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

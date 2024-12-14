import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../config/api";

const OrganRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [inventoryList, setInventoryList] = useState([]);
  const [approveEnabled, setApproveEnabled] = useState(false);
  const [isDean, setIsDean] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_data"));
    if (user.role === "dean") {
      setIsDean(true);
    }
    fetchOrganRequests(user.role !== "dean" ? user.id : null);
  }, []);

  const fetchOrganRequests = (userId) => {
    const token = localStorage.getItem("jwtToken");
    const params = userId ? { userId } : {};

    axios
      .get(`${END_POINT}/organ-request/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        params,
      })
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching organ requests:", error);
        setError("Failed to fetch organ requests");
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load organ request history",
        });
      });
  };

  const fetchOrganInventory = (organType, requestId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .get(`${END_POINT}/organ-donation/list`, {
        params: {
          organType,
          status: "APPROVED",
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setInventoryList(response.data);
        setApproveEnabled(response.data.length > 0);
        Swal.fire({
          title: "Approval Confirmation",
          html:
            response.data.length > 0
              ? `<p>Matching inventory is available. Proceed to approve the request?</p>
               <ul>${response.data
                 .map(
                   (item) =>
                     `<li>${item.user.username} (${item.organType})</li>`
                 )
                 .join("")}</ul>`
              : "No matching inventory available for this request.",
          showCancelButton: true,
          confirmButtonText: "Approve",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            if (response.data.length === 0) {
              Swal.showValidationMessage(
                "Cannot approve without matching inventory."
              );
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            confirmApproval(requestId);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching organ inventory:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load organ inventory",
        });
      });
  };

  const handleApproveRequest = (requestId, organType) => {
    setSelectedRequest(requestId);
    fetchOrganInventory(organType, requestId);
  };

  useEffect(() => {
    console.log({ selectedRequest });
  }, [selectedRequest]);

  const confirmApproval = (requestId) => {
    const token = localStorage.getItem("jwtToken");
    console.log({ test: selectedRequest });

    axios
      .post(
        `${END_POINT}/organ-request/approve/${selectedRequest || requestId}`,
        {
          approvedUnits: 1.0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Approved",
          text: "Organ request has been approved",
        });
        fetchOrganRequests();
      })
      .catch((error) => {
        console.error("Error approving request:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to approve organ request",
        });
      });
  };

  const handleRejectRequest = (requestId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will reject the organ request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("jwtToken");

        axios
          .post(
            `${END_POINT}/organ-request/reject/${requestId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          )
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Rejected",
              text: "Organ request has been rejected",
            });
            fetchOrganRequests();
          })
          .catch((error) => {
            console.error("Error rejecting request:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to reject organ request",
            });
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center text-primary mb-4">
        Organ Requests Management
      </h1>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Patient Name</th>
            <th>Organ Type</th>
            <th>Units</th>
            <th>Required Before</th>
            <th>Status</th>
            {isDean && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.patientName}</td>
              <td>{request.organType}</td>
              <td>{request.units}</td>
              <td>{new Date(request.requireBefore).toLocaleString()}</td>
              <td>{request.status}</td>
              {isDean && (
                <td>
                  {request.status === "PENDING" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          handleApproveRequest(request.id, request.organType)
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganRequestHistory;

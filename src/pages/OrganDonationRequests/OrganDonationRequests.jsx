import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../config/api";
import { Modal, Button } from "react-bootstrap";

const OrganDonationRequests = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchOrganDonations();
  }, []);

  const fetchOrganDonations = () => {
    const token = localStorage.getItem("jwtToken");

    axios
      .get(`${END_POINT}/organ-donation/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        setDonations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching organ donations:", error);
        setError("Failed to fetch organ donations");
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load organ donation requests",
        });
      });
  };

  const handleApprove = (donationId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .post(
        `${END_POINT}/organ-donation/approve/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Approved",
          text: "Organ donation request has been approved",
        });
        fetchOrganDonations();
      })
      .catch((error) => {
        console.error("Error approving donation:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to approve organ donation request",
        });
      });
  };

  const handleReject = (donationId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .post(
        `${END_POINT}/organ-donation/reject/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "Organ donation request has been rejected",
        });
        fetchOrganDonations();
      })
      .catch((error) => {
        console.error("Error rejecting donation:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reject organ donation request",
        });
      });
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setModalShow(true);
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
      <h1 className="text-center text-primary mb-4">Organ Donation Requests</h1>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Donor Name</th>
            <th>Organ Type</th>
            <th>Date Of Donation</th>
            <th>Time Of Donation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.user.username}</td>
              <td>{donation.organType}</td>
              <td>{donation.dateOfDonation}</td>
              <td>{donation.timeOfDonation}</td>
              <td>{donation.status}</td>
              <td>
                {donation.status === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success btn-sm mr-2"
                      onClick={() => handleApprove(donation.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(donation.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Medical History Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Donor Medical Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonation && (
            <div>
              <p>
                <strong>Name:</strong> {selectedDonation.donorName}
              </p>
              <p>
                <strong>Organ Type:</strong> {selectedDonation.organType}
              </p>
              <p>
                <strong>Age:</strong> {selectedDonation.age}
              </p>
              <p>
                <strong>Blood Group:</strong> {selectedDonation.bloodGroup}
              </p>
              <p>
                <strong>Medical Conditions:</strong>{" "}
                {selectedDonation.medicalConditions || "None"}
              </p>
              <p>
                <strong>Previous Surgeries:</strong>{" "}
                {selectedDonation.previousSurgeries || "None"}
              </p>
              <p>
                <strong>Current Medications:</strong>{" "}
                {selectedDonation.currentMedications || "None"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrganDonationRequests;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { END_POINT } from "../../config/api";
import Swal from "sweetalert2";

const FundRequestDonation = () => {
  const [fundRequests, setFundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [donationAmount, setDonationAmount] = useState({});

  useEffect(() => {
    fetchFundRequests();
  }, []);

  const fetchFundRequests = () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    axios
      .get(`${END_POINT}/fund-request/list?status=APPROVED`, {
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
        setError("Failed to fetch the fund requests. Please try again later.");
        setLoading(false);
      });
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDonate = (requestId) => {
    const user = JSON.parse(localStorage.getItem("user_data"));

    if (!user || !donationAmount[requestId]) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid donation amount.",
      });
      return;
    }

    const payload = {
      fund_request_id: requestId,
      user_id: user.id,
      amount: donationAmount[requestId],
    };

    const token = localStorage.getItem("jwtToken");

    axios
      .post(`${END_POINT}/fund-donation/donate`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        Swal.fire({
          title: "Donate Now",
          html: `
            <div class='text-center'>
              <img 
                src='https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' 
                alt='QR Code' 
                class='img-fluid mb-3'
              />
              <p>Scan the QR code to complete your donation.</p>
            </div>
          `,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Donation Successful",
            text: "Thank you for your generosity!",
          });

          // Refetch the list after donation
          fetchFundRequests();
          setDonationAmount({}); // Reset donation amount
        });
      })
      .catch((error) => {
        console.error("Error processing donation:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to process the donation. Please try again later.",
        });
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Donate to Fund Requests</h1>

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row">
          {fundRequests.length > 0 ? (
            fundRequests.map((request) => (
              <div className="col-md-4 mb-4" key={request.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      {request.patientName}
                    </h5>
                    <p className="card-text">
                      {expandedDescription[request.id]
                        ? request.description
                        : `${request.description.slice(0, 100)}${
                            request.description.length > 100 ? "..." : ""
                          }`}
                      {request.description.length > 100 && (
                        <button
                          className="btn btn-link btn-sm p-0 ms-1"
                          onClick={() => toggleDescription(request.id)}
                        >
                          {expandedDescription[request.id]
                            ? "Show Less"
                            : "Show More"}
                        </button>
                      )}
                    </p>
                    <p>
                      <strong>Amount Required:</strong> {request.amount} <br />
                      <strong>Amount Raised:</strong>{" "}
                      {request.amountRaised || 0}
                    </p>
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter donation amount"
                        value={donationAmount[request.id] || ""}
                        onChange={(e) =>
                          setDonationAmount((prev) => ({
                            ...prev,
                            [request.id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleDonate(request.id)}
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-100">
              <p>No fund requests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FundRequestDonation;

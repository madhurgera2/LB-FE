import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin-dashboard.css";

function DeanDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center text-primary mb-5">Dean Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-warning rounded">
            <img
              src="https://static.india.com/wp-content/uploads/2022/11/Organ-Donation-5-Things-to-Keep-in-Mind-When-Considering-to-Donate-Organ.jpeg?impolicy=Medium_Widthonly&w=700"
              className="card-img-top"
              alt="Make Organ Request"
            />
            <div className="card-body">
              <h5 className="card-title">Organ Request History</h5>
              <p className="card-text">Click here to view organ requests.</p>
              <Link to="/organ-request-history" className="btn btn-warning btn-block">
                Go to Organ Request
              </Link>
            </div>
          </div>
        </div>
        {/* Organ Donation Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg border-danger rounded">
            <img
              src="https://static.india.com/wp-content/uploads/2022/11/Organ-Donation-5-Things-to-Keep-in-Mind-When-Considering-to-Donate-Organ.jpeg?impolicy=Medium_Widthonly&w=700"
              className="card-img-top"
              alt="Organ Donations"
            />
            <div className="card-body">
              <h5 className="card-title">Organ Donations</h5>
              <p className="card-text">Manage and review organ donation requests.</p>
              <Link to="/organ-donation-requests" className="btn btn-danger btn-block">
                View Organ Donations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeanDashboard;

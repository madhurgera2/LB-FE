import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin-dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center text-primary mb-5">Admin Dashboard</h1>
      <div className="row">
      <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-primary rounded">
            <img
              src="/images/blood-request-banner.jpg"
              className="card-img-top"
              alt="Make Request"
            />
            <div className="card-body">
              <h5 className="card-title">Blood Requests</h5>
              <p className="card-text">Click here to allocate blood to patient</p>
              <Link to="/requestHistory" className="btn btn-primary btn-block">
                Go to Blood Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-primary rounded">
            <img
              src="https://www.nhlbi.nih.gov/sites/default/files/styles/16x9_crop/public/2023-05/Blood-Donation-Bag-Connected-to-Heart-Shape_Stock-Illustration.jpg?h=9fb2ff0c&itok=h-HPhN-6"
              className="card-img-top"
              alt="Make Request"
            />
            <div className="card-body">
              <h5 className="card-title">Blood Donations</h5>
              <p className="card-text">Click here to see donation requests.</p>
              <Link
                to="/blood-donation-requests"
                className="btn btn-primary btn-block"
              >
                See Donation Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-info rounded">
            <img
              src="https://cslbd71.com/wp-content/uploads/2023/06/fundraising_cropped-500x353-1.jpg"
              className="card-img-top"
              alt="Request Funds"
            />
            <div className="card-body">
              <h5 className="card-title">Fund Requests</h5>
              <p className="card-text">Click here to check Fund Requests.</p>
              <Link to="/fund-donation" className="btn btn-info btn-block">
                Go To Fund Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-info rounded">
            <img
              src="https://qmedcenter.com/wp-content/uploads/2023/02/Vector-doctor-examining-a-patient-at-the-clinic-portraying-20-qualities-that-make-a-good-doctor.webp"
              className="card-img-top"
              alt="Request Funds"
            />
            <div className="card-body">
              <h5 className="card-title">Add Doctor</h5>
              <p className="card-text">Click here to check Add Doctor.</p>
              <Link to="/add-doctor" className="btn btn-danger btn-block">
                Add Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

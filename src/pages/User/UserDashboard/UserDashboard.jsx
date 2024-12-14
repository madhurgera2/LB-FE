import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const UserDashboard = () => {

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center text-primary mb-5">User Dashboard</h1>
      <div className="row">
        {/* Make Request Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-primary rounded">
            <img
              src="/images/blood-request-banner.jpg"
              className="card-img-top"
              alt="Make Request"
            />
            <div className="card-body">
              <h5 className="card-title">Make Request</h5>
              <p className="card-text">Click here to make a blood request.</p>
              <Link to="/makeRequest" className="btn btn-primary btn-block">
                Go to Make Request
              </Link>
            </div>
          </div>
        </div>

        {/* Request History Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-success rounded">
            <img
              src="/images/history.png"
              className="card-img-top"
              alt="Request History"
            />
            <div className="card-body">
              <h5 className="card-title">Request History</h5>
              <p className="card-text">View your blood request history.</p>
              <Link to="/requestHistory" className="btn btn-success btn-block">
                Go to Request History
              </Link>
            </div>
          </div>
        </div>

        {/* Donate Blood Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-danger rounded">
            <img
              src="/images/donate-blood.png"
              className="card-img-top"
              alt="Donate Blood"
            />
            <div className="card-body">
              <h5 className="card-title">Donate Blood</h5>
              <p className="card-text">Click here to donate blood.</p>
              <Link to="/donateBlood" className="btn btn-danger btn-block">
                Go to Donate Blood
              </Link>
            </div>
          </div>
        </div>
        {/*  ADD FOR REQUESTING FUNDS */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-info rounded">
            <img
              src="https://cslbd71.com/wp-content/uploads/2023/06/fundraising_cropped-500x353-1.jpg"
              className="card-img-top"
              alt="Request Funds"
            />
            <div className="card-body">
              <h5 className="card-title">Request Funds</h5>
              <p className="card-text">Click here to request funds.</p>
              <Link to="/request-funds" className="btn btn-info btn-block">
                Go to Request Funds
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
              <h5 className="card-title">Fund Request History</h5>
              <p className="card-text">Click here to request see re.</p>
              <Link
                to="/fund-request-history"
                className="btn btn-info btn-block"
              >
                Go to Fund Request History
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
              <h5 className="card-title">Donate now</h5>
              <p className="card-text">Click here to Donate Funds.</p>
              <Link
                to="/fund-donation"
                className="btn btn-info btn-block"
              >
                Donate Funds Now!
              </Link>
            </div>
          </div>
        </div>

        {/* Organ Request Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-warning rounded">
            <img
              src="https://static.india.com/wp-content/uploads/2022/11/Organ-Donation-5-Things-to-Keep-in-Mind-When-Considering-to-Donate-Organ.jpeg?impolicy=Medium_Widthonly&w=700"
              className="card-img-top"
              alt="Make Organ Request"
            />
            <div className="card-body">
              <h5 className="card-title">Make Organ Request</h5>
              <p className="card-text">Click here to make an organ request.</p>
              <Link to="/makeOrganRequest" className="btn btn-warning btn-block">
                Go to Organ Request
              </Link>
            </div>
          </div>
        </div>

        {/* Available Donors Card */}
        {/* <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-warning rounded">
            <img
              src="/images/available-doners.jpg"
              className="card-img-top"
              alt="Available Donors"
            />
            <div className="card-body">
              <h5 className="card-title">Available Donors</h5>
              <p className="card-text">View available blood donors.</p>
              <Link to="/donorlist" className="btn btn-warning btn-block">
                Go to Available Donors
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserDashboard;

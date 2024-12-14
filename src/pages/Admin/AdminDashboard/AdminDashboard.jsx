import React from 'react';
import { useNavigate } from 'react-router-dom';
import './admin-dashboard.css'; 

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center text-primary mb-5">Admin Dashboard</h1>
      <div className="row">
        {/* Add Donors Card */}
        <div className="col-md-6 col-lg-3 mb-4">
          <div className="card shadow-lg border-primary rounded">
            <img
              src="https://via.placeholder.com/500"
              className="card-img-top"
              alt="Add Donors"
            />
            <div className="card-body">
              <h5 className="card-title">Add Donors</h5>
              <p className="card-text">Add new blood donors</p>
              <button 
                className="btn btn-primary btn-block"
                onClick={() => navigate('/fund-requests')}
              >
                Go to Add Donors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

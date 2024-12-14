import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { END_POINT } from "../../config/api";
import { Modal, Button } from "react-bootstrap";

const OrganRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [inventoryModal, setInventoryModal] = useState(false);
  const [inventoryList, setInventoryList] = useState([]);

  useEffect(() => {
    fetchOrganRequests();
  }, []);

  const fetchOrganRequests = () => {
    const token = localStorage.getItem("jwtToken");
    
    axios.get(`${END_POINT}/organ-request/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setRequests(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching organ requests:", error);
      setError("Failed to fetch organ requests");
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load organ request history'
      });
    });
  };

  const fetchOrganInventory = (organType) => {
    const token = localStorage.getItem("jwtToken");
    
    axios.get(`${END_POINT}/organ-donation/list`, {
      params: {
        organType: organType,
        status: 'PENDING'
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setInventoryList(response.data);
      setInventoryModal(true);
    })
    .catch(error => {
      console.error("Error fetching organ inventory:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load organ inventory'
      });
    });
  };

  const handleApproveRequest = (requestId) => {
    const token = localStorage.getItem("jwtToken");
    
    axios.post(`${END_POINT}/organ-request/approve/${requestId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Approved',
        text: 'Organ request has been approved'
      });
      fetchOrganRequests();
    })
    .catch(error => {
      console.error("Error approving request:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to approve organ request'
      });
    });
  };

  const handleRejectRequest = (requestId) => {
    const token = localStorage.getItem("jwtToken");
    
    axios.post(`${END_POINT}/organ-request/reject/${requestId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Rejected',
        text: 'Organ request has been rejected'
      });
      fetchOrganRequests();
    })
    .catch(error => {
      console.error("Error rejecting request:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reject organ request'
      });
    });
  };

  const handleAllotOrgan = (requestId, inventoryItem) => {
    const token = localStorage.getItem("jwtToken");
    
    axios.post(`${END_POINT}/organ-request/allot`, {
      requestId: requestId,
      donationId: inventoryItem.id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Allotted',
        text: 'Organ has been successfully allotted'
      });
      setInventoryModal(false);
      fetchOrganRequests();
    })
    .catch(error => {
      console.error("Error allotting organ:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to allot organ'
      });
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
      <h1 className="text-center text-primary mb-4">Organ Requests Management</h1>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Patient Name</th>
            <th>Organ Type</th>
            <th>Units</th>
            <th>Required Before</th>
            <th>Status</th>
            <th>Actions</th>
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
              <td>
                {request.status === 'PENDING' && (
                  <>
                    <button 
                      className="btn btn-success btn-sm mr-2"
                      onClick={() => handleApproveRequest(request.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger btn-sm mr-2"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => fetchOrganInventory(request.organType)}
                    >
                      Check Inventory
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Organ Inventory Modal */}
      <Modal show={inventoryModal} onHide={() => setInventoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Organ Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th>Donor Name</th>
                <th>Organ Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((item) => (
                <tr key={item.id}>
                  <td>{item.donorName}</td>
                  <td>{item.organType}</td>
                  <td>
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => handleAllotOrgan(selectedRequest.id, item)}
                    >
                      Allot
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrganRequestHistory;
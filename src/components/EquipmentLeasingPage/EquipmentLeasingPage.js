import React, { useState } from "react";
import "./equipmentLeasing.css";

const EquipmentLeasingPage = () => {
  const [donationType, setDonationType] = useState("");

  const handleDonationChange = (e) => {
    setDonationType(e.target.value);
  };

  return (
    <div className="equipment-leasing-container">
      <h1>Equipment Leasing</h1>
      <p>Choose a donation type for equipment leasing services related to medical needs.</p>

      {/* Donation Type Selection */}
      <div className="donation-selection">
        <label htmlFor="donationType">Select Donation Type:</label>
        <select id="donationType" onChange={handleDonationChange} value={donationType}>
          <option value="">Select...</option>
          <option value="blood">Blood Donation</option>
          <option value="organ">Organ Donation</option>
        </select>
      </div>

      {/* Display Dynamic Content based on Selection */}
      {donationType && (
        <div className="donation-details">
          <h2>{donationType === "blood" ? "Blood Donation" : "Organ Donation"} Details</h2>
          <p>
            {donationType === "blood"
              ? "Blood donation is a vital part of medical care, and through our equipment leasing, we aim to support blood banks."
              : "Organ donation helps save lives, and we provide the necessary equipment for organ donation management."}
          </p>
          <p>
            {donationType === "blood"
              ? "For blood donation, we provide equipment such as blood bags, storage units, and other necessary items."
              : "For organ donation, we offer equipment like organ preservation kits, transport solutions, and more."}
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentLeasingPage;

import React, { useState } from "react";
import Joi from "joi-browser";
import { useNavigate } from "react-router-dom";
import { SimpleToast } from "../../../components/util/Toast/Toast";
import { useToast } from "../../../services/toastService";
import axios from "axios";
import "./register.css";
import { END_POINT } from "../../../config/api";

const AddDoctor = (props) => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const dark = props.theme;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
    bloodGroup: "",
    gender: "",
    mobile: "",
  });

  const [errorObj, setErrorObj] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = {
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(25).required(),
    gender: Joi.string().required(),
    mobile: Joi.string().min(10).required(),
    bloodGroup: Joi.string().required(),
  };

  const validateForm = () => {
    const { error } = Joi.validate(formData, validationSchema, {
      abortEarly: false,
    });
    if (!error) return true;

    const errors = error.details.reduce((acc, item) => {
      acc[item.path[0]] = item.message;
      return acc;
    }, {});
    setErrorObj(errors);
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const payload = {
        ...formData,
        role: "doctor",
        password: "doctor@123",
        bloodgroup: formData.bloodGroup,
      };

      axios
        .post(`${END_POINT}/user/register`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            showToast("Doctor Registered Successfully", "success");
            navigate("/admin-dashboard");
          } else {
            showToast(
              `Registration failed: ${response.data.error || "Unknown error"}`,
              "error"
            );
          }
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage =
              error.response.data?.message || "Access Denied";
            showToast(`Registration failed: ${errorMessage}`, "error");
          } else {
            showToast("An error occurred. Please try again later.", "error");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const renderInput = (name, type, placeholder, icon) => (
    <div
      className={`register-input ${
        dark ? "register-input-dark" : "register-input-light"
      }`}
    >
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input-register ${
          dark ? "input-register-dark" : "input-register-light"
        }`}
      />
      <i className={icon}></i>
      <div className="validation">
        {errorObj[name] && <div>* {errorObj[name]}</div>}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`register-section ${
          dark ? "register-section-dark" : "register-section-light"
        }`}
      >
        <div className="register-parent">
          <div className="register-child child1">
            <img
              src="https://qmedcenter.com/wp-content/uploads/2023/02/Vector-doctor-examining-a-patient-at-the-clinic-portraying-20-qualities-that-make-a-good-doctor.webp"
              alt="doctor-illustration"
              className="register-image"
            />
          </div>
          <div className="register-child child2">
            <div
              className={`register-card ${
                dark ? "register-card-dark" : "register-card-light"
              }`}
            >
              <h1
                className={`card-heading ${
                  dark ? "card-heading-dark" : "card-heading-light"
                }`}
              >
                Add a Doctor
              </h1>
              <form onSubmit={handleSubmit} noValidate>
                <div className="inside-register">
                  {renderInput("username", "text", "Name", "fas fa-user")}
                  {renderInput(
                    "email",
                    "email",
                    "Email",
                    "fas fa-envelope-open-text"
                  )}
                  {renderInput("age", "number", "Age", "fas fa-calendar-alt")}

                  <div
                    className={`register-input ${
                      dark ? "register-input-dark" : "register-input-light"
                    }`}
                  >
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={
                        dark ? "input-register-dark" : "input-register-light"
                      }
                    >
                      <option value="">Select Gender</option>
                      {["male", "female", "other"].map((genderOption) => (
                        <option key={genderOption} value={genderOption}>
                          {genderOption}
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-venus-mars"></i>
                    <div className="validation">
                      {errorObj["gender"] && <div>* {errorObj["gender"]}</div>}
                    </div>
                  </div>
                  <div
                    className={`register-input ${
                      dark ? "register-input-dark" : "register-input-light"
                    }`}
                  >
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className={
                        dark ? "input-register-dark" : "input-register-light"
                      }
                    >
                      <option value="">Select Blood Group</option>
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        )
                      )}
                    </select>
                    <i className="fas fa-tint"></i>
                    <div className="validation">
                      {errorObj["bloodGroup"] && (
                        <div>* {errorObj["bloodGroup"]}</div>
                      )}
                    </div>
                  </div>
                  {renderInput(
                    "mobile",
                    "text",
                    "Mobile Number",
                    "fas fa-phone"
                  )}
                  <div className="submit-btns">
                    <button
                      className="submit-button primary signup-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Add Doctor"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <SimpleToast
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        handleCloseToast={hideToast}
      />
    </>
  );
};

export default AddDoctor;
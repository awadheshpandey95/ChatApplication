import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    phoneNumber: "",
    gender: "",
    profilePicture: "",
    dateOfBirth: "",
    statusMessage: "",
    address: "",
    country: "",
    state: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate inputs
  const validateInputs = () => {
    const validationErrors = {};
    if (!formData.userName.trim()) validationErrors.userName = "Username is required.";
    if (!formData.email.trim()) validationErrors.email = "Email is required.";
    if (!formData.password.trim()) validationErrors.password = "Password is required.";
    if (formData.phoneNumber && !/^\d{0,10}$/.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be up to 10 digits.";
    }
    if (formData.gender && !["Male", "Female", "Other"].includes(formData.gender)) {
      validationErrors.gender = "Invalid gender selected.";
    }
    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("https://localhost:7002/api/Account/Signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Signup Successful");
        navigate("/Login");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        {[
          { label: "Username", name: "userName", type: "text", placeholder: "Enter username" },
          { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
          { label: "Password", name: "password", type: "password", placeholder: "Enter password" },
          { label: "Phone Number", name: "phoneNumber", type: "text", placeholder: "Enter phone number" },
          { label: "Gender", name: "gender", type: "text", placeholder: "Enter gender (Male/Female/Other)" },
          { label: "Profile Picture", name: "profilePicture", type: "text", placeholder: "Enter profile picture URL" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          { label: "Status Message", name: "statusMessage", type: "text", placeholder: "Enter status message" },
          { label: "Address", name: "address", type: "text", placeholder: "Enter address" },
          { label: "Country", name: "country", type: "text", placeholder: "Enter country" },
          { label: "State", name: "state", type: "text", placeholder: "Enter state" },
          { label: "City", name: "city", type: "text", placeholder: "Enter city" },
        ].map((field) => (
          <div key={field.name} className="form-group mb-3">
            <label htmlFor={field.name} className="form-label">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
            />
            {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

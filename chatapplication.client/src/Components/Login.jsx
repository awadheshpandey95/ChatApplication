import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7002/api/Account/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailId, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("OTP Send Successfully");
        console.log('Login Details:', result);
        sessionStorage.setItem("EmailId", result.user.email);
        navigate("/VerifyOTP");
      } 
      else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Login failed"}`);
      } 

    } catch (error) {
      console.log('Error during login:', error);
    }
  };
  
  return (
    <div className="pt-1">
      <div className="wrapper">
        {/* Logo Section */}
        <div className="logo">
          <img
            src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-bird-symbols-png-logo-0.png"
            alt="Twitter Logo"
          />
        </div>

        {/* Title */}
        <div className="text-center mt-4 name">Chat Buddy</div>

        {/* Login Form */}
        <form className="p-3 mt-3" onSubmit={handleLogin}>
          <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input
              type="text"
              name="emailId"
              id="emailId"
              placeholder="Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
            />
          </div>
          <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input
              type="password"
              name="password"
              id="pwd"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100">
            Login
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && <div className="text-danger text-center mt-2">{errorMessage}</div>}

        {/* Links */}
        <div className="text-center fs-6">
          <a href="#">Forget password?</a> or <Link to="/Signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
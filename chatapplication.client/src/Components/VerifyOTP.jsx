import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load email from sessionStorage on component mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("EmailId");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("No email found. Please log in again.");
      navigate("/VerifyOTP");
    }
  }, [navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://localhost:7002/api/Account/VerifyOTP", { email, otp });
        console.log(response);
        setMessage(response.data.message);
        sessionStorage.setItem("Token", response.data.token); 
        navigate("/ChatApp");
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed.");
    }
    setLoading(false);
  };

  return (
    <>
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
      <form className="p-3 mt-3" onSubmit={handleVerifyOTP}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="email"
            value={email}
            disabled
            className="border p-2 rounded bg-gray-200"
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="border p-2 rounded"
          />
        </div>
        <button
            type="submit"
            className="btn btn-primary mt-3 w-100"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
      </form>
    </div>
  </div>
    </>
  );
};

export default VerifyOTP;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email);

    alert("Reset Link Sent");

    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            title="Send Reset Link"
            type="submit"
            className="mt-4"
          />

        </form>

        <p className="text-center mt-5">
          Back to

          <Link
            to="/login"
            className="text-purple-700 font-semibold ml-1"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default ForgotPassword;
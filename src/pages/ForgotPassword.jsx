import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { ForgotPasswordApi } from "../lib/api/authApi";
import { useForm } from "react-hook-form";
import FormInput from "../components/ui/FormInput";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("FORM DATA:", data);

    try {
      console.log("SENDING:", data);

      const response = await ForgotPasswordApi(data);

      console.log("Forgot Password Response:", response.data);

      alert("Reset Link Sent Successfully");

      navigate("/reset-password");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to Send Reset Link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
         <FormInput
              type="email"
              placeholder="Email"
              register={register}
              name="email"
              errors={errors}
            />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}

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
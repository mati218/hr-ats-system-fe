import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { ResetPasswordApi } from "../lib/api/authApi";
import { useForm } from "react-hook-form";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const submit = async (data) => {
    console.log("FORM DATA:", data);

    try {
      console.log("SENDING:", data);

      const response = await ResetPasswordApi(data);

      console.log("Reset Response:", response.data);

      alert("Password Reset Successfully");

      reset();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8 lg:p-10">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">
            Security
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Reset Password
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Choose a new password to secure your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter New Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {errors.password.message}
            </p>
          )}

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          <Button
            text={isSubmitting ? "Resetting..." : "Reset Password"}
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          />

          <p className="text-center text-sm text-slate-600">
            Back to{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

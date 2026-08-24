import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";

import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import { UpdatePasswordApi } from "../lib/api/authApi";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { newPassword, confirmPassword } = data;

    // Check passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await UpdatePasswordApi({
        token,
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        toast.success(
          "Password updated successfully. Please login again."
        );

        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-2">
          Update Password
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <FormInput
              type="password"
              placeholder="New Password"
              register={register}
              name="newPassword"
              errors={errors}
              required
            />
          </div>

          <div className="mb-4">
            <FormInput
              type="password"
              placeholder="Confirm Password"
              register={register}
              name="confirmPassword"
              errors={errors}
              required
            />
          </div>

          <p className="text-sm text-gray-500 mb-5">
            Password must be at least 8 characters long and contain
            at least one letter, one number, and one special character.
          </p>

          <Button
            className="mt-2 w-full"
            type="submit"
            text="Update Password"
          />

        </form>

        <p className="text-center mt-5">
          Back to{" "}
          <Link
            to="/login"
            className="text-purple-700 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default UpdatePassword;
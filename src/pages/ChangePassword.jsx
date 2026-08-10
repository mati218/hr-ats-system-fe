import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/ui/Button";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password must match");
      return;
    }

    alert("Password changed successfully");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8 lg:p-10">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Security</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Change Password</h2>
          <p className="mt-2 text-sm text-slate-600">Update your password to keep your account secure.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />

          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            text="Update Password"
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          />
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;

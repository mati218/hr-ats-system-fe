import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password not match");
      return;
    }

    alert("Password Reset Successfully");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8 lg:p-10">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Security</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-600">Choose a new password to secure your account.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <InputField
            label="New Password"
            name="password"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputField
            label="Confirm Password"
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button
            text="Reset Password"
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          />

          <p className="text-center text-sm text-slate-600">
            Back to
            <Link to="/login" className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

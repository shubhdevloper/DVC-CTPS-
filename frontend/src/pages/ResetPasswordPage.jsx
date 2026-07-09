import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ResetPasswordPage() {
  const navigate = useNavigate();

const username =
  sessionStorage.getItem(
    "resetUsername"
  );
  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const hasLength =
    password.length >= 8;

  const hasUpperCase =
    /[A-Z]/.test(password);

  const hasNumber =
    /[0-9]/.test(password);

  const hasSpecial =
    /[^A-Za-z0-9]/.test(password);

const handleResetPassword = async () => {
  if (!username) {
    alert(
      "Reset session expired."
    );

    navigate("/forgot-password");

    return;
  }

  if (
    password !== confirmPassword
  ) {
    alert(
      "Passwords do not match."
    );

    return;
  }

  if (
    !hasLength ||
    !hasUpperCase ||
    !hasNumber ||
    !hasSpecial
  ) {
    alert(
      "Password does not meet the required criteria."
    );

    return;
  }

  try {
    await axios.post(
      "http://10.53.49.228:5000/api/auth/reset-password",
      {
        username,
        newPassword:
          password,
      }
    );

    sessionStorage.removeItem(
      "resetUsername"
    );

    alert(
      "Password reset successfully."
    );

    navigate("/");
  } catch (error) {
    alert(
      error.response?.data
        ?.message ||
        "Password reset failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#E9EDF5] flex justify-center items-center px-4">

      <div className="bg-white w-full max-w-md rounded shadow overflow-hidden">

        <div className="bg-[#00338D] text-white p-5">

          <h1 className="text-2xl font-bold">
            Reset Password
          </h1>

          <p className="text-blue-100 text-sm mt-1">
            Create a new password
          </p>

        </div>

        <div className="p-6 space-y-4">

          <div>

            <label className="block mb-2 font-semibold">
              Username
            </label>

            <input
              value={username || ""}
              readOnly
              className="w-full border rounded px-4 py-3 bg-gray-100"
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter New Password"
              className="w-full border rounded px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm Password"
              className="w-full border rounded px-4 py-3"
            />

          </div>

          <div className="bg-gray-100 p-3 rounded text-sm">

            <p className="font-semibold mb-2">
              Password Requirements
            </p>

            <div
              className={
                hasLength
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {hasLength
                ? "✓"
                : "✗"}{" "}
              Minimum 8 characters
            </div>

            <div
              className={
                hasUpperCase
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {hasUpperCase
                ? "✓"
                : "✗"}{" "}
              At least 1 uppercase letter
            </div>

            <div
              className={
                hasNumber
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {hasNumber
                ? "✓"
                : "✗"}{" "}
              At least 1 number
            </div>

            <div
              className={
                hasSpecial
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {hasSpecial
                ? "✓"
                : "✗"}{" "}
              At least 1 special character
            </div>

          </div>

          <button
            onClick={
              handleResetPassword
            }
            className="w-full bg-[#00338D] text-white py-3 rounded hover:bg-[#002b75]"
          >
            Reset Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResetPasswordPage;

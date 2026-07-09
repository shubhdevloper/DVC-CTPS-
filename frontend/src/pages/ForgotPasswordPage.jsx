import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [recoveryPassword, setRecoveryPassword] =
    useState("");

const handleNext = async () => {
  try {
    await axios.post(
      "http://10.53.49.228:5000/api/auth/forgot-password",
      {
        username,
        defaultPassword:
          recoveryPassword,
      }
    );

    sessionStorage.setItem(
      "resetUsername",
      username
    );

    navigate(
      "/reset-password"
    );
  } catch (error) {
    alert(
      error.response?.data
        ?.message ||
        "Verification failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#E9EDF5] flex justify-center items-center px-4">

      <div className="bg-white w-full max-w-md rounded shadow overflow-hidden">

        <div className="bg-[#00338D] text-white p-5">

          <h1 className="text-2xl font-bold">
            Forgot Password
          </h1>

          <p className="text-blue-100 text-sm mt-1">
            Reset your account password
          </p>

        </div>

        <div className="p-6 space-y-4">

          <div>
            <label className="block mb-2 font-semibold">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Enter Username"
              className="w-full border rounded px-4 py-3"
            />
          </div>

          <div className="bg-yellow-100 border border-yellow-300 p-3 rounded text-sm">

            <strong>
              Recovery Password:
            </strong>

            <br />

            DVC-RESET-2026

          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Enter Recovery Password
            </label>

            <input
              type="password"
              value={
                recoveryPassword
              }
              onChange={(e) =>
                setRecoveryPassword(
                  e.target.value
                )
              }
              placeholder="Recovery Password"
              className="w-full border rounded px-4 py-3"
            />
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-[#00338D] text-white py-3 rounded"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}

export default ForgotPasswordPage;

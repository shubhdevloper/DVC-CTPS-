import { useState } from "react";
import { Link,useNavigate, } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axios from "axios";
function RegisterPage() {
const [role, setRole] = useState("security");
const navigate = useNavigate();
const [fullName, setFullName] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] =
  useState("");
const [gate, setGate] = useState("Gate 1");
const [accessCode, setAccessCode] =
  useState("");
  const hasLength = password.length >= 8;
const hasUpperCase = /[A-Z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSpecial = /[^A-Za-z0-9]/.test(password);
const handleRegister = async () => {
  try {
    if (
      !fullName ||
      !username ||
      !password
    ) {
      alert(
        "Please fill all fields"
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      alert(
        "Passwords do not match"
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

    const response =
      await axios.post(
        "http://10.53.49.228:5000/api/auth/register",
        {
          fullName,
          username,
          password,
          role,
          gate,
          accessCode,
        }
      );

    alert(
      response.data.message
    );

    navigate("/");
  } catch (error) {
    alert(
      error.response?.data
        ?.message ||
        "Registration failed"
    );
  }
};
  return (
    <>
    <div className="min-h-screen flex flex-col bg-[#E9EDF5]">
      <Header />
      <main className="flex-1 flex justify-center items-center py-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-[#00338D] text-white p-6">
          <h2 className="text-3xl font-bold">
            User Registration
          </h2>
          <p className="text-blue-100 mt-2">
            CTPS Chandrapura
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-5">

          <input
  type="text"
  value={fullName}
  onChange={(e) =>
    setFullName(e.target.value)
  }
  placeholder="Full Name"
  className="w-full border border-gray-300 rounded px-4 py-3"
/>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Username"
            className="w-full border border-gray-300 rounded px-4 py-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-4 py-3"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded px-4 py-3"
          />

          {/* Password Rules */}
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
            <p className="font-semibold mb-1">
              Password Requirements
            </p>

            <div className={hasLength ? "text-green-600" : "text-red-600"}>
  {hasLength ? "✓" : "✗"} Minimum 8 characters
</div>

<div className={hasUpperCase ? "text-green-600" : "text-red-600"}>
  {hasUpperCase ? "✓" : "✗"} At least 1 uppercase letter
</div>

<div className={hasNumber ? "text-green-600" : "text-red-600"}>
  {hasNumber ? "✓" : "✗"} At least 1 number
</div>

<div className={hasSpecial ? "text-green-600" : "text-red-600"}>
  {hasSpecial ? "✓" : "✗"} At least 1 special character
</div>
          </div>

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3"
          >
            <option value="security">Security</option>
            <option value="manager">Manager</option>
            <option value="superadmin">Super Admin</option>
          </select>

          {/* Role Messages */}

{role === "security" && (
  <select
    value={gate}
    onChange={(e) =>
      setGate(e.target.value)
    }
    className="w-full border border-gray-300 rounded px-4 py-3"
  >
    <option>Gate 1</option>
    <option>Gate 2</option>
    <option>Gate 3</option>
    <option>Gate 4</option>
    <option>Gate 5</option>
  </select>
)}

          {role === "manager" && (
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded">
              Manager accounts require Super Admin approval.
            </div>
          )}

          {role === "superadmin" && (
            <>
              <div className="bg-red-100 text-red-700 p-3 rounded">
                Super Admin registration requires a valid Admin Access Code.
              </div>

              <input
                type="text"
                value={accessCode}
                onChange={(e) =>
                  setAccessCode(e.target.value)
                }
                placeholder="Admin Access Code"
                className="w-full border border-gray-300 rounded px-4 py-3"
              />
            </>
          )}

          {/* Button */}

          <button
            onClick={handleRegister}
            className="w-full bg-[#00338D] text-white py-3 rounded hover:bg-[#002b75]"
          >
            Register
          </button>

          {/* Footer */}

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-800 font-semibold"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
      </main>
      <Footer />
    </div>
    </>
  );
}

export default RegisterPage;

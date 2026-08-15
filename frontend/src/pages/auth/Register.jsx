import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Register = () => {
  const navigate =
    useNavigate();

  const { register } =
    useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(formData);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">
          Create Account
        </h1>

        <p className="mb-6 text-gray-500">
          Join Karigar Connect
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            required
            placeholder="Full name"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="email"
            name="email"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            required
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="password"
            name="password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            required
            placeholder="Password"
            className="w-full rounded-lg border px-4 py-3"
          />

          <select
            name="role"
            value={
              formData.role
            }
            onChange={
              handleChange
            }
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="CUSTOMER">
              Customer
            </option>

            <option value="PRODUCER">
              Producer
            </option>

            <option value="DELIVERY">
              Delivery Person
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
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
      const data =
        await login(
          formData.email,
          formData.password
        );

      const role =
        data.user?.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (
        role === "PRODUCER"
      ) {
        navigate("/producer");
      } else if (
        role === "DELIVERY"
      ) {
        navigate("/delivery");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-gray-500">
          Login to Karigar Connect
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
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

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
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
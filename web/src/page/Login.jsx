import React, { useState } from "react";
import Logo from "/logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = {};
    if (!username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If validation passes, proceed with login logic (e.g., API call)
    console.log("Login successful!", { username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
        <div className=" flex justify-center items-center mb-4">
          <img src={Logo} width={100} height={100} />
          <h2 className="text-2xl font-bold text-center">Login to Squash</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className={`input input-bordered ${
                errors.username && "input-error"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <span className="text-error text-xs">{errors.username}</span>
            )}
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`input input-bordered ${
                errors.password && "input-error"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="text-error text-xs">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full mt-6">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

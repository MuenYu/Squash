import React, { useState } from 'react';
import Logo from "/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { login, register, confirmRegistration, verifyMFAChallenge } from "../api/requests";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaSession, setMfaSession] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Current state:', { isRegistering, isVerifying, username, verificationCode });
      
      if (isVerifying) {
        console.log('Attempting to confirm registration');
        if (!verificationCode) {
          alert("Verification code is required.");
          return;
        }
        await confirmRegistration(username, verificationCode);
        setIsRegistering(false);
        setIsVerifying(false);
        alert("Email verified successfully. You can now log in.");
        setPassword('');
        setEmail('');
        setVerificationCode('');
      } else if (isRegistering) {
        console.log('Attempting to register');
        await register({ username, password, email });
        setIsVerifying(true);
        alert("Registration successful. Please check your email for the verification code.");
      } else if (requiresMFA) {
        await verifyMFAChallenge({ username, session: mfaSession, mfaCode });
        navigate("/panel");
      } else {
        const result = await login({ username, password });
        if (result.requiresMFA) {
          setRequiresMFA(true);
          setMfaSession(result.session);
        } else {
          if (!result.mfaEnabled) {
            navigate("/mfa-setup");
          } else {
            navigate("/panel");
          }
        }
      }
    } catch (err) {
      console.error('Error in onSubmit:', err);
      alert(err.message || "An error occurred. Please try again.");
    }
  };

  const renderForm = () => {
    if (isVerifying) {
      return (
        <form onSubmit={onSubmit}>
          <p className="text-sm mb-4">Verifying account for: <strong>{username}</strong></p>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Verification Code</span>
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="input input-bordered"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-6">
            Verify
          </button>
        </form>
      );
    }

    if (requiresMFA) {
      return (
        <form onSubmit={onSubmit}>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">MFA Code</span>
            </label>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="Enter MFA code"
              className="input input-bordered"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-6">
            Verify MFA
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input input-bordered"
            required
          />
        </div>
        {isRegistering && (
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input input-bordered"
              required
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary w-full mt-6">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
        <Link to='/'>
          <div className="flex justify-center items-center mb-4">
            <img src={Logo} width={100} height={100} alt="Logo" />
            <h2 className="text-2xl font-bold text-center">
              {isVerifying ? 'Verify Email' : (isRegistering ? 'Register' : 'Login')} to Squash
            </h2>
          </div>
        </Link>
        {renderForm()}
        {!isVerifying && (
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setUsername('');
              setPassword('');
              setEmail('');
            }}
            className="btn btn-link w-full mt-4"
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
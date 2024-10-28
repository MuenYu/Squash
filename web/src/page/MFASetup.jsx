import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupMFA, verifyMFA } from '../api/requests';
import { QRCodeSVG } from 'qrcode.react';

const MFASetupPage = () => {
  const [secretCode, setSecretCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const initMFASetup = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const secret = await setupMFA(accessToken);
        setSecretCode(secret);
        const username = localStorage.getItem('username');
        if (!username) {
          throw new Error('Username not found. Please log in again.');
        }
        const qrData = `otpauth://totp/SquashApp:${encodeURIComponent(username)}?secret=${secret}&issuer=SquashApp`;
        setQrCodeData(qrData);
      } catch (error) {
        console.error('Error setting up MFA:', error);
        alert(error.message || 'Failed to set up MFA. Please try again.');
        navigate('/login');
      }
    };

    initMFASetup();
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      alert('Please enter a 6-digit code.');
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      await verifyMFA(accessToken, verificationCode);
      alert('MFA setup successful!');
      navigate('/panel');
    } catch (error) {
      console.error('Error verifying MFA:', error);
      alert('Failed to verify MFA. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Set Up MFA</h2>
        <p className="mb-4">Scan this QR code with Google Authenticator:</p>
        {qrCodeData && (
          <div className="flex justify-center mb-4">
            <QRCodeSVG value={qrCodeData} size={200} />
          </div>
        )}
        <form onSubmit={handleVerify}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Verification Code</span>
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="input input-bordered"
              required
              pattern="\d{6}"
              maxLength="6"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-6">
            Verify and Enable MFA
          </button>
        </form>
      </div>
    </div>
  );
};

export default MFASetupPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUserNumber } from '../apiClient';

const LoginPage: React.FC = () => {
  const [userNumber, setUserNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const trimmed = userNumber.trim();
    if (!trimmed) return;

    try {
      await validateUserNumber(trimmed);
      localStorage.setItem('userNumber', trimmed);
      navigate('/apis');
    } catch (err: any) {
      setError(err?.message || 'Unable to validate user number');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>API Catalogue – Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          User number
          <input
            type="text"
            value={userNumber}
            onChange={e => setUserNumber(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 8 }}
          />
        </label>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ marginTop: 16 }}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

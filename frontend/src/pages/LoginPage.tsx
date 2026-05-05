import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [userNumber, setUserNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const trimmed = userNumber.trim();
    if (!trimmed) return;

    localStorage.setItem('userNumber', trimmed);
    navigate('/apis');
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
        <button type="submit" style={{ marginTop: 16 }}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

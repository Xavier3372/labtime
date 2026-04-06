"use client";
import { useState } from 'react';

const ADMIN_PASSWORD = "SCIENCE2026";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1tPz7vKAmZU8SpMy-bsswc3oofR2VCgPnIz4hQdBUdbA/edit?usp=sharing";

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.open(SHEET_URL, '_blank');
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        fontFamily: '"Poppins", sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '25px',
          padding: '50px 40px',
          maxWidth: '440px',
          width: '100%',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'rgba(255, 215, 0, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px',
            border: '2px solid rgba(255, 215, 0, 0.3)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '2rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px',
            fontWeight: '700',
          }}>
            Lab Admin
          </h1>

          <p style={{
            color: '#a0a0c0',
            fontSize: '0.95rem',
            marginBottom: '30px',
            fontWeight: '300',
          }}>
            Enter the admin password to continue
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: error
                  ? '2px solid #E74C3C'
                  : '2px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                marginBottom: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            />

            {error && (
              <p style={{
                color: '#E74C3C',
                fontSize: '0.85rem',
                marginBottom: '8px',
                textAlign: 'left',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#1a1a2e',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '10px',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
  );
}

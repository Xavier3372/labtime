"use client";
import { useState } from 'react';


export default function book() {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    title: '',
    teacher: '',
    phone: '',
    numStudents: '',
    level: '',
    class: '',
    subject: '',
    notes: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const labs = [
    { name: 'Physics Lab 1', color: '#FF6B6B', category: 'Physics' },
    { name: 'Physics Lab 2', color: '#FF8E8E', category: 'Physics' },
    { name: 'Chemistry Lab 1', color: '#4ECDC4', category: 'Chemistry' },
    { name: 'Chemistry Lab 2', color: '#6FE6DD', category: 'Chemistry' },
    { name: 'Biology Lab 1', color: '#95E1D3', category: 'Biology' },
    { name: 'Biology Lab 2', color: '#B8F4E8', category: 'Biology' },
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minutes = (i % 2) * 30;
    return {
      value: hour + minutes / 60,
      label: `${hour}:${minutes === 0 ? '00' : '30'}`,
    };
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = 'science2026';
    
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPasswordInput('');
    }
  };

  const formatTimeForSheet = (timeValue) => {
    if (!timeValue) return '';
    const hour = Math.floor(timeValue);
    const minutes = Math.round((timeValue % 1) * 60);
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format times before sending
      const formDataToSend = {
        ...formData,
        startTime: formatTimeForSheet(formData.startTime),
        endTime: formatTimeForSheet(formData.endTime),
      };

      const response = await fetch('/api/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setShowConfirmation(true);
        console.log('Booking successfully sent to Google Sheets');
      } else {
        console.error('Failed to send booking');
        alert('Failed to send booking. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
      return;
    }

    setTimeout(() => {
      setShowConfirmation(false);
      // Reset form
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        title: '',
        teacher: '',
        phone: '',
        numStudents: '',
        level: '',
        class: '',
        subject: '',
        notes: '',
      });
    }, 3000);
  };

  const labColor = '#FFD700';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: '"Poppins", sans-serif',
      padding: '40px 20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      
      {!isAuthenticated ? (
        // Password Modal
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '25px',
            padding: '60px 40px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            maxWidth: '400px',
            width: '100%',
          }}>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '30px',
              textAlign: 'center',
              fontWeight: '700',
              letterSpacing: '1px',
            }}>
              Access Required
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#FFD700',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '12px',
                  letterSpacing: '0.5px',
                }}>
                  Enter Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Enter password to access booking"
                  required
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: '"Poppins", sans-serif',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '2px solid #FFD700';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>
              {passwordError && (
                <div style={{
                  color: '#FF6B6B',
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                  {passwordError}
                </div>
              )}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.44)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.54)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.44)';
                }}
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Booking Form Content
        <>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '3.5rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
          }}>
            Book a Laboratory
          </h1>
          <p style={{
            color: '#a0a0c0',
            fontSize: '1.1rem',
            fontWeight: '300',
          }}>
            Reserve your lab session with ease
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '25px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}>


          {/* Date and Time Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Date */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {/* Start Time */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Start Time *
              </label>
              <select
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: formData.startTime ? '#ffffff' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value} style={{ background: '#1a1a2e' }}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                End Time *
              </label>
              <select
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: formData.duration ? '#ffffff' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value} style={{ background: '#1a1a2e' }}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Session Title */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}>
              Session Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Organic Chemistry Lab"
              required
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = `2px solid ${labColor}`;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          {/* Teacher Name */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}>
              Teacher Name *
            </label>
            <input
              type="text"
              value={formData.teacher}
              onChange={(e) => handleInputChange('teacher', e.target.value)}
              placeholder="e.g., Lau Lee Leng"
              required
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = `2px solid ${labColor}`;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          {/* Email and Phone Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Phone Number */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="96797912"
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
          </div>

          {/* Number of Students, Level, and Class Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Number of Students */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Number of Students *
              </label>
              <input
                type="number"
                value={formData.numStudents}
                onChange={(e) => handleInputChange('numStudents', e.target.value)}
                placeholder="e.g., 25"
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {/* Level */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: formData.level ? '#ffffff' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <option value="">Select level</option>
                <option value="Secondary 1" style={{ background: '#1a1a2e' }}>Secondary 1</option>
                <option value="Secondary 2" style={{ background: '#1a1a2e' }}>Secondary 2</option>
                <option value="Secondary 3" style={{ background: '#1a1a2e' }}>Secondary 3</option>
                <option value="Secondary 4" style={{ background: '#1a1a2e' }}>Secondary 4</option>
                <option value="Secondary 5" style={{ background: '#1a1a2e' }}>Secondary 5</option>
              </select>
            </div>

            {/* Class */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Class *
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                placeholder="e.g., 4A, 5C"
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {/* Subject */}
            <div>
              <label style={{
                display: 'block',
                color: '#FFD700',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: formData.subject ? '#ffffff' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = `2px solid ${labColor}`;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <option value="">Select subject</option>
                <option value="Pure Physics" style={{ background: '#1a1a2e' }}>Pure Physics</option>
                <option value="Science Physics" style={{ background: '#1a1a2e' }}>Science Physics</option>
                <option value="Pure Chemistry" style={{ background: '#1a1a2e' }}>Pure Chemistry</option>
                <option value="Science Chemistry" style={{ background: '#1a1a2e' }}>Science Chemistry</option>
                <option value="Pure Biology" style={{ background: '#1a1a2e' }}>Pure Biology</option>
                <option value="Science Biology" style={{ background: '#1a1a2e' }}>Science Biology</option>
                <option value="Lower Secondary Science" style={{ background: '#1a1a2e' }}>Lower Secondary Science</option>
                <option value="Upper Secondary Science" style={{ background: '#1a1a2e' }}>Upper Secondary Science</option>
              </select>
            </div>
          </div>

          {/* Experiment Details */}
          <div style={{ marginBottom: '35px' }}>
            <label style={{
              display: 'block',
              color: '#FFD700',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}>
              Experiment Details *
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Describe the experiment, equipment needed, or special requirements..."
              rows={4}
              required
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
                resize: 'vertical',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = `2px solid ${labColor}`;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              background: `linear-gradient(135deg, ${labColor} 0%, ${labColor}dd 100%)`,
              border: 'none',
              borderRadius: '15px',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: `0 8px 25px ${labColor}44`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 12px 35px ${labColor}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${labColor}44`;
            }}
          >
            Confirm Booking
          </button>
        </form>
      </div>

      {/* Success Confirmation Modal */}
      {showConfirmation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease',
        }}>
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { 
                  opacity: 0;
                  transform: translateY(30px) scale(0.9);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              @keyframes checkmark {
                0% { transform: scale(0) rotate(45deg); }
                50% { transform: scale(1.2) rotate(45deg); }
                100% { transform: scale(1) rotate(45deg); }
              }
            `}
          </style>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '25px',
            padding: '50px',
            maxWidth: '500px',
            textAlign: 'center',
            border: `2px solid ${labColor}`,
            boxShadow: `0 20px 60px ${labColor}44`,
            animation: 'slideUp 0.4s ease',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `${labColor}22`,
              border: `3px solid ${labColor}`,
              margin: '0 auto 25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '30px',
                height: '50px',
                borderBottom: `5px solid ${labColor}`,
                borderRight: `5px solid ${labColor}`,
                transform: 'rotate(45deg)',
                animation: 'checkmark 0.5s ease 0.2s both',
              }} />
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '2rem',
              color: '#FFD700',
              marginBottom: '15px',
              fontWeight: '700',
            }}>
              Booking Confirmed!
            </h2>
            <p style={{
              color: '#a0a0c0',
              fontSize: '1rem',
              lineHeight: '1.6',
            }}>
              Your lab session has been successfully booked.<br />
              You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
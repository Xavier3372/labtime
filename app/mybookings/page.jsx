"use client";
import { useState } from 'react';

export default function mybookings() {
  const [phoneInput, setPhoneInput] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!phoneInput.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch('/api/mybookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneInput.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        if (data.count === 0) {
          setError('No bookings found for this phone number');
        }
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error searching for bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
      fontFamily: '"Poppins", sans-serif',
      padding: '40px 20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      
      <div style={{
        maxWidth: '1000px',
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
            color: '#000000',
            
            
            
            marginBottom: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
          }}>
            My Bookings
          </h1>
          <p style={{
            color: '#000000',
            fontSize: '1.1rem',
            fontWeight: '300',
          }}>
            View your laboratory bookings and their approval status
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '25px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          marginBottom: '40px',
        }}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '15px',
              letterSpacing: '0.5px',
            }}>
              Enter Your Phone Number *
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                setError('');
              }}
              placeholder="e.g., 96797912"
              required
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '2px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#FF6B6B',
              fontSize: '0.9rem',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: '500',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? 'rgba(30, 64, 175, 0.5)' : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 8px 25px rgba(30, 64, 175, 0.25)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.54)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.44)';
              }
            }}
          >
            {loading ? 'Searching...' : 'Search Bookings'}
          </button>
        </form>

        {/* Bookings Display */}
        {searched && (
          <div>
            {bookings.length > 0 ? (
              <div style={{
                display: 'grid',
                gap: '20px',
              }}>
                {[...bookings].sort((a, b) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateA = new Date(a.date + 'T00:00:00');
                  const dateB = new Date(b.date + 'T00:00:00');
                  const pastA = dateA < today;
                  const pastB = dateB < today;
                  if (pastA !== pastB) return pastA ? 1 : -1;
                  return pastA ? (dateB - dateA) : (dateA - dateB);
                }).map((booking, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '15px',
                      padding: '25px',
                      backdropFilter: 'blur(20px)',
                      border: `2px solid ${booking.approved === 'approved' ? '#4ECDC4' : booking.approved === 'rejected' ? '#FF6B6B' : '#FFA500'}`,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '15px',
                    }}>
                      <div>
                        <h3 style={{
                          color: '#000000',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          margin: '0 0 5px 0',
                        }}>
                          {booking.title}
                        </h3>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.9rem',
                          margin: 0,
                        }}>
                          {booking.lab || 'Pending'}
                        </p>
                      </div>
                      <div style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: booking.approved === 'approved' ? 'rgba(78, 205, 196, 0.2)' : booking.approved === 'rejected' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                        border: `1px solid ${booking.approved === 'approved' ? '#4ECDC4' : booking.approved === 'rejected' ? '#FF6B6B' : '#FFA500'}`,
                      }}>
                        <span style={{
                          color: booking.approved === 'approved' ? '#4ECDC4' : booking.approved === 'rejected' ? '#FF6B6B' : '#FFA500',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                        }}>
                          {booking.approvalStatus}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '15px',
                      marginTop: '20px',
                    }}>
                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Date
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Time
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {Math.floor(booking.startTime)}:{((booking.startTime % 1) * 60).toFixed(0).padStart(2, '0')} - {Math.floor(booking.endTime)}:{((booking.endTime % 1) * 60).toFixed(0).padStart(2, '0')}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Teacher
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {booking.teacher}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Lab
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {booking.lab || 'Pending'}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Subject
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {booking.subject || '—'}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Level
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {booking.level || '—'}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Class
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {booking.class || '—'}
                        </p>
                      </div>

                      <div>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Students
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '1rem',
                          margin: 0,
                          fontWeight: '600',
                        }}>
                          {booking.numStudents || '—'}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          Details
                        </p>
                        <p style={{
                          color: '#000000',
                          fontSize: '0.95rem',
                          margin: 0,
                          lineHeight: '1.6',
                        }}>
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : !error && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '15px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              }}>
                <p style={{
                  color: '#000000',
                  fontSize: '1.1rem',
                  margin: 0,
                }}>
                  No bookings found for this phone number
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
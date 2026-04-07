"use client";
import { useState, useEffect } from 'react';
import { TiTick } from 'react-icons/ti';
import { MdChildFriendly, MdLocationPin } from 'react-icons/md';
import { FaHospital, FaCalendarAlt, FaWrench, FaMicroscope, FaBook } from 'react-icons/fa';
import { FaRegCalendarXmark } from 'react-icons/fa6';
import { IoIosWarning } from "react-icons/io";
import { LuTestTubeDiagonal } from 'react-icons/lu';

export default function Home() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          setTechnicians(data);
        } else {
          setError('Failed to fetch technician status');
        }
      } catch (err) {
        setError('Error loading status data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#4ECDC4';
      case 'mc':
        return '#FF6B6B';
      case 'childcare leave':
        return '#FFA500';
      case 'on course':
        return '#9B59B6';
      case 'on leave':
        return '#E67E22';
      default:
        return '#888888';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'mc':
        return 'MC';
      case 'childcare leave':
        return 'Childcare Leave';
      case 'on course':
        return 'On Course';
      case 'on leave':
        return 'On Leave';
      default:
        return status || 'Unknown';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'present':
        return <TiTick size={32} />;
      case 'mc':
        return <FaHospital size={24} />;
      case 'childcare leave':
        return <MdChildFriendly size={28} />;
      case 'on course':
        return <FaBook size={24} />;
      case 'on leave':
        return <FaRegCalendarXmark size={24} />;
      default:
        return '❓';
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
            color: '#000000',
            
            
            
            marginBottom: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
          }}>
            Lab Information
          </h1>
          <p style={{
            color: '#000000',
            fontSize: '1.1rem',
            fontWeight: '300',
          }}>
            Lab information, technician availability and important notices
          </p>
        </div>

        {/* Opening Hours Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          {/* Lab Hours */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            padding: '30px',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(78, 205, 196, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
          }}>
            <h2 style={{
              color: '#000000',
              fontSize: '1.3rem',
              fontWeight: '700',
              margin: '0 0 20px 0',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <FaMicroscope /> Lab Opening Hours
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 20px',
              background: 'rgba(78, 205, 196, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(78, 205, 196, 0.2)',
            }}>
              <span style={{
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                Monday – Friday
              </span>
              <span style={{
                color: '#4ECDC4',
                fontSize: '1.2rem',
                fontWeight: '700',
              }}>
                7:00 AM – 5:00 PM
              </span>
            </div>
          </div>

          {/* Prep Room Hours */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            padding: '30px',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(69, 183, 209, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
          }}>
            <h2 style={{
              color: '#000000',
              fontSize: '1.3rem',
              fontWeight: '700',
              margin: '0 0 20px 0',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <LuTestTubeDiagonal /> Lab Prep Room Hours
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 20px',
              background: 'rgba(69, 183, 209, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(69, 183, 209, 0.2)',
            }}>
              <span style={{
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                Monday – Friday
              </span>
              <span style={{
                color: '#45B7D1',
                fontSize: '1.2rem',
                fontWeight: '700',
              }}>
                7:00 AM – 4:30 PM
              </span>
            </div>
          </div>
        </div>

        {/* Lab Technician Status Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            color: '#000000',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            letterSpacing: '0.5px',
          }}>
            Lab Technician Status
          </h2>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            color: '#000000',
            fontSize: '1.1rem',
            padding: '60px 0',
          }}>
            Loading technician status...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            textAlign: 'center',
            color: '#FF6B6B',
            fontSize: '1rem',
            padding: '40px 0',
            fontWeight: '500',
          }}>
            {error}
          </div>
        )}

        {/* Technician Cards */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gap: '20px',
          }}>
            {technicians.length > 0 ? (
              technicians.map((tech, index) => {
                const statusColor = getStatusColor(tech.status);
                return (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '15px',
                      padding: '30px',
                      backdropFilter: 'blur(20px)',
                      border: `2px solid ${statusColor}44`,
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '25px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Status Indicator */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '15px',
                      background: `${statusColor}22`,
                      border: `2px solid ${statusColor}66`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      flexShrink: 0,
                      color: statusColor,
                    }}>
                      {getStatusEmoji(tech.status)}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        color: '#000000',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                      }}>
                        {tech.name}
                      </h3>

                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}>
                        {tech.location && (
                          <span style={{
                            color: '#000000',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <MdLocationPin size={18} /> {tech.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                      padding: '10px 20px',
                      borderRadius: '25px',
                      background: `${statusColor}22`,
                      border: `1px solid ${statusColor}66`,
                      flexShrink: 0,
                    }}>
                      <span style={{
                        color: statusColor,
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                      }}>
                        {getStatusLabel(tech.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
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
                  No technician status data available
                </p>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Important Notes Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 165, 0, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
        }}>
          <h2 style={{
            color: '#000000',
            fontSize: '1.3rem',
            fontWeight: '700',
            margin: '0 0 20px 0',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <IoIosWarning /> Important Notes
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              background: 'rgba(255, 165, 0, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 165, 0, 0.15)',
            }}>
              <span style={{ fontSize: '1.3rem', color: '#000000' }}><FaCalendarAlt /></span>
              <span style={{
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                Book labs at least <strong style={{ color: '#1e40af' }}>5 days</strong> in advance
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              background: 'rgba(255, 165, 0, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 165, 0, 0.15)',
            }}>
              <span style={{ fontSize: '1.3rem' }}>❌</span>
              <span style={{
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                Cancel bookings at least <strong style={{ color: '#1e40af' }}>24 hours</strong> in advance
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              background: 'rgba(255, 165, 0, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 165, 0, 0.15)',
            }}>
              <FaWrench style={{ fontSize: '1.3rem', color: '#000000' }} />
              <span style={{
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                Report any breakages <strong style={{ color: '#1e40af' }}>immediately</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
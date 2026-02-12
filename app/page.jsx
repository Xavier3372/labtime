"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedLab, setSelectedLab] = useState('Physics Lab 1');
  const [bookings, setBookings] = useState({});
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openBookingModal = (booking, date) => {
    setSelectedBooking({ ...booking, date });
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };
  
  // Get the Monday of the current week
  const getMondayOfWeek = (offset = 0) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if Sunday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (offset * 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Get array of dates for the week
  const getWeekDates = () => {
    const monday = getMondayOfWeek(currentWeekOffset);
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatWeekRange = () => {
    const dates = getWeekDates();
    const start = formatDate(dates[0]);
    const end = formatDate(dates[4]);
    const year = dates[0].getFullYear();
    return `${start} - ${end}, ${year}`;
  };

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };
  
  const labs = [
    { name: 'Physics Lab 1', color: '#FF6B6B', category: 'Physics' },
    { name: 'Physics Lab 2', color: '#FF8E8E', category: 'Physics' },
    { name: 'Chemistry Lab 1', color: '#4ECDC4', category: 'Chemistry' },
    { name: 'Chemistry Lab 2', color: '#6FE6DD', category: 'Chemistry' },
    { name: 'Biology Lab 1', color: '#95E1D3', category: 'Biology' },
    { name: 'Biology Lab 2', color: '#B8F4E8', category: 'Biology' },
  ];

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Fetch booking data from Google Sheets
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
          console.log('✅ Bookings loaded from Google Sheets');
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getBookingsForDate = (date) => {
    const dateKey = getDateKey(date);
    return bookings[selectedLab]?.[dateKey] || [];
  };

  const getBookingForSlot = (date, hour) => {
    const dayBookings = getBookingsForDate(date);
    return dayBookings.find(
      booking => hour >= booking.startTime && hour < booking.endTime
    );
  };

  const isBookingStart = (date, hour) => {
    const dayBookings = getBookingsForDate(date);
    return dayBookings.some(booking => booking.startTime === hour);
  };

  const selectedLabData = labs.find(lab => lab.name === selectedLab);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: '"Poppins", sans-serif',
      padding: '40px 20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      
      <div style={{
        maxWidth: '1600px',
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
            SCSS Science Lab Booking
          </h1>
          <p style={{
            color: '#a0a0c0',
            fontSize: '1.1rem',
            fontWeight: '300',
          }}>
            Schedule and manage your lab sessions
          </p>
        </div>

        {/* Lab Selector */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          {labs.map((lab) => (
            <button
              key={lab.name}
              onClick={() => setSelectedLab(lab.name)}
              style={{
                padding: '15px 30px',
                border: selectedLab === lab.name ? `3px solid ${lab.color}` : '3px solid transparent',
                borderRadius: '15px',
                background: selectedLab === lab.name 
                  ? `linear-gradient(135deg, ${lab.color}22 0%, ${lab.color}11 100%)`
                  : 'rgba(255, 255, 255, 0.05)',
                color: selectedLab === lab.name ? lab.color : '#ffffff',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: selectedLab === lab.name 
                  ? `0 8px 32px ${lab.color}44` 
                  : '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${lab.color}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = selectedLab === lab.name 
                  ? `0 8px 32px ${lab.color}44` 
                  : '0 4px 16px rgba(0, 0, 0, 0.2)';
              }}
            >
              {lab.name}
            </button>
          ))}
        </div>

        {/* Week Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={goToPreviousWeek}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '12px',
              color: '#FFD700',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'translateX(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span>
            Previous Week
          </button>

          <div style={{
            padding: '12px 30px',
            background: 'rgba(255, 215, 0, 0.15)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            borderRadius: '12px',
            color: '#FFD700',
            fontSize: '1.1rem',
            fontWeight: '700',
            backdropFilter: 'blur(10px)',
            letterSpacing: '0.5px',
          }}>
            {formatWeekRange()}
          </div>

          {currentWeekOffset !== 0 && (
            <button
              onClick={goToCurrentWeek}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 215, 0, 0.2)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                borderRadius: '12px',
                color: '#FFD700',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Current Week
            </button>
          )}

          <button
            onClick={goToNextWeek}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '12px',
              color: '#FFD700',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.transform = 'translateX(3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            Next Week
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '25px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px repeat(5, 1fr)',
            gap: '2px',
            overflow: 'auto',
          }}>
            {/* Header Row */}
            <div style={{
              padding: '15px',
              fontWeight: '600',
              color: '#FFD700',
              fontSize: '0.9rem',
            }}>
              Time
            </div>
            {weekDates.map((date, index) => (
              <div
                key={index}
                style={{
                  padding: '15px 10px',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div>{getDayName(date)}</div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: '#FFA500',
                  letterSpacing: '0.5px',
                }}>
                  {formatDate(date)}
                </div>
              </div>
            ))}

            {/* Time Slots */}
            {hours.map((hour) => (
              <>
                <div
                  key={`time-${hour}`}
                  style={{
                    padding: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    color: '#a0a0c0',
                    fontSize: '0.85rem',
                  }}
                >
                  {hour}:00
                </div>
                {weekDates.map((date, index) => {
                  const booking = getBookingForSlot(date, hour);
                  const isStart = isBookingStart(date, hour);

                  return (
                    <div
                      key={`${index}-${hour}`}
                      onClick={() => booking && isStart && openBookingModal(booking, date)}
                      style={{
                        padding: '8px',
                        minHeight: '70px',
                        background: booking 
                          ? `linear-gradient(135deg, ${selectedLabData.color}dd 0%, ${selectedLabData.color}bb 100%)`
                          : 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        border: booking ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        cursor: booking ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => {
                        if (booking) {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.zIndex = '10';
                          e.currentTarget.style.boxShadow = `0 8px 30px ${selectedLabData.color}88`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (booking) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '1';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {booking && isStart && (
                        <div>
                          <div style={{
                            color: '#ffffff',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                            lineHeight: '1.2',
                          }}>
                            {booking.title}
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            fontSize: '0.75rem',
                            fontWeight: '400',
                          }}>
                            {booking.instructor}
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.7rem',
                            marginTop: '4px',
                            fontWeight: '600',
                          }}>
                            {booking.startTime}:00 - {booking.endTime}:00
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#a0a0c0',
            fontSize: '0.9rem',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '5px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }} />
            Available
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#a0a0c0',
            fontSize: '0.9rem',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: `linear-gradient(135deg, ${selectedLabData.color}dd 0%, ${selectedLabData.color}bb 100%)`,
              borderRadius: '5px',
            }} />
            Booked
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div
          onClick={closeBookingModal}
          style={{
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
            padding: '20px',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { 
                  opacity: 0;
                  transform: translateY(30px) scale(0.95);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}
          </style>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '25px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              border: `2px solid ${selectedLabData.color}`,
              boxShadow: `0 20px 60px ${selectedLabData.color}44`,
              animation: 'slideUp 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeBookingModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              ×
            </button>

            {/* Modal Content */}
            <div style={{
              color: '#ffffff',
            }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: `${selectedLabData.color}33`,
                borderRadius: '20px',
                color: selectedLabData.color,
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '20px',
                border: `1px solid ${selectedLabData.color}66`,
              }}>
                {selectedLab}
              </div>

              <h2 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '2.5rem',
                marginBottom: '10px',
                color: '#FFD700',
                fontWeight: '700',
              }}>
                {selectedBooking.title}
              </h2>

              <div style={{
                height: '2px',
                background: `linear-gradient(90deg, ${selectedLabData.color} 0%, transparent 100%)`,
                marginBottom: '30px',
              }} />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: `${selectedLabData.color}22`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: `2px solid ${selectedLabData.color}66`,
                  }}>
                    👨‍🏫
                  </div>
                  <div>
                    <div style={{
                      color: '#a0a0c0',
                      fontSize: '0.85rem',
                      marginBottom: '4px',
                    }}>
                      Teacher
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}>
                      {selectedBooking.instructor}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: `${selectedLabData.color}22`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: `2px solid ${selectedLabData.color}66`,
                  }}>
                    📅
                  </div>
                  <div>
                    <div style={{
                      color: '#a0a0c0',
                      fontSize: '0.85rem',
                      marginBottom: '4px',
                    }}>
                      Date & Day
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}>
                      {getDayName(selectedBooking.date)}, {formatDate(selectedBooking.date)}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: `${selectedLabData.color}22`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: `2px solid ${selectedLabData.color}66`,
                  }}>
                    ⏰
                  </div>
                  <div>
                    <div style={{
                      color: '#a0a0c0',
                      fontSize: '0.85rem',
                      marginBottom: '4px',
                    }}>
                      Time & Duration
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}>
                      {selectedBooking.startTime}:00 - {selectedBooking.endTime}:00
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '15px',
                marginTop: '35px',
              }}>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
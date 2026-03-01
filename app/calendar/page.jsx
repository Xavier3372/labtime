"use client";
import { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { MdOutlineClass } from 'react-icons/md';

export default function Calendar() {
  const [bookings, setBookings] = useState({});
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeksData, setWeeksData] = useState({});
  
  const openBookingModal = (booking, date) => {
    setSelectedBooking({ ...booking, date });
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };
  
  const getMondayOfWeek = (offset = 0) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (offset * 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

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

  const goToPreviousWeek = () => setCurrentWeekOffset(currentWeekOffset - 1);
  const goToNextWeek = () => setCurrentWeekOffset(currentWeekOffset + 1);
  const goToCurrentWeek = () => setCurrentWeekOffset(0);
  
  const labs = [
    { name: 'Physics Lab 1', color: '#FF6B6B', category: 'Physics' },
    { name: 'Physics Lab 2', color: '#FF8E8E', category: 'Physics' },
    { name: 'Chemistry Lab 1', color: '#4ECDC4', category: 'Chemistry' },
    { name: 'Chemistry Lab 2', color: '#6FE6DD', category: 'Chemistry' },
    { name: 'Biology Lab 1', color: '#95E1D3', category: 'Biology' },
    { name: 'Biology Lab 2', color: '#B8F4E8', category: 'Biology' },
  ];
  
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatTime = (timeValue) => {
    const hour = Math.floor(timeValue);
    const minutes = Math.round((timeValue % 1) * 60);
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const levelColors = {
    'Secondary 1': '#4ECDC4',
    'Secondary 2': '#45B7D1',
    'Secondary 3': '#F7DC6F',
    'Secondary 4': '#FF8C42',
    'Secondary 5': '#E74C3C',
  };

  const getLevelColor = (booking) => {
    if (!booking?.level) return '#888888';
    return levelColors[booking.level] || '#888888';
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    const fetchWeeks = async () => {
      try {
        const response = await fetch('/api/weeks');
        if (response.ok) {
          const data = await response.json();
          setWeeksData(data);
        } else {
          console.error('Failed to fetch weeks data');
        }
      } catch (error) {
        console.error('Error fetching weeks:', error);
      }
    };
    fetchBookings();
    fetchWeeks();
  }, []);

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekLabel = () => {
    const monday = getMondayOfWeek(currentWeekOffset);
    const mondayKey = getDateKey(monday);
    return weeksData[mondayKey] || null;
  };

  // Get bookings for a specific lab and date, sorted by start time
  const getLabBookingsForDate = (labName, date) => {
    const dateKey = getDateKey(date);
    const labBookings = bookings[labName]?.[dateKey] || [];
    const seen = new Set();
    const unique = [];
    for (const booking of labBookings) {
      const key = `${booking.startTime}-${booking.title}-${booking.instructor}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(booking);
      }
    }
    unique.sort((a, b) => a.startTime - b.startTime);
    return unique;
  };

  const getLabData = (labName) => labs.find(lab => lab.name === labName);

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
            {getWeekLabel() || formatWeekRange()}
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

        {/* Calendar Grid - Labs as Rows, Days as Columns */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '25px',
          padding: '25px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          overflowX: 'auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '160px repeat(5, 1fr)',
            gap: '8px',
            minWidth: '900px',
          }}>
            {/* Header Row */}
            <div style={{
              padding: '12px',
              fontWeight: '700',
              color: '#FFD700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              Lab
            </div>
            {weekDates.map((date, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div>{getDayName(date)}</div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: '#FFA500',
                }}>
                  {formatDate(date)}
                </div>
              </div>
            ))}

            {/* Lab Rows */}
            {labs.map((lab) => (
              <>
                {/* Lab Name Cell */}
                <div
                  key={`label-${lab.name}`}
                  style={{
                    padding: '15px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '10px',
                    background: `${lab.color}11`,
                    border: `1px solid ${lab.color}33`,
                  }}
                >
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: lab.color,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    color: lab.color,
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    lineHeight: '1.2',
                  }}>
                    {lab.name}
                  </span>
                </div>

                {/* Day Cells for this Lab */}
                {weekDates.map((date, dayIndex) => {
                  const dayBookings = getLabBookingsForDate(lab.name, date);
                  return (
                    <div
                      key={`${lab.name}-${dayIndex}`}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {dayBookings.length > 0 ? (
                        dayBookings.map((booking, bIndex) => {
                          const levelColor = getLevelColor(booking);
                          return (
                            <div
                              key={bIndex}
                              onClick={() => openBookingModal({ ...booking, labName: lab.name }, date)}
                              style={{
                                padding: '8px 10px',
                                background: `linear-gradient(135deg, ${levelColor}22 0%, ${levelColor}11 100%)`,
                                borderRadius: '8px',
                                border: `1px solid ${levelColor}44`,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = `0 4px 12px ${levelColor}44`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{
                                color: levelColor,
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                marginBottom: '2px',
                              }}>
                                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                              </div>
                              <div style={{
                                color: '#ffffff',
                                fontWeight: '600',
                                fontSize: '0.75rem',
                                lineHeight: '1.2',
                              }}>
                                {booking.title}
                              </div>
                              <div style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.65rem',
                              }}>
                                {booking.instructor}
                              </div>
                            </div>
                          );
                        })
                      ) : null}
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
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          {Object.entries(levelColors).map(([level, color]) => (
            <div key={level} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#a0a0c0',
              fontSize: '0.9rem',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`,
                borderRadius: '5px',
              }} />
              {level}
            </div>
          ))}
        </div>

      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (() => {
        const modalLabData = getLabData(selectedBooking.labName);
        const modalLabColor = modalLabData?.color || '#888888';
        return (
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
                border: `2px solid ${modalLabColor}`,
                boxShadow: `0 20px 60px ${modalLabColor}44`,
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
              <div style={{ color: '#ffffff' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: `${modalLabColor}33`,
                  borderRadius: '20px',
                  color: modalLabColor,
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  border: `1px solid ${modalLabColor}66`,
                }}>
                  {selectedBooking.labName}
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
                  background: `linear-gradient(90deg, ${modalLabColor} 0%, transparent 100%)`,
                  marginBottom: '30px',
                }} />

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px', height: '50px',
                      background: `${modalLabColor}22`, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', border: `2px solid ${modalLabColor}66`, color: modalLabColor,
                    }}>
                      <FaChalkboardTeacher size={24} />
                    </div>
                    <div>
                      <div style={{ color: '#a0a0c0', fontSize: '0.85rem', marginBottom: '4px' }}>Teacher</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedBooking.instructor}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px', height: '50px',
                      background: `${modalLabColor}22`, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', border: `2px solid ${modalLabColor}66`, color: modalLabColor,
                    }}>
                      <FaRegCalendarAlt size={24} />
                    </div>
                    <div>
                      <div style={{ color: '#a0a0c0', fontSize: '0.85rem', marginBottom: '4px' }}>Date & Day</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                        {getDayName(selectedBooking.date)}, {formatDate(selectedBooking.date)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px', height: '50px',
                      background: `${modalLabColor}22`, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', border: `2px solid ${modalLabColor}66`, color: modalLabColor,
                    }}>
                      <FaRegClock size={28} />
                    </div>
                    <div>
                      <div style={{ color: '#a0a0c0', fontSize: '0.85rem', marginBottom: '4px' }}>Time</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                        {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px', height: '50px',
                      background: `${modalLabColor}22`, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', border: `2px solid ${modalLabColor}66`, color: modalLabColor,
                    }}>
                      <IoMdPeople size={28} />
                    </div>
                    <div>
                      <div style={{ color: '#a0a0c0', fontSize: '0.85rem', marginBottom: '4px' }}>Number of Students</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedBooking.numStudents || '—'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '50px', height: '50px',
                      background: `${modalLabColor}22`, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', border: `2px solid ${modalLabColor}66`, color: modalLabColor,
                    }}>
                      <MdOutlineClass size={28} />
                    </div>
                    <div>
                      <div style={{ color: '#a0a0c0', fontSize: '0.85rem', marginBottom: '4px' }}>Class</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedBooking.class || '—'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}></div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

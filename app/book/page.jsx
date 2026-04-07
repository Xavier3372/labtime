"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';


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
    workType: '',
    notes: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const calendarRef = useRef(null);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Compute the minimum bookable date (5 working days from today)
  const minBookableDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let current = new Date(today);
    let skipped = 0;
    while (skipped < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() >= 1 && current.getDay() <= 5) {
        skipped++;
      }
    }
    return current;
  }, []);

  // Check if a date is a valid bookable working day
  const isDateBookable = useCallback((date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return false; // weekend
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= minBookableDate;
  }, [minBookableDate]);

  // Generate calendar grid for a given month
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows = [];
    let week = new Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(new Date(year, month, d));
      if (week.length === 7) {
        rows.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      rows.push(week);
    }
    return rows;
  }, [calendarMonth]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dd = String(d.getDate()).padStart(2, '0');
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const yyyy = d.getFullYear();
    return `${dayName}, ${dd} ${monthName} ${yyyy}`;
  };

  const labs = [
    { name: 'Physics Lab 1', color: '#FF6B6B', category: 'Physics' },
    { name: 'Physics Lab 2', color: '#FF8E8E', category: 'Physics' },
    { name: 'Chemistry Lab 1', color: '#4ECDC4', category: 'Chemistry' },
    { name: 'Chemistry Lab 2', color: '#6FE6DD', category: 'Chemistry' },
    { name: 'Biology Lab 1', color: '#95E1D3', category: 'Biology' },
    { name: 'Biology Lab 2', color: '#B8F4E8', category: 'Biology' },
  ];

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minutes = (i % 2) * 30;
    return {
      value: hour + minutes / 60,
      label: `${hour}:${minutes === 0 ? '00' : '30'}`,
    };
  });

  const endTimeSlots = [...timeSlots, { value: 17, label: '17:00' }];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
      // format time
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
      // clear form
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
        workType: '',
        notes: '',
      });
    }, 3000);
  };

  const labColor = '#1e40af';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
      fontFamily: '"Poppins", sans-serif',
      padding: '40px 20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      
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
            color: '#000000',
            
            
            
            marginBottom: '10px',
            fontWeight: '700',
            letterSpacing: '2px',
          }}>
            Book a Laboratory
          </h1>
          <p style={{
            color: '#000000',
            fontSize: '1.1rem',
            fontWeight: '300',
          }}>
            Reserve your lab session with ease
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '25px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
        }}>


          {/* Date and Time Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Date */}
            <div ref={calendarRef} style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Date *
              </label>
              {/* Hidden input for form validation */}
              <input
                type="hidden"
                value={formData.date}
                required
              />
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: `2px solid ${showCalendar ? labColor : 'rgba(0, 0, 0, 0.08)'}`,
                  borderRadius: '12px',
                  color: formData.date ? '#000000' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                }}
              >
                <span>{formData.date ? formatDateDisplay(formData.date) : 'Select date'}</span>
              </div>

              {/* Calendar Popup */}
              {showCalendar && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  zIndex: 1000,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                  minWidth: '320px',
                  backdropFilter: 'blur(20px)',
                }}>
                  {/* Month navigation */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      style={{
                        background: 'rgba(0, 0, 0, 0.05)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000000',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
                    >
                      &#8249;
                    </button>
                    <span style={{
                      color: '#000000',
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      letterSpacing: '0.5px',
                    }}>
                      {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      style={{
                        background: 'rgba(0, 0, 0, 0.05)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#000000',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
                    >
                      &#8250;
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '8px',
                  }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} style={{
                        textAlign: 'center',
                        color: '#000000',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '4px 0',
                        letterSpacing: '0.5px',
                      }}>
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day grid */}
                  {calendarDays.map((week, wi) => (
                    <div key={wi} style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: '4px',
                    }}>
                      {week.map((day, di) => {
                        if (!day) {
                          return <div key={di} style={{ padding: '10px' }} />;
                        }
                        const bookable = isDateBookable(day);
                        const yyyy = day.getFullYear();
                        const mm = String(day.getMonth() + 1).padStart(2, '0');
                        const dd = String(day.getDate()).padStart(2, '0');
                        const dateVal = `${yyyy}-${mm}-${dd}`;
                        const isSelected = formData.date === dateVal;
                        const isToday = (() => {
                          const t = new Date(); t.setHours(0,0,0,0);
                          return day.getTime() === t.getTime();
                        })();

                        return (
                          <button
                            type="button"
                            key={di}
                            disabled={!bookable}
                            onClick={() => {
                              if (bookable) {
                                handleInputChange('date', dateVal);
                                setShowCalendar(false);
                              }
                            }}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '10px',
                              border: isToday ? '1px solid rgba(30, 64, 175, 0.4)' : '1px solid transparent',
                              background: isSelected
                                ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
                                : bookable
                                  ? 'rgba(0, 0, 0, 0.02)'
                                  : 'transparent',
                              color: isSelected
                                ? '#ffffff'
                                : bookable
                                  ? '#000000'
                                  : 'rgba(0, 0, 0, 0.2)',
                              fontWeight: isSelected ? '700' : '400',
                              fontSize: '0.9rem',
                              fontFamily: '"Poppins", sans-serif',
                              cursor: bookable ? 'pointer' : 'default',
                              transition: 'all 0.2s ease',
                              textAlign: 'center',
                            }}
                            onMouseEnter={(e) => {
                              if (bookable && !isSelected) {
                                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (bookable && !isSelected) {
                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                              }
                            }}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {/* Legend */}
                  <div style={{
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#000000', fontSize: '0.7rem' }}>
                      &#9679; Weekends &amp; &lt;5 working days disabled
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label style={{
                display: 'block',
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: formData.startTime ? '#000000' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                }}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value} style={{ background: '#ffffff' }}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label style={{
                display: 'block',
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: formData.endTime ? '#000000' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                }}
              >
                <option value="">Select time</option>
                {endTimeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value} style={{ background: '#ffffff' }}>
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
              color: '#000000',
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
                background: 'rgba(0, 0, 0, 0.03)',
                border: '2px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
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

          {/* Teacher Name */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
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
                background: 'rgba(0, 0, 0, 0.03)',
                border: '2px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
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
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
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
          </div>

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
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
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

            {/* Level */}
            <div>
              <label style={{
                display: 'block',
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: formData.level ? '#000000' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                }}
              >
                <option value="">Select level</option>
                <option value="Secondary 1" style={{ background: '#ffffff' }}>Secondary 1</option>
                <option value="Secondary 2" style={{ background: '#ffffff' }}>Secondary 2</option>
                <option value="Secondary 3" style={{ background: '#ffffff' }}>Secondary 3</option>
                <option value="Secondary 4" style={{ background: '#ffffff' }}>Secondary 4</option>
                <option value="Secondary 5" style={{ background: '#ffffff' }}>Secondary 5</option>
              </select>
            </div>

            {/* Class */}
            <div>
              <label style={{
                display: 'block',
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: '#000000',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
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

            {/* Subject */}
            <div>
              <label style={{
                display: 'block',
                color: '#000000',
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
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: formData.subject ? '#000000' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                }}
              >
                <option value="">Select subject</option>
                <option value="Pure Physics" style={{ background: '#ffffff' }}>Pure Physics</option>
                <option value="Science Physics" style={{ background: '#ffffff' }}>Science Physics</option>
                <option value="Pure Chemistry" style={{ background: '#ffffff' }}>Pure Chemistry</option>
                <option value="Science Chemistry" style={{ background: '#ffffff' }}>Science Chemistry</option>
                <option value="Pure Biology" style={{ background: '#ffffff' }}>Pure Biology</option>
                <option value="Science Biology" style={{ background: '#ffffff' }}>Science Biology</option>
                <option value="Lower Secondary Science" style={{ background: '#ffffff' }}>Lower Secondary Science</option>
                <option value="Upper Secondary Science" style={{ background: '#ffffff' }}>Upper Secondary Science</option>
              </select>
            </div>

            {/* Type of Work */}
            <div>
              <label style={{
                display: 'block',
                color: '#000000',
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}>
                Type of Work *
              </label>
              <select
                value={formData.workType}
                onChange={(e) => handleInputChange('workType', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  color: formData.workType ? '#000000' : '#a0a0c0',
                  fontSize: '1rem',
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                }}
              >
                <option value="">Select type</option>
                <option value="Individual" style={{ background: '#ffffff' }}>Individual</option>
                <option value="Pairwork" style={{ background: '#ffffff' }}>Pairwork</option>
                <option value="Groupwork" style={{ background: '#ffffff' }}>Groupwork</option>
              </select>
            </div>
          </div>

          {/* Experiment Details */}
          <div style={{ marginBottom: '35px' }}>
            <label style={{
              display: 'block',
              color: '#000000',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}>
              Experiment Details
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Describe the experiment, equipment needed, or special requirements..."
              rows={4}
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
                resize: 'vertical',
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

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px',
              background: `linear-gradient(135deg, ${labColor} 0%, ${labColor}dd 100%)`,
              border: 'none',
              borderRadius: '15px',
              color: '#000000',
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
          background: 'rgba(0, 0, 0, 0.4)',
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
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
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
              color: '#000000',
              marginBottom: '15px',
              fontWeight: '700',
            }}>
              Booking Confirmed!
            </h2>
            <p style={{
              color: '#000000',
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
    </div>
  );
}
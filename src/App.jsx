import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInput, setTimerInput] = useState('');
  
  const [cycleDay, setCycleDay] = useState(1);
  const specials = ['Library', 'STEM', 'Art', 'Music', 'PE', 'Library'];
  
  const [seatingChart, setSeatingChart] = useState([
    ['Chloe', 'Asher', 'Adam', 'Jaycob', 'Noemi'],
    ['Kairo', 'Wilder', 'Declan', 'Luna', 'Abygael'],
    ['Jaxiel', '', 'Jonael', 'Eliza', 'Jonathan'],
    ['Scarlet', 'Lucas', 'Xander', 'Jayceon', 'Valentina']
  ]);

  const [deskAssignments, setDeskAssignments] = useState({
    blue: ['Name1', 'Name2', 'Name3', 'Name4', 'Name5', 'Name6'],
    red: ['Name1', 'Name2', 'Name3', 'Name4', 'Name5', 'Name6'],
    yellow: ['Name1', 'Name2', 'Name3', 'Name4', 'Name5', 'Name6'],
    green: ['Name1', 'Name2', 'Name3', 'Name4', 'Name5', 'Name6']
  });

  const [schedule, setSchedule] = useState([
    { time: '8:15-8:30', activity: 'Welcome & Procedures' },
    { time: '8:30-8:50', activity: 'Morning Meeting' },
    { time: '8:50-9:00', activity: 'Morning Announcements' },
    { time: '9:00-10:00', activity: 'Literacy Centers' },
    { time: '10:00-10:30', activity: 'Recess' },
    { time: '10:30-11:15', activity: 'Math' },
    { time: '11:15-12:05', activity: 'Lunch' },
    { time: '12:05-12:35', activity: 'Lunch Recess' },
    { time: '12:35-1:15', activity: 'Science/Social Studies' },
    { time: '1:15-2:00', activity: 'Specials' },
    { time: '2:00-3:00', activity: 'Read Aloud & Wind Down' },
    { time: '3:00-3:15', activity: 'Pack Up & Dismissal' }
  ]);

  const [heggerty, setHeggerty] = useState('Heggerty Program Coming Soon');
  const [musicUrl, setMusicUrl] = useState('https://www.youtube.com/embed/bK_LBMr8Pxg');
  const [morningAnnounceLink, setMorningAnnounceLink] = useState('https://drive.google.com/drive/folders/1J7-Oi8Xo9k7YqerOxjwKzx8c9ib0GD9s');
  const [seatingChartUrl, setSeatingChartUrl] = useState('https://www.canva.com/design/DAG2oB1ugvY/ddVUcEVIgrmAJkcInHIjRw/edit');

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      const stored = localStorage.getItem('morning_meeting_full_data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.cycleDay) setCycleDay(data.cycleDay);
        if (data.seatingChart) setSeatingChart(data.seatingChart);
        if (data.deskAssignments) setDeskAssignments(data.deskAssignments);
        if (data.schedule) setSchedule(data.schedule);
        if (data.heggerty) setHeggerty(data.heggerty);
        if (data.musicUrl) setMusicUrl(data.musicUrl);
        if (data.morningAnnounceLink) setMorningAnnounceLink(data.morningAnnounceLink);
        if (data.seatingChartUrl) setSeatingChartUrl(data.seatingChartUrl);
      }
    } catch (_) {
      console.log('Storage error');
    }
  }, []);
  
  const saveData = () => {
    const data = {
      cycleDay,
      seatingChart,
      deskAssignments,
      schedule,
      heggerty,
      musicUrl,
      morningAnnounceLink,
      seatingChartUrl
    };
    try {
      localStorage.setItem('morning_meeting_full_data', JSON.stringify(data));
      alert('Changes saved!');
    } catch (_) {
      alert('Could not save changes');
    }
  };

  const calculateDaysOfSchool = () => {
    const schoolStart = new Date(2026, 7, 26);
    const today = new Date();
    const diff = today - schoolStart;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    
    let schoolDays = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(schoolStart);
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 6) schoolDays++;
    }
    return schoolDays;
  };

  const handleLogin = () => {
    if (passwordAttempt === 'SCES') {
      setIsLoggedIn(true);
      setPasswordAttempt('');
    } else {
      alert('Incorrect password');
      setPasswordAttempt('');
    }
  };

  const incrementCycleDay = () => {
    const next = cycleDay === 6 ? 1 : cycleDay + 1;
    setCycleDay(next);
  };

  const updateSeatingChart = (row, col, value) => {
    const newChart = seatingChart.map(r => [...r]);
    newChart[row][col] = value;
    setSeatingChart(newChart);
  };

  const updateDeskAssignment = (cluster, index, value) => {
    setDeskAssignments({
      ...deskAssignments,
      [cluster]: deskAssignments[cluster].map((name, i) => i === index ? value : name)
    });
  };

  const updateSchedule = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  useEffect(() => {
    let interval;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const setTimer = () => {
    const mins = parseInt(timerInput, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimerSeconds(mins * 60);
      setTimerActive(true);
      setTimerInput('');
    }
  };

  const pages = [
    {
      title: 'Good Morning!',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FF6B9D' }}>☀️ Good Morning! ☀️</div>
          <div style={{ fontSize: '24px', color: '#4A90E2', fontWeight: 'bold' }}>Let's start our day!</div>
          
          <div style={{ marginTop: '1rem' }}>
            <iframe
              width="400"
              height="225"
              src={musicUrl}
              title="Morning Music"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '16px', border: '4px solid #FFD700' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <div style={{ background: '#B4E7FF', padding: '1.5rem', borderRadius: '16px', flex: '1', minWidth: '150px', border: '4px solid #4A90E2' }}>
              <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>💧</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0052CC' }}>Water Bottle</div>
              <div style={{ fontSize: '14px', color: '#003D99', marginTop: '0.5rem' }}>Put away</div>
            </div>
            <div style={{ background: '#FFE5CC', padding: '1.5rem', borderRadius: '16px', flex: '1', minWidth: '150px', border: '4px solid #FF9500' }}>
              <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>📁</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#FF6600' }}>Folder</div>
              <div style={{ fontSize: '14px', color: '#CC5200', marginTop: '0.5rem' }}>Put away</div>
            </div>
            <div style={{ background: '#FFB3D9', padding: '1.5rem', borderRadius: '16px', flex: '1', minWidth: '150px', border: '4px solid #FF1493' }}>
              <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>🎒</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#C71585' }}>Morning Bin</div>
              <div style={{ fontSize: '14px', color: '#8B0C5C', marginTop: '0.5rem' }}>Get yours!</div>
            </div>
          </div>
        </div>
      )
    },

    {
      title: 'Seating Chart',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4A90E2' }}>🪑 Our Carpet Spots 🪑</div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: '0.75rem',
            padding: '1rem',
            background: '#F0F8FF',
            borderRadius: '12px',
            border: '4px solid #4A90E2'
          }}>
            {seatingChart.map((row, rowIdx) => 
              row.map((name, colIdx) => (
                <div key={`${rowIdx}-${colIdx}`} style={{
                  background: '#FFE5CC',
                  border: '3px solid #FF9500',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#CC5200',
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isLoggedIn ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateSeatingChart(rowIdx, colIdx, e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: '#CC5200'
                      }}
                    />
                  ) : (
                    name
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )
    },

    {
      title: 'Today\'s Info',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF6B9D' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          
          <div style={{ background: '#B4E7FF', padding: '2rem', borderRadius: '16px', border: '4px solid #4A90E2' }}>
            <div style={{ fontSize: '24px', color: '#0052CC', marginBottom: '0.5rem' }}>Cycle Day</div>
            <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#0052CC' }}>{cycleDay}</div>
            <div style={{ fontSize: '20px', color: '#003D99', marginTop: '1rem', fontWeight: 'bold' }}>Special: {specials[cycleDay - 1]}</div>
          </div>

          <div style={{ background: '#FFD700', padding: '2rem', borderRadius: '16px', border: '4px solid #FFA500' }}>
            <div style={{ fontSize: '24px', color: '#CC8200', marginBottom: '0.5rem' }}>Days of School</div>
            <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#CC8200' }}>{calculateDaysOfSchool()}</div>
          </div>
        </div>
      )
    },

    {
      title: 'Fun Time!',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '16px', textAlign: 'center' }}>
          <div style={{ padding: '1.5rem', background: '#E5CCFF', borderRadius: '12px', border: '3px solid #9966FF' }}>
            <div style={{ fontSize: '16px', color: '#663399', fontWeight: 'bold', marginBottom: '0.5rem' }}>🎉 FUN FACT 🎉</div>
            <div style={{ fontSize: '18px', color: '#5A2C7C' }}>Did you know? Honeybees dance to tell their friends where flowers are!</div>
          </div>
          
          <div style={{ padding: '1.5rem', background: '#FFE5E5', borderRadius: '12px', border: '3px solid #FF6B6B' }}>
            <div style={{ fontSize: '16px', color: '#CC0000', fontWeight: 'bold', marginBottom: '0.5rem' }}>❓ WOULD YOU RATHER ❓</div>
            <div style={{ fontSize: '18px', color: '#990000' }}>Have spaghetti for hair OR maple syrup for sweat?</div>
          </div>

          <div style={{ padding: '1.5rem', background: '#E5FFE5', borderRadius: '12px', border: '3px solid #66BB6A' }}>
            <div style={{ fontSize: '16px', color: '#00AA00', fontWeight: 'bold', marginBottom: '0.5rem' }}>🤔 THIS OR THAT 🤔</div>
            <div style={{ fontSize: '18px', color: '#006600', fontWeight: 'bold' }}>Pizza 🍕 or Tacos 🌮?</div>
          </div>

          <div style={{ padding: '1.5rem', background: '#FFCCCC', borderRadius: '12px', border: '3px solid #FF3333' }}>
            <div style={{ fontSize: '16px', color: '#990000', fontWeight: 'bold', marginBottom: '0.5rem' }}>✅ TRUE OR FALSE ✅</div>
            <div style={{ fontSize: '18px', color: '#660000' }}>Penguins live at the North Pole</div>
          </div>
        </div>
      )
    },

    {
      title: 'Heggerty',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '2rem', textAlign: 'center' }}>
          {isLoggedIn ? (
            <textarea
              value={heggerty}
              onChange={(e) => setHeggerty(e.target.value)}
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                padding: '2rem',
                borderRadius: '12px',
                border: '3px solid #4A90E2',
                width: '90%',
                minHeight: '200px',
                textAlign: 'center',
                color: '#4A90E2',
                fontFamily: 'inherit'
              }}
            />
          ) : (
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4A90E2', padding: '2rem', background: '#B4E7FF', borderRadius: '12px', border: '4px solid #4A90E2', maxWidth: '500px' }}>
              {heggerty}
            </div>
          )}
        </div>
      )
    },

    {
      title: 'Morning Announcements',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#FF6B9D' }}>📢 Announcements 📢</div>
          <a href={morningAnnounceLink} target="_blank" rel="noreferrer" style={{
            fontSize: '20px',
            color: 'white',
            background: '#4A90E2',
            padding: '1rem 2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            border: '4px solid #0052CC',
            fontWeight: 'bold'
          }}>
            👉 Watch Video 👈
          </a>
        </div>
      )
    },

    {
      title: 'Desk Assignments',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF6B9D' }}>🪑 Our Desks 🪑</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', width: '100%', maxWidth: '600px' }}>
            {/* Blue cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4A90E2' }}>Blue Table</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {deskAssignments.blue.map((name, idx) => (
                  <div key={idx} style={{
                    background: '#B4E7FF',
                    border: '3px solid #4A90E2',
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#0052CC',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}>
                    {isLoggedIn ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => updateDeskAssignment('blue', idx, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          color: '#0052CC'
                        }}
                      />
                    ) : (
                      name
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Red cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF6B6B' }}>Red Table</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {deskAssignments.red.map((name, idx) => (
                  <div key={idx} style={{
                    background: '#FFE5E5',
                    border: '3px solid #FF6B6B',
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#CC0000',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}>
                    {isLoggedIn ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => updateDeskAssignment('red', idx, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          color: '#CC0000'
                        }}
                      />
                    ) : (
                      name
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Yellow cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFB700' }}>Yellow Table</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {deskAssignments.yellow.map((name, idx) => (
                  <div key={idx} style={{
                    background: '#FFE5CC',
                    border: '3px solid #FFB700',
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#CC8200',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}>
                    {isLoggedIn ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => updateDeskAssignment('yellow', idx, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          color: '#CC8200'
                        }}
                      />
                    ) : (
                      name
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Green cluster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#66BB6A' }}>Green Table</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {deskAssignments.green.map((name, idx) => (
                  <div key={idx} style={{
                    background: '#E5FFE5',
                    border: '3px solid #66BB6A',
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#006600',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}>
                    {isLoggedIn ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => updateDeskAssignment('green', idx, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          color: '#006600'
                        }}
                      />
                    ) : (
                      name
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },

    {
      title: 'Daily Schedule',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF6B9D' }}>📅 Our Schedule 📅</div>
          <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {schedule.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1rem',
                background: '#F0F8FF',
                padding: '1rem',
                borderRadius: '12px',
                border: '3px solid #4A90E2'
              }}>
                {isLoggedIn ? (
                  <>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => updateSchedule(idx, 'time', e.target.value)}
                      style={{
                        flex: '0 0 100px',
                        fontWeight: 'bold',
                        border: '2px solid #4A90E2',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => updateSchedule(idx, 'activity', e.target.value)}
                      style={{
                        flex: 1,
                        border: '2px solid #4A90E2',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        fontSize: '14px'
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 'bold', color: '#0052CC', minWidth: '100px' }}>{item.time}</div>
                    <div style={{ color: '#003D99', flex: 1 }}>{item.activity}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '900px', 
      margin: '0 auto', 
      background: 'linear-gradient(135deg, #FFE5E5 0%, #E5CCFF 25%, #CCE5FF 50%, #E5FFE5 75%, #FFFFE5 100%)',
      minHeight: '100vh', 
      fontFamily: '"Comic Sans MS", "Arial Rounded MT Bold", cursive, sans-serif'
    }}>
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', border: '4px solid #FF6B9D', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        {timerActive ? (
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B9D' }}>
            ⏱ {formatTime(timerSeconds)}
          </div>
        ) : (
          <div style={{ color: '#666' }}>Timer</div>
        )}
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem', 
        minHeight: '450px', 
        marginBottom: '2rem', 
        border: '6px solid #FF6B9D', 
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem', 
          color: '#FF6B9D',
          textAlign: 'center'
        }}>
          {pages[currentSlide].title}
        </h1>
        {pages[currentSlide].content}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: '3px solid #4A90E2',
            background: '#B4E7FF',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#0052CC'
          }}
        >
          ← Back
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: i === currentSlide ? '4px solid #FF6B9D' : '3px solid #4A90E2',
                background: i === currentSlide ? '#FFB3D9' : '#B4E7FF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                color: i === currentSlide ? '#990033' : '#0052CC'
              }}
            >
              {i}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentSlide(Math.min(pages.length - 1, currentSlide + 1))}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: '3px solid #4A90E2',
            background: '#B4E7FF',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#0052CC'
          }}
        >
          Next →
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '3px solid #FFB700' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '0.75rem', color: '#CC8200' }}>Set Timer (minutes)</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="number"
            min="1"
            value={timerInput}
            onChange={(e) => setTimerInput(e.target.value)}
            placeholder="5"
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '2px solid #FFB700',
              background: 'white',
              flex: 1,
              fontSize: '14px'
            }}
          />
          <button
            onClick={setTimer}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '2px solid #FFB700',
              background: '#FFE5CC',
              color: '#CC8200',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Start
          </button>
          {timerActive && (
            <button
              onClick={() => setTimerActive(false)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '2px solid #FFB700',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Pause
            </button>
          )}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '3px solid #66BB6A', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#006600', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cycle Day</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#006600' }}>{cycleDay}</div>
          </div>
          <button
            onClick={incrementCycleDay}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid #66BB6A',
              background: '#E5FFE5',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#006600'
            }}
          >
            Next Day
          </button>
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid #66BB6A',
              background: '#E5FFE5',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#006600'
            }}
          >
            {showAdmin ? 'Hide' : 'Show'} Admin
          </button>
        </div>
      </div>

      {showAdmin && !isLoggedIn && (
        <div style={{ marginBottom: '2rem', background: 'white', borderRadius: '12px', padding: '1rem', border: '3px solid #9966FF' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '1rem', color: '#663399' }}>Admin Password</div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="password"
              value={passwordAttempt}
              onChange={(e) => setPasswordAttempt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter password"
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '2px solid #9966FF',
                background: 'white',
                flex: 1,
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '2px solid #9966FF',
                background: '#E5CCFF',
                color: '#663399',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {showAdmin && isLoggedIn && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '3px solid #9966FF' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem', color: '#663399' }}>Admin Panel</div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '0.5rem', fontWeight: 'bold', color: '#663399' }}>Music URL (Page 0)</label>
            <input
              type="text"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '2px solid #9966FF',
                background: 'white',
                fontSize: '13px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '0.5rem', fontWeight: 'bold', color: '#663399' }}>Announcements Link (Page 5)</label>
            <input
              type="text"
              value={morningAnnounceLink}
              onChange={(e) => setMorningAnnounceLink(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '2px solid #9966FF',
                background: 'white',
                fontSize: '13px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '0.5rem', fontWeight: 'bold', color: '#663399' }}>Seating Chart Canva (Page 1)</label>
            <input
              type="text"
              value={seatingChartUrl}
              onChange={(e) => setSeatingChartUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '2px solid #9966FF',
                background: 'white',
                fontSize: '13px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button
            onClick={saveData}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid #9966FF',
              background: '#E5CCFF',
              color: '#663399',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              width: '100%',
              marginBottom: '0.75rem'
            }}
          >
            Save All Changes
          </button>
          
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setShowAdmin(false);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid #9966FF',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

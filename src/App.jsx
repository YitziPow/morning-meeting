import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInput, setTimerInput] = useState('');
  
  // Content state
  const [cycleDay, setCycleDay] = useState(1);
  const [dailyContent, setDailyContent] = useState({
    wouldYouRather: 'Would you rather have socks that never need washing or shoes that always fit perfectly?',
    trueFalse: 'True or False: Octopuses have three hearts.',
    funFact: 'The smell of freshly cut grass is actually a chemical defense mechanism of the plant!',
    daysOfSchool: 0
  });
  
  const [seatingChartUrl, setSeatingChartUrl] = useState('https://www.canva.com/design/DAG2oB1ugvY/ddVUcEVIgrmAJkcInHIjRw/edit?utm_content=DAG2oB1ugvY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton');
  const [deskAssignmentsUrl, setDeskAssignmentsUrl] = useState('https://www.canva.com/design/DAG9efoLlyQ/QC6DODkvaUuOzXF9IUp45A/edit?utm_content=DAG9efoLlyQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton');
  const [morningAnnounceLink, setMorningAnnounceLink] = useState('https://drive.google.com/drive/folders/1J7-Oi8Xo9k7YqerOxjwKzx8c9ib0GD9s');
  
  // Specials rotation
  const specials = ['Library', 'STEM', 'Art', 'Music', 'PE', 'Library'];
  
  // Timer effect
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
  
  // Load persisted data on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem('morning_meeting_data');
        if (stored) {
          const data = JSON.parse(stored);
          setCycleDay(data.cycleDay || 1);
          setSeatingChartUrl(data.seatingChartUrl);
          setDeskAssignmentsUrl(data.deskAssignmentsUrl);
          setMorningAnnounceLink(data.morningAnnounceLink);
        }
      } catch (e) {
        console.log('First load or storage error');
      }
      
      // Fetch daily content
      fetchDailyContent();
    };
    loadData();
  }, []);
  
  const fetchDailyContent = async () => {
    try {
      // Fetch would you rather
      const wyResponse = await fetch('https://api.api-ninjas.com/v1/riddles?limit=1');
      const wyData = wyResponse.ok ? await wyResponse.json() : null;
      
      // Fetch fun fact
      const ffResponse = await fetch('https://uselessfacts.jsoup.com/random.json?language=en');
      const ffData = ffResponse.ok ? await ffResponse.json() : null;
      
      setDailyContent(prev => ({
        ...prev,
        wouldYouRather: wyData?.riddles?.[0]?.question || 'Would you rather have socks that never need washing or shoes that always fit perfectly?',
        trueFalse: 'True or False: Octopuses have three hearts.',
        funFact: ffData?.text || 'The smell of freshly cut grass is actually a chemical defense mechanism of the plant!',
        daysOfSchool: calculateDaysOfSchool()
      }));
    } catch (e) {
      console.log('Content fetch error, using defaults');
    }
  };
  
  const calculateDaysOfSchool = () => {
    const schoolStart = new Date(2026, 7, 26); // Aug 26, 2026
    const today = new Date();
    const diff = today - schoolStart;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    
    // Count only school days (Mon-Fri)
    let schoolDays = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(schoolStart);
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 6) schoolDays++;
    }
    return schoolDays;
  };
  
  const saveData = async () => {
    const data = {
      cycleDay,
      seatingChartUrl,
      deskAssignmentsUrl,
      morningAnnounceLink
    };
    try {
      localStorage.setItem('morning_meeting_data', JSON.stringify(data));
      alert('Changes saved!');
    } catch (e) {
      alert('Could not save changes');
    }
  };
  
  const incrementCycleDay = () => {
    const next = cycleDay === 6 ? 1 : cycleDay + 1;
    setCycleDay(next);
  };
  
  const setTimer = () => {
    const mins = parseInt(timerInput, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimerSeconds(mins * 60);
      setTimerActive(true);
      setTimerInput('');
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  
  const slides = [
    {
      title: 'Good Morning Song',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ fontSize: '28px', fontWeight: 500 }}>🎵 Good Morning! 🎵</div>
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/ixss8wKXHGw"
            title="Good Morning Song"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '12px' }}
          />
          <div style={{ fontSize: '16px', color: '#666' }}>Seating Chart</div>
          <a href={seatingChartUrl} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '14px' }}>
            Open Seating Chart ↗
          </a>
        </div>
      )
    },
    {
      title: 'Date & Cycle Day',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', fontSize: '20px' }}>
          <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div style={{ fontSize: '32px', fontWeight: 500, color: '#0066cc' }}>Cycle Day {cycleDay}</div>
          <div style={{ fontSize: '24px' }}>Special: {specials[cycleDay - 1]}</div>
        </div>
      )
    },
    {
      title: 'Fun Facts & Questions',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '16px' }}>
          <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>FUN FACT</div>
            <div>{dailyContent.funFact}</div>
          </div>
          <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>WOULD YOU RATHER</div>
            <div>{dailyContent.wouldYouRather}</div>
          </div>
          <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.5rem' }}>TRUE OR FALSE</div>
            <div>{dailyContent.trueFalse}</div>
          </div>
          <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 500, color: '#0066cc' }}>{dailyContent.daysOfSchool}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>days of school so far!</div>
          </div>
        </div>
      )
    },
    {
      title: 'To Be Added Later',
      content: (
        <div style={{ textAlign: 'center', fontSize: '20px', color: '#666' }}>
          Heggerty Music Program<br /><br />Coming Soon
        </div>
      )
    },
    {
      title: 'Morning Announcements',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '20px', fontWeight: 500 }}>📢 Morning Announcements</div>
          <a href={morningAnnounceLink} target="_blank" rel="noreferrer" style={{ color: '#0066cc', fontSize: '16px', textDecoration: 'none' }}>
            Watch Announcements ↗
          </a>
          <div style={{ fontSize: '16px', marginTop: '2rem' }}>Class Pledge Time</div>
        </div>
      )
    },
    {
      title: 'Desk Assignments & Pledge',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ fontSize: '18px', fontWeight: 500 }}>Desk Assignments</div>
          <a href={deskAssignmentsUrl} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>
            View Desk Chart ↗
          </a>
          <div style={{ fontSize: '16px', marginTop: '2rem' }}>🇺🇸 Class Pledge</div>
        </div>
      )
    }
  ];
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', background: '#fafafa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Timer in corner */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', background: 'white', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '14px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {timerActive ? (
          <div style={{ fontSize: '18px', fontWeight: 500, color: '#d9534f' }}>
            ⏱ {formatTime(timerSeconds)}
          </div>
        ) : (
          <div style={{ color: '#666' }}>Timer</div>
        )}
      </div>
      
      {/* Main slide display */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', minHeight: '400px', marginBottom: '2rem', border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '1.5rem', color: '#000' }}>
          {slides[currentSlide].title}
        </h1>
        {slides[currentSlide].content}
      </div>
      
      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          ← Previous
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: i === currentSlide ? '2px solid #0066cc' : '1px solid #ddd',
                background: i === currentSlide ? '#e6f0ff' : 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500,
                color: i === currentSlide ? '#0066cc' : '#000'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Next →
        </button>
      </div>
      
      {/* Timer controls */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '1px solid #ddd' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '0.75rem' }}>Set Timer (minutes)</div>
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
              border: '1px solid #ddd',
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
              border: '1px solid #0066cc',
              background: '#0066cc',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
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
                border: '1px solid #ddd',
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
      
      {/* Cycle Day + Admin toggle */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #ddd', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Current Cycle Day</div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#0066cc' }}>{cycleDay}</div>
          </div>
          <button
            onClick={incrementCycleDay}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Advance to Day {cycleDay === 6 ? 1 : cycleDay + 1}
          </button>
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showAdmin ? 'Hide' : 'Show'} Admin
          </button>
        </div>
      </div>
      
      {/* Admin Panel */}
      {showAdmin && !isLoggedIn && (
        <div style={{ marginBottom: '2rem', background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #ddd' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '1rem' }}>Admin Password</div>
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
                border: '1px solid #ddd',
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
                border: '1px solid #0066cc',
                background: '#0066cc',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
      
      {showAdmin && isLoggedIn && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #ddd' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '1rem' }}>Admin Panel</div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '0.5rem', color: '#333' }}>Seating Chart URL</label>
            <input
              type="text"
              value={seatingChartUrl}
              onChange={(e) => setSeatingChartUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: 'white',
                fontSize: '13px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '0.5rem', color: '#333' }}>Desk Assignments URL</label>
            <input
              type="text"
              value={deskAssignmentsUrl}
              onChange={(e) => setDeskAssignmentsUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: 'white',
                fontSize: '13px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '0.5rem', color: '#333' }}>Morning Announcements Folder URL</label>
            <input
              type="text"
              value={morningAnnounceLink}
              onChange={(e) => setMorningAnnounceLink(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
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
              border: '1px solid #0066cc',
              background: '#0066cc',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              width: '100%',
              marginBottom: '0.75rem'
            }}
          >
            Save Changes
          </button>
          
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setShowAdmin(false);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
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

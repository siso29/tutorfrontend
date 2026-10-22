import { useState, useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { tutorService } from '../services/tutorService';
import { messageService } from '../services/messageService';
import ChatModal from '../Components/ChatModal';
import '../CssPages/TutorDashboard.css';

function TutorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();
  const { inbox, addNotification, addToast } = useNotification();

  // Tutor's current profile from tutorService
  const [tutorData, setTutorData] = useState(null);
  const [hourlyRate, setHourlyRate] = useState('320');
  const [subjects, setSubjects] = useState('Physics, Chemistry');
  const [bio, setBio] = useState(
    'I help secondary school learners understand physics and chemistry through clear explanations, examples, and exam preparation.'
  );
  const [profileMessage, setProfileMessage] = useState('');

  const [availability, setAvailability] = useState([
    { day: 'Monday', enabled: true },
    { day: 'Tuesday', enabled: true },
    { day: 'Wednesday', enabled: false },
    { day: 'Thursday', enabled: true },
    { day: 'Friday', enabled: true },
    { day: 'Saturday', enabled: true },
    { day: 'Sunday', enabled: false },
  ]);

  // Messages
  const [conversations, setConversations] = useState(() =>
    messageService.getConversations()
  );
  const [activeChatUser, setActiveChatUser] = useState(null);

  useEffect(() => {
    // Load tutor profile for Dawit Alemu (ID 5) or matching user
    tutorService.getTutorById(5).then((data) => {
      if (data) {
        setTutorData(data);
        setHourlyRate(String(data.price));
        setSubjects((data.subjects || []).join(', '));
        setBio(data.about || '');
      }
    });
  }, []);

  // Filter bookings for this tutor
  const tutorSessions = bookings.filter((b) => b.status === 'Confirmed');
  const pendingRequests = bookings.filter((b) => b.status === 'Pending');

  async function handleRequest(id, approved) {
    const status = approved ? 'Confirmed' : 'Declined';
    await updateBookingStatus(id, status);

    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      addToast(
        `Session with ${booking.learnerName} has been ${approved ? 'accepted' : 'declined'}.`,
        approved ? 'success' : 'info'
      );
    }
  }

  function toggleAvailability(day) {
    setAvailability((previous) =>
      previous.map((item) =>
        item.day === day ? { ...item, enabled: !item.enabled } : item
      )
    );
    addToast(`Availability updated for ${day}.`, 'info');
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (tutorData) {
      const subjectArray = subjects.split(',').map((s) => s.trim());
      const updated = await tutorService.updateTutor(tutorData.id, {
        price: Number(hourlyRate),
        subjects: subjectArray,
        about: bio,
        description: bio.slice(0, 120) + '...',
      });
      setTutorData(updated);
    }
    setProfileMessage('Your profile changes have been published across TutorConnect!');
    addNotification('Tutor profile updated successfully.', 'success');
  }

  return (
    <main className="tutor-dashboard">
      <aside className="tutor-sidebar">
        <h2>TutorConnect</h2>
        <p className="tutor-sidebar-label">TUTOR WORKSPACE</p>

        <button
          className={activeTab === 'overview' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>

        <button
          className={activeTab === 'sessions' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('sessions')}
        >
          My Sessions ({tutorSessions.length})
        </button>

        <button
          className={activeTab === 'requests' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('requests')}
        >
          Booking Requests
          {pendingRequests.length > 0 && (
            <span className="tutor-nav-count">{pendingRequests.length}</span>
          )}
        </button>

        <button
          className={activeTab === 'availability' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('availability')}
        >
          Availability
        </button>

        <button
          className={activeTab === 'profile' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('profile')}
        >
          Teaching Profile
        </button>

        <button
          className={activeTab === 'messages' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('messages')}
        >
          Student Messages
        </button>

        <button
          className={activeTab === 'notifications' ? 'tutor-nav active' : 'tutor-nav'}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </aside>

      <section className="tutor-main">
        <header className="tutor-header">
          <div>
            <p className="tutor-eyebrow">TUTOR WORKSPACE</p>
            <h1>
              {activeTab === 'overview'
                ? 'Tutor Dashboard'
                : activeTab === 'sessions'
                  ? 'My Scheduled Sessions'
                  : activeTab === 'requests'
                    ? 'Pending Booking Requests'
                    : activeTab === 'availability'
                      ? 'Manage Availability'
                      : activeTab === 'profile'
                        ? 'My Teaching Profile'
                        : activeTab === 'messages'
                          ? 'Messages with Learners'
                          : 'Notifications'}
            </h1>
            <p>Welcome, {tutorData?.name || user?.name || 'Dawit Alemu'}. Manage your teaching activities in one place.</p>
          </div>
          <div className="tutor-avatar">{tutorData?.initials || user?.avatar || 'DA'}</div>
        </header>

        {activeTab === 'overview' && (
          <>
            <section className="tutor-welcome">
              <div>
                <p>WELCOME BACK, TUTOR</p>
                <h2>Inspire learning in every session.</h2>
                <span>Respond to learner bookings and keep your calendar up to date.</span>
              </div>
              <span className="tutor-welcome-icon">🎓</span>
            </section>

            <section className="tutor-stats">
              <article className="tutor-stat">
                <span>Total Sessions</span>
                <h2>{tutorSessions.length}</h2>
                <p>Scheduled & confirmed</p>
              </article>

              <article className="tutor-stat">
                <span>New Requests</span>
                <h2>{pendingRequests.length}</h2>
                <p>Awaiting your response</p>
              </article>

              <article className="tutor-stat">
                <span>Available Days</span>
                <h2>{availability.filter((day) => day.enabled).length}</h2>
                <p>Open teaching days/wk</p>
              </article>

              <article className="tutor-stat">
                <span>Hourly Rate</span>
                <h2>{hourlyRate} ETB</h2>
                <p>Current session rate</p>
              </article>
            </section>

            <section className="tutor-panel">
              <div className="tutor-panel-heading">
                <div>
                  <h2>Incoming Booking Requests</h2>
                  <p>Accept or decline requests from students and parents.</p>
                </div>
                <button onClick={() => setActiveTab('requests')}>
                  View all ({pendingRequests.length})
                </button>
              </div>

              {pendingRequests.length === 0 ? (
                <p className="tutor-empty">No pending booking requests right now.</p>
              ) : (
                pendingRequests.map((request) => (
                  <article className="tutor-request" key={request.id}>
                    <div>
                      <h3>{request.subject} · {request.learnerName}</h3>
                      <p>
                        Scheduled: {request.date} at {request.time} ({request.duration} hrs · {request.mode})
                      </p>
                      {request.message && (
                        <p style={{ fontStyle: 'italic', color: '#64748b', marginTop: '4px' }}>
                          Note: "{request.message}"
                        </p>
                      )}
                    </div>
                    <div className="tutor-request-actions">
                      <button
                        className="tutor-accept"
                        onClick={() => handleRequest(request.id, true)}
                      >
                        Accept Booking
                      </button>
                      <button
                        className="tutor-decline"
                        onClick={() => handleRequest(request.id, false)}
                      >
                        Decline
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>

            <section className="tutor-panel">
              <div className="tutor-panel-heading">
                <div>
                  <h2>Confirmed Sessions</h2>
                  <p>Your upcoming lessons with students.</p>
                </div>
                <button onClick={() => setActiveTab('sessions')}>
                  View all ({tutorSessions.length})
                </button>
              </div>

              {tutorSessions.length === 0 ? (
                <p className="tutor-empty">No sessions scheduled yet.</p>
              ) : (
                tutorSessions.map((session) => (
                  <article className="tutor-session" key={session.id}>
                    <div className="tutor-session-icon">📘</div>
                    <div className="tutor-session-info">
                      <h3>{session.subject} ({session.mode})</h3>
                      <p>Learner: {session.learnerName} · Guardian: {session.guardianName}</p>
                      <span>
                        {session.date} · {session.time} · {session.total} ETB
                      </span>
                    </div>
                    <span className="tutor-status confirmed">Confirmed</span>
                  </article>
                ))
              )}
            </section>
          </>
        )}

        {activeTab === 'sessions' && (
          <section className="tutor-panel">
            <h2>My Scheduled Lessons</h2>
            <p>All active confirmed sessions with learners.</p>

            {tutorSessions.length === 0 ? (
              <p className="tutor-empty">No sessions scheduled yet.</p>
            ) : (
              tutorSessions.map((session) => (
                <article className="tutor-session" key={session.id}>
                  <div className="tutor-session-icon">📘</div>
                  <div className="tutor-session-info">
                    <h3>{session.subject} ({session.mode})</h3>
                    <p>Student: {session.learnerName} · Grade: {session.grade}</p>
                    <span>
                      {session.date} · {session.time} · Total: {session.total} ETB
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="tutor-status confirmed">Confirmed</span>
                    <button
                      className="primary-btn"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => addToast(`Starting lesson classroom for ${session.learnerName}...`, 'info')}
                    >
                      Enter Classroom
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === 'requests' && (
          <section className="tutor-panel">
            <h2>Booking Requests</h2>
            <p>Review and confirm requests from learners.</p>

            {pendingRequests.length === 0 ? (
              <p className="tutor-empty">No pending requests at this time.</p>
            ) : (
              pendingRequests.map((request) => (
                <article className="tutor-request" key={request.id}>
                  <div>
                    <h3>{request.subject} · {request.learnerName}</h3>
                    <p>
                      {request.date} at {request.time} · {request.duration} hour(s) · {request.mode}
                    </p>
                    <p>Total: {request.total} ETB</p>
                  </div>
                  <div className="tutor-request-actions">
                    <button
                      className="tutor-accept"
                      onClick={() => handleRequest(request.id, true)}
                    >
                      Accept Booking
                    </button>
                    <button
                      className="tutor-decline"
                      onClick={() => handleRequest(request.id, false)}
                    >
                      Decline
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === 'availability' && (
          <section className="tutor-panel">
            <h2>Weekly Availability</h2>
            <p>Configure the days learners can select to book sessions with you.</p>

            <div className="tutor-availability-list">
              {availability.map((item) => (
                <label className="tutor-availability-day" key={item.day}>
                  <span>{item.day}</span>
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => toggleAvailability(item.day)}
                  />
                  <span>{item.enabled ? 'Available' : 'Unavailable'}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="tutor-panel">
            <h2>My Teaching Profile</h2>
            <p>Updates made here are reflected on your public profile and search listings.</p>

            <form className="tutor-profile-form" onSubmit={saveProfile}>
              <label>
                Tutor name
                <input
                  type="text"
                  value={tutorData?.name || 'Dawit Alemu'}
                  disabled
                  style={{ background: '#f8fafc', color: '#64748b' }}
                />
              </label>

              <label>
                Subjects you teach (comma separated)
                <input
                  type="text"
                  value={subjects}
                  onChange={(event) => setSubjects(event.target.value)}
                  required
                />
              </label>

              <label>
                Hourly rate in ETB
                <input
                  type="number"
                  min="50"
                  step="10"
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(event.target.value)}
                  required
                />
              </label>

              <label>
                Teaching bio & methodology
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  rows="5"
                  required
                />
              </label>

              <button type="submit" className="tutor-save-button">
                Save & Publish Profile Changes
              </button>

              {profileMessage && (
                <p className="tutor-success-message">{profileMessage}</p>
              )}
            </form>
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="tutor-panel">
            <h2>Student & Parent Inquiries</h2>
            <p>Direct communication regarding lesson preparation.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {conversations.map((conv) => (
                <article
                  key={conv.id}
                  className="tutor-session"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveChatUser({ id: conv.userId, name: conv.userName })}
                >
                  <div className="tutor-session-icon">💬</div>
                  <div className="tutor-session-info">
                    <h3>{conv.userName}</h3>
                    <p>Last message: "{conv.lastMessage}"</p>
                    <span>{conv.lastMessageTime}</span>
                  </div>
                  <button className="primary-btn" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                    Reply
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="tutor-panel">
            <h2>Notifications</h2>
            <p>Recent platform alerts and student activities.</p>

            {inbox.map((notification) => (
              <article className="tutor-notification" key={notification.id}>
                <span>🔔</span>
                <p>{notification.text}</p>
              </article>
            ))}
          </section>
        )}
      </section>

      {/* Reply Chat Modal */}
      {activeChatUser && (
        <ChatModal
          tutor={{ id: 5, name: 'Dawit Alemu' }}
          onClose={() => {
            setActiveChatUser(null);
            setConversations(messageService.getConversations());
          }}
        />
      )}
    </main>
  );
}

export default TutorDashboard;

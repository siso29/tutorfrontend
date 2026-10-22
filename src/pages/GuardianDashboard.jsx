import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useSavedTutors } from '../context/SavedTutorsContext';
import { useNotification } from '../context/NotificationContext';
import { tutorService } from '../services/tutorService';
import { messageService } from '../services/messageService';
import ChatModal from '../Components/ChatModal';
import '../CssPages/GuardianDashboard.css';

function GuardianDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();
  const { savedIds, toggleSaved } = useSavedTutors();
  const { inbox, addNotification } = useNotification();
  const navigate = useNavigate();

  // Child learner profiles
  const [learners, setLearners] = useState([
    {
      id: 1,
      name: 'Abel Jr. Bekele',
      grade: 'Grade 8',
      subjects: 'Mathematics, Physics',
    },
    {
      id: 2,
      name: 'Sara Bekele',
      grade: 'Grade 6',
      subjects: 'English, Biology',
    },
  ]);

  const sessions = [
    {
      id: 1,
      learner: 'Abel Bekele',
      tutor: 'Dawit Alemu',
      subject: 'Mathematics',
      date: 'Oct 12, 2026',
      time: '10:00 AM',
      status: 'Confirmed',
    },
    {
      id: 2,
      learner: 'Sara Bekele',
      tutor: 'Mekdes Tesfaye',
      subject: 'English',
      date: 'Oct 13, 2026',
      time: '2:00 PM',
      status: 'Pending',
    },
  ];

  const [requests, setRequests] = useState([
    {
      id: 1,
      learner: 'Abel Bekele',
      tutor: 'Dawit Alemu',
      subject: 'Mathematics',
    },
    {
      id: 2,
      learner: 'Sara Bekele',
      tutor: 'Mekdes Tesfaye',
      subject: 'English',
    },
  ]);

  const [notifications, setNotifications] = useState([
    'Your Mathematics session has been confirmed.',
    'A new English tutoring request is awaiting approval.',
    "Remember to review your learner's weekly progress.",
  ]);

  function handleRequest(id, approved) {
    const request = requests.find((item) => item.id === id);

    if (approved && request) {
      setNotifications((previous) => [
        `${request.subject} booking for ${request.learner} approved.`,
        ...previous,
      ]);
    } else if (request) {
      setNotifications((previous) => [
        `${request.subject} booking for ${request.learner} declined.`,
        ...previous,
      ]);
    }

    setRequests((previous) => previous.filter((item) => item.id !== id));
  }

  return (
    <main className="guardian-dashboard">
      <aside className="guardian-sidebar">
        <h2>TutorConnect</h2>
        <p className="guardian-sidebar-label">PARENT & LEARNER PORTAL</p>

        <button
          className={activeTab === 'overview' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>

        <button
          className={activeTab === 'learners' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('learners')}
        >
          Learner Profiles ({learners.length})
        </button>

        <button
          className={activeTab === 'sessions' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('sessions')}
        >
          Upcoming Sessions ({confirmedSessions.length})
        </button>

        <button className="guardian-nav" onClick={() => navigate('/payment-history')}>Payment History</button>

        <button
          className={activeTab === 'requests' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('requests')}
        >
          Pending Bookings ({pendingRequests.length})
        </button>

        <button
          className={activeTab === 'saved' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('saved')}
        >
          Saved Tutors ({favoritedTutors.length})
        </button>

        <button
          className={activeTab === 'messages' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>

        <button
          className={activeTab === 'notifications' ? 'guardian-nav active' : 'guardian-nav'}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </aside>

      <section className="guardian-main">
        <header className="guardian-header">
          <div>
            <p className="guardian-eyebrow">PARENT / GUARDIAN PORTAL</p>
            <h1>Guardian Dashboard</h1>
            <p>Welcome, {user?.name || 'Abel Bekele'}. Manage your children's learning in one place.</p>
          </div>
          <div className="guardian-avatar">{user?.avatar || 'GB'}</div>
        </header>

        {activeTab === 'overview' && (
          <>
            <section className="guardian-welcome">
              <div>
                <p>WELCOME BACK</p>
                <h2>Your family learning hub</h2>
                <span>Track live sessions, manage requests, and chat with tutors.</span>
              </div>
              <div className="guardian-welcome-icon">🎓</div>
            </section>

            <section className="guardian-stats">
              <article className="guardian-stat">
                <span>Learners</span>
                <h2>{learners.length}</h2>
                <p>Registered children</p>
              </article>

              <article className="guardian-stat">
                <span>Confirmed Sessions</span>
                <h2>{confirmedSessions.length}</h2>
                <p>Ready to attend</p>
              </article>

              <article className="guardian-stat">
                <span>Pending Bookings</span>
                <h2>{pendingRequests.length}</h2>
                <p>Awaiting confirmation</p>
              </article>

              <article className="guardian-stat">
                <span>Saved Tutors</span>
                <h2>{favoritedTutors.length}</h2>
                <p>Bookmarked profiles</p>
              </article>
            </section>

            <section className="guardian-panel">
              <div className="guardian-panel-heading">
                <div>
                  <h2>Upcoming Lessons</h2>
                  <p>Your confirmed tutoring sessions.</p>
                </div>
                <button onClick={() => setActiveTab('sessions')}>
                  View all
                </button>
              </div>

              {confirmedSessions.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  <p>No confirmed sessions yet.</p>
                  <button
                    className="primary-btn"
                    style={{ marginTop: '10px' }}
                    onClick={() => navigate('/find-tutors')}
                  >
                    Find a Tutor to Book
                  </button>
                </div>
              ) : (
                confirmedSessions.slice(0, 3).map((session) => (
                  <article className="guardian-session" key={session.id}>
                    <div className="guardian-session-date">
                      <span>{session.date?.split(' ')[0] || 'Session'}</span>
                      <strong>{session.date?.split(' ')[1] || 'Upcoming'}</strong>
                    </div>

                    <div className="guardian-session-info">
                      <h3>{session.subject} ({session.mode})</h3>
                      <p>
                        Learner: {session.learnerName} · Tutor: {session.tutorName}
                      </p>
                      <span>Time: {session.time} · Price: {session.total} ETB</span>
                    </div>

                    <span className="guardian-status confirmed">Confirmed</span>
                  </article>
                ))
              )}
            </section>

            <section className="guardian-panel">
              <div className="guardian-panel-heading">
                <div>
                  <h2>Pending Bookings</h2>
                  <p>Lesson requests currently awaiting tutor confirmation.</p>
                </div>
                <button onClick={() => setActiveTab('requests')}>
                  Review
                </button>
              </div>

              {pendingRequests.length === 0 ? (
                <p className="guardian-empty">No pending requests at this time.</p>
              ) : (
                pendingRequests.map((req) => (
                  <article className="guardian-request" key={req.id}>
                    <div>
                      <h3>{req.subject} · {req.tutorName}</h3>
                      <p>
                        {request.learner} · {request.tutor}
                      </p>
                    </div>
                    <div className="guardian-request-actions">
                      <button
                        className="guardian-approve"
                        onClick={() => handleRequest(request.id, true)}
                      >
                        Approve
                      </button>
                      <button
                        className="guardian-decline"
                        onClick={() => handleRequest(request.id, false)}
                      >
                        Decline
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        )}

        {activeTab === 'learners' && (
          <section className="guardian-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Learner Profiles</h2>
                <p>Manage learning goals and information for your children.</p>
              </div>
              <button
                className="primary-btn"
                onClick={() => setShowAddLearner(!showAddLearner)}
              >
                {showAddLearner ? 'Cancel' : '+ Add Learner'}
              </button>
            </div>

            {showAddLearner && (
              <form
                onSubmit={handleAddLearner}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  margin: '20px 0',
                }}
              >
                <h3>Add a Child Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '12px' }}>
                  <label>
                    Child's Full Name
                    <input
                      type="text"
                      placeholder="e.g. Samuel Bekele"
                      value={newLearnerName}
                      onChange={(e) => setNewLearnerName(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    School Grade
                    <select
                      value={newLearnerGrade}
                      onChange={(e) => setNewLearnerGrade(e.target.value)}
                    >
                      {Array.from({ length: 13 }, (_, i) => (
                        <option key={i} value={`Grade ${i}`}>Grade {i}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label style={{ marginTop: '12px', display: 'block' }}>
                  Target Subjects
                  <input
                    type="text"
                    placeholder="e.g. Mathematics, Physics, English"
                    value={newLearnerSubjects}
                    onChange={(e) => setNewLearnerSubjects(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="primary-btn" style={{ marginTop: '14px' }}>
                  Save Profile
                </button>
              </form>
            )}

            <div className="guardian-learner-grid" style={{ marginTop: '20px' }}>
              {learners.map((learner) => (
                <article className="guardian-learner-card" key={learner.id}>
                  <div className="guardian-learner-avatar">
                    {learner.name.charAt(0)}
                  </div>
                  <h3>{learner.name}</h3>
                  <p>{learner.grade}</p>
                  <span>Focus: {learner.subjects}</span>
                  <button
                    className="secondary-btn"
                    style={{ marginTop: '12px', width: '100%', fontSize: '0.82rem' }}
                    onClick={() => navigate(`/find-tutors?grade=${learner.grade.replace('Grade ', '')}`)}
                  >
                    🔍 Find Tutors for {learner.name.split(' ')[0]}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'sessions' && (
          <section className="guardian-panel">
            <h2>Upcoming Sessions</h2>
            <p>Review scheduled lessons with verified tutors.</p>

            {confirmedSessions.length === 0 ? (
              <p className="guardian-empty">No confirmed sessions scheduled yet.</p>
            ) : (
              confirmedSessions.map((session) => (
                <article className="guardian-session" key={session.id}>
                  <div className="guardian-session-info">
                    <h3>{session.subject} ({session.mode})</h3>
                    <p>
                      {session.learnerName} · Tutor: {session.tutorName}
                    </p>
                    <span>
                      {session.date} · {session.time} · {session.duration} hr(s)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="guardian-status confirmed">Confirmed</span>
                    <button
                      className="secondary-btn"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={() => setActiveChatTutor({ id: session.tutorId, name: session.tutorName })}
                    >
                      💬 Chat
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab === 'requests' && (
          <section className="guardian-panel">
            <h2>Pending Bookings</h2>
            <p>Review booking requests sent to tutors.</p>

            {pendingRequests.length === 0 ? (
              <p className="guardian-empty">No pending bookings.</p>
            ) : (
              pendingRequests.map((request) => (
                <article className="guardian-request" key={request.id}>
                  <div>
                    <h3>{request.subject} · {request.tutorName}</h3>
                    <p>
                      {request.learner} · {request.tutor}
                    </p>
                  </div>
                  <div className="guardian-request-actions">
                    <button
                      className="guardian-approve"
                      onClick={() => handleRequest(request.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="guardian-decline"
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

        {activeTab === 'saved' && (
          <section className="guardian-panel">
            <h2>Saved Tutors</h2>
            <p>Tutors you have favorited for future lessons.</p>

            {favoritedTutors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                <p>You have not saved any tutors yet.</p>
                <button
                  className="primary-btn"
                  onClick={() => navigate('/find-tutors')}
                >
                  Explore Tutors
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                {favoritedTutors.map((tutor) => (
                  <article
                    key={tutor.id}
                    className="guardian-session"
                    style={{ alignItems: 'center' }}
                  >
                    <div className="guardian-learner-avatar">{tutor.initials}</div>
                    <div className="guardian-session-info">
                      <h3>{tutor.name}</h3>
                      <p>{tutor.subjects?.join(', ')} · {tutor.price} ETB/hr</p>
                      <span>★ {tutor.rating} ({tutor.reviewsCount || 0} reviews)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="primary-btn"
                        style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                        onClick={() => navigate(`/tutors/${tutor.id}`)}
                      >
                        Book Lesson
                      </button>
                      <button
                        className="secondary-btn"
                        style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                        onClick={() => setActiveChatTutor(tutor)}
                      >
                        💬 Chat
                      </button>
                      <button
                        className="secondary-btn"
                        style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                        onClick={() => toggleSaved(tutor.id, tutor.name)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="guardian-panel">
            <h2>Messages with Tutors</h2>
            <p>Direct communication regarding lesson preparation and schedules.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {conversations.map((conv) => (
                <article
                  key={conv.id}
                  className="guardian-session"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveChatTutor({ id: conv.tutorId, name: conv.tutorName })}
                >
                  <div className="guardian-learner-avatar">
                    {conv.tutorName.charAt(0)}
                  </div>
                  <div className="guardian-session-info">
                    <h3>{conv.tutorName}</h3>
                    <p>Last message: "{conv.lastMessage}"</p>
                    <span>{conv.lastMessageTime}</span>
                  </div>
                  <button className="primary-btn" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                    Open Chat
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="guardian-panel">
            <h2>Notifications</h2>
            <p>Real-time updates about lesson bookings and tutor messages.</p>

            {inbox.map((notification) => (
              <article className="guardian-notification" key={notification.id}>
                <span>🔔</span>
                <div>
                  <p>{notification.text}</p>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {notification.time}
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>

      {/* Direct chat modal */}
      {activeChatTutor && (
        <ChatModal
          tutor={activeChatTutor}
          onClose={() => {
            setActiveChatTutor(null);
            setConversations(messageService.getConversations());
          }}
        />
      )}
    </main>
  );
}

export default GuardianDashboard;

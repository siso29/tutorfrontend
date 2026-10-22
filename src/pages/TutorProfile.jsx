import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tutorService } from '../services/tutorService';
import { supportService } from '../services/supportService';
import { useSavedTutors } from '../context/SavedTutorsContext';
import { useNotification } from '../context/NotificationContext';
import ChatModal from '../Components/ChatModal';
import ReviewModal from '../Components/ReviewModal';
import '../CssPages/TutorProfile.css';

const availableDays = [
  { day: 'Sat', date: '10' },
  { day: 'Sun', date: '11' },
  { day: 'Mon', date: '12' },
  { day: 'Tue', date: '13' },
  { day: 'Wed', date: '14' },
];

const availableTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSaved, isSaved } = useSavedTutors();
  const { addToast } = useNotification();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState('Sat');
  const [selectedTime, setSelectedTime] = useState('');
  const [mode, setMode] = useState('');
  const [duration, setDuration] = useState('1');
  const [learnerGrade, setLearnerGrade] = useState('8');
  const [learnerMessage, setLearnerMessage] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  const [showChatModal, setShowChatModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const loadTutor = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tutorService.getTutorById(id);
      setTutor(data);
      if (data && data.modes?.length) {
        setMode(data.modes[0]);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTutor();
  }, [loadTutor]);

  if (loading || !tutor) {
    return (
      <div className="app">
        <main className="profile-page">
          <p>Loading tutor profile...</p>
        </main>
      </div>
    );
  }

  const saved = isSaved(tutor.id);
  const total = tutor.price * Number(duration);

  function handleBooking(event) {
    event.preventDefault();

    if (!selectedTime) {
      setBookingMessage('Please select an available lesson time.');
      return;
    }

    const booking = {
      id: Date.now(),
      tutorId: id,
      tutorName: tutor.name,
      subject: tutor.subjects?.[0] || 'Tutoring',
      learner: `Grade ${learnerGrade} learner`,
      learnerGrade,
      selectedDay,
      selectedTime,
      mode,
      duration,
      total,
      learnerMessage,
      status: 'Pending',
    };

    const existingBookings = JSON.parse(
      sessionStorage.getItem('tutorConnectBookings') || '[]',
    );

    sessionStorage.setItem(
      'tutorConnectBookings',
      JSON.stringify([...existingBookings, booking]),
    );

    navigate('/booking-confirmation', {
      state: {
        tutorId: tutor.id,
        tutorName: tutor.name,
        selectedDay,
        selectedDate: availableDays.find((d) => d.day === selectedDay)?.date || '10',
        selectedTime,
        learnerGrade,
        mode,
        duration,
        hourlyPrice: tutor.price,
        total,
        learnerMessage,
      },
    });
  }

  function handleReportReview(review) {
    const reason = window.prompt(
      `Please state the reason for reporting this review by "${review.author}":`,
      'Misleading or inaccurate review'
    );
    if (reason && reason.trim()) {
      supportService.submitReport({
        title: `Reported Review for ${tutor.name}`,
        submittedBy: 'Parent / User',
        tutorName: tutor.name,
        details: `Review comment: "${review.comment}". Reason reported: ${reason}`,
      });
      addToast('Review reported. Our administrator team will investigate.', 'info');
    }
  }

  return (
    <div className="app">
      <main className="profile-page">
        <Link to="/find-tutors" className="back-link">
          ← Back to results
        </Link>

        <div className="profile-layout">
          <section className="profile-main">
            <article className="profile-intro">
              <div className="profile-avatar">{tutor.initials}</div>

              <div className="profile-intro-info">
                <div className="find-tutor-name">
                  <h1>{tutor.name}</h1>
                  {tutor.verified ? (
                    <span className="verified">✓ Verified</span>
                  ) : (
                    <span className="pending-badge">Verification pending</span>
                  )}
                </div>

                <p>
                  {(tutor.subjects || []).join(', ')} · {tutor.gradeRangeLabel || `Grades ${tutor.grades?.join(', ')}`} ·{' '}
                  {(tutor.modes || []).join(' and ')}
                </p>

                <div className="find-meta">
                  <span>
                    ★ {tutor.rating} ({tutor.reviewsCount || tutor.reviews?.length || 0} reviews)
                  </span>
                  <span>{tutor.experience} years experience</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowChatModal(true)}
                  >
                    💬 Message tutor
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => toggleSaved(tutor.id, tutor.name)}
                  >
                    {saved ? '♥ Saved' : '♡ Save tutor'}
                  </button>
                </div>
              </div>
            </article>

            <section className="profile-section">
              <h2>About</h2>
              <p>{tutor.about}</p>

              <h3>Teaching method</h3>
              <p>{tutor.method}</p>
            </section>

            <section className="profile-section">
              <h2>Subjects and grades</h2>
              <div className="profile-tags">
                {(tutor.subjects || []).map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
                <span>{tutor.gradeRangeLabel || 'All Grades'}</span>
              </div>
            </section>

            <section className="profile-section">
              <h2>Qualifications</h2>
              <ul className="qualification-list">
                {(tutor.qualifications || []).map((qualification, idx) => (
                  <li key={idx}>{qualification}</li>
                ))}
              </ul>
              <p className="demo-note">
                Sample qualifications for demonstration. Real credentials must
                be reviewed by an administrator.
              </p>
            </section>

            <section className="profile-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Reviews</h2>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowReviewModal(true)}
                >
                  Write a review
                </button>
              </div>
              <p className="review-policy">
                Only learners and guardians with completed sessions can review.
              </p>

              {(!tutor.reviews || tutor.reviews.length === 0) ? (
                <p className="demo-note">No reviews yet.</p>
              ) : (
                tutor.reviews.map((review) => (
                  <article className="review-card" key={review.id}>
                    <div className="review-heading">
                      <strong>{review.author}</strong>
                      <span>★ {review.rating}</span>
                    </div>
                    <p>{review.comment}</p>
                    <button
                      type="button"
                      className="report-review"
                      onClick={() => handleReportReview(review)}
                    >
                      Report this review
                    </button>
                  </article>
                ))
              )}
            </section>
          </section>

          <aside className="booking-card">
            <div className="booking-price">
              <strong>{tutor.price} ETB</strong>
              <span>/ hour</span>
            </div>

            <h2>Book a session</h2>

            <form onSubmit={handleBooking}>
              <label htmlFor="service-mode">Service mode</label>
              <select
                id="service-mode"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                {(tutor.modes || ['Online', 'In-person']).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="learner-message">
                Message to the tutor (optional)
              </label>

              <textarea
                id="learner-message"
                value={learnerMessage}
                onChange={(event) => setLearnerMessage(event.target.value)}
                placeholder="Tell the tutor what subject or topic you need help with..."
                rows={4}
                maxLength={500}
              />

              <label>Choose a day</label>
              <div className="day-picker">
                {availableDays.map((item) => (
                  <button
                    key={item.day}
                    type="button"
                    className={
                      selectedDay === item.day
                        ? 'day-option active'
                        : 'day-option'
                    }
                    onClick={() => {
                      setSelectedDay(item.day);
                      setSelectedTime('');
                      setBookingMessage('');
                    }}
                  >
                    <span>{item.day}</span>
                    <strong>{item.date}</strong>
                  </button>
                ))}
              </div>

              <label>Available times</label>
              <div className="time-picker">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={
                      selectedTime === time
                        ? 'time-option active'
                        : 'time-option'
                    }
                    onClick={() => {
                      setSelectedTime(time);
                      setBookingMessage('');
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <label htmlFor="learner-grade">Learner's grade</label>
              <select
                id="learner-grade"
                value={learnerGrade}
                onChange={(event) => setLearnerGrade(event.target.value)}
              >
                {Array.from({ length: 13 }, (_, index) => (
                  <option key={index} value={index}>
                    Grade {index}
                  </option>
                ))}
              </select>

              <label htmlFor="session-duration">Session duration</label>
              <select
                id="session-duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>

              <div className="booking-summary">
                <span>Session</span>
                <strong>
                  {selectedDay}{' '}
                  {availableDays.find((day) => day.day === selectedDay)?.date}{' '}
                  Oct · {selectedTime || 'Choose a time'}
                </strong>

                <span>Duration</span>
                <strong>
                  {duration} {Number(duration) === 1 ? 'hour' : 'hours'}
                </strong>

                <span>Total due</span>
                <strong>{total} ETB</strong>
              </div>

              <p className="cancellation-note">
                Review the cancellation rules before confirming a real booking.
              </p>

              <button type="submit" className="primary-btn booking-submit">
                Request booking
              </button>

              {bookingMessage && (
                <div className="booking-feedback error" role="status">
                  {bookingMessage}
                </div>
              )}

              <p className="booking-footnote">
                A real booking will need tutor confirmation before payment.
              </p>
            </form>
          </aside>
        </div>
      </main>

      {/* Chat with Tutor */}
      {showChatModal && (
        <ChatModal
          tutor={tutor}
          onClose={() => setShowChatModal(false)}
        />
      )}

      {/* Review Tutor */}
      {showReviewModal && (
        <ReviewModal
          tutor={tutor}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={(updated) => setTutor(updated)}
        />
      )}
    </div>
  );
}

export default TutorProfile;

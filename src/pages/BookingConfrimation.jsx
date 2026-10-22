import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../CssPages/BookingConfirmation.css';

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;
  const { createBooking } = useBookings();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!booking && !confirmedBooking) {
    return (
      <main className="booking-confirmation">
        <div className="booking-card">
          <h1>No booking details found</h1>
          <p>Please select a tutor and complete the booking form first.</p>
          <div className="booking-actions">
            <Link to="/find-tutors" className="booking-btn">
              Find Tutors
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        learnerId: user?.id || 'u-guest',
        learnerName: user?.name ? `${user.name} (Learner)` : 'Abel Jr. Bekele',
        guardianName: user?.name || 'Abel Bekele',
        tutorId: booking.tutorId,
        tutorName: booking.tutorName,
        subject: 'Mathematics', // default or extracted from context
        date: `${booking.selectedDay} ${booking.selectedDate || '24'} Oct 2026`,
        time: booking.selectedTime,
        mode: booking.mode,
        grade: `Grade ${booking.learnerGrade}`,
        duration: booking.duration,
        price: booking.hourlyPrice || 250,
        total: booking.total,
        message: booking.learnerMessage,
        status: 'Pending',
      });

      setConfirmedBooking(newBooking);
      addToast('Booking request sent to tutor!', 'success');
    } catch {
      addToast('Failed to create booking. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <main className="booking-confirmation">
        <div className="booking-card">
          <div className="booking-icon">✓</div>

          <h1>Booking Request Sent!</h1>
          <p className="booking-subtitle">
            Your lesson request has been delivered to <strong>{confirmedBooking.tutorName}</strong>.
          </p>

          <div className="booking-status">
            REFERENCE: #{confirmedBooking.id.slice(-6).toUpperCase()} · STATUS: PENDING TUTOR CONFIRMATION
          </div>

          <div className="booking-details">
            <div>
              <span>Tutor</span>
              <strong>{confirmedBooking.tutorName}</strong>
            </div>
            <div>
              <span>Scheduled Date</span>
              <strong>{confirmedBooking.date}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{confirmedBooking.time}</strong>
            </div>
            <div>
              <span>Mode</span>
              <strong>{confirmedBooking.mode}</strong>
            </div>
            <div>
              <span>Total Price</span>
              <strong>{confirmedBooking.total} ETB</strong>
            </div>
          </div>

          <div className="booking-actions">
            <button
              type="button"
              className="booking-btn"
              onClick={() => navigate('/guardian-dashboard')}
            >
              View in My Dashboard
            </button>
            <Link to="/find-tutors" className="booking-btn secondary">
              Find Another Tutor
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-confirmation">
      <div className="booking-card">
        <div className="booking-icon">✓</div>

        <h1>Review Lesson Request</h1>
        <p className="booking-subtitle">
          Confirm your lesson details before submitting to the tutor.
        </p>

        <div className="booking-status">Status: Ready to submit</div>

        <div className="booking-details">
          <div>
            <span>Tutor</span>
            <strong>{booking.tutorName}</strong>
          </div>

          <div>
            <span>Lesson Day</span>
            <strong>
              {booking.selectedDay} {booking.selectedDate} Oct 2026
            </strong>
          </div>

          <div>
            <span>Lesson Time</span>
            <strong>{booking.selectedTime}</strong>
          </div>

          <div>
            <span>Grade</span>
            <strong>Grade {booking.learnerGrade}</strong>
          </div>

          <div>
            <span>Lesson Mode</span>
            <strong>{booking.mode}</strong>
          </div>

          <div>
            <span>Duration</span>
            <strong>{booking.duration} hour(s)</strong>
          </div>

          <div>
            <span>Total Price</span>
            <strong>{booking.total} ETB</strong>
          </div>
        </div>

        <div className="booking-message">
          <strong>Message to Tutor</strong>
          <p>{booking.learnerMessage || 'No specific notes provided.'}</p>
        </div>

        <div className="booking-actions">
          <button
            type="button"
            className="booking-btn"
            disabled={isSubmitting}
            onClick={handleConfirmBooking}
          >
            {isSubmitting ? 'Sending Request...' : 'Confirm & Send Request to Tutor ✓'}
          </button>

          <Link
            to={`/tutors/${booking.tutorId}`}
            className="booking-btn secondary"
          >
            ← Modify Lesson
          </Link>
        </div>
      </div>
    </main>
  );
}

export default BookingConfirmation;

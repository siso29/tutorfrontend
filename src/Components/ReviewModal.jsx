import { useState } from 'react';
import { tutorService } from '../services/tutorService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

function ReviewModal({ tutor, onClose, onReviewAdded }) {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState(user?.name ? `${user.name} (Learner/Guardian)` : 'Guardian of Grade 8 Learner');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please enter your review feedback.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await tutorService.addReview(tutor.id, {
        rating,
        author: author.trim(),
        comment: comment.trim(),
      });

      addToast('Review submitted successfully! Thank you for your feedback.', 'success');
      if (onReviewAdded && result?.tutor) {
        onReviewAdded(result.tutor);
      }
      onClose();
    } catch {
      addToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Leave a Review for {tutor.name}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label style={{ display: 'block', fontWeight: 600, color: '#334155' }}>
              Your Rating
            </label>
            <div className="star-rating-select">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${
                    (hoverRating || rating) >= star ? 'active' : ''
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} Stars`}
                >
                  ★
                </button>
              ))}
              <span
                style={{
                  alignSelf: 'center',
                  marginLeft: 8,
                  fontWeight: 700,
                  color: '#f59e0b',
                }}
              >
                {hoverRating || rating}.0 Stars
              </span>
            </div>

            <label
              htmlFor="review-author"
              style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: 6 }}
            >
              Your Name or Title
            </label>
            <input
              id="review-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="chat-input"
              style={{ width: '100%', marginBottom: 16 }}
              required
            />

            <label
              htmlFor="review-comment"
              style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: 6 }}
            >
              Your Experience
            </label>
            <textarea
              id="review-comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did the session go? What did you like about the teaching method?"
              className="chat-input"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;

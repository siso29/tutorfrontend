import { apiClient } from './apiClient';
import { getStorage, setStorage } from './storage';
import { INITIAL_TUTORS } from './mockData';

const TUTORS_KEY = 'tutorConnectTutorsList';
const SAVED_TUTORS_KEY = 'tutorConnectSavedTutors';

function getLocalTutors() {
  return getStorage(TUTORS_KEY, INITIAL_TUTORS);
}

function saveLocalTutors(tutors) {
  setStorage(TUTORS_KEY, tutors);
}

export const tutorService = {
  async getAllTutors() {
    try {
      const data = await apiClient.get('/tutors');
      if (Array.isArray(data)) {
        saveLocalTutors(data);
        return data;
      }
    } catch {
      // Fallback to local offline cache
    }
    return getLocalTutors();
  },

  async getTutorById(id) {
    const numericId = Number(id);
    try {
      const data = await apiClient.get(`/tutors/${id}`);
      if (data && data.id) return data;
    } catch {
      // Fallback
    }

    const tutors = getLocalTutors();
    return tutors.find((t) => t.id === numericId) || tutors[0];
  },

  async createTutor(profile) {
    const newTutor = {
      id: Date.now(),
      initials: (profile.name || 'Tutor').split(/\s+/).map((part) => part[0]).join('').toUpperCase().slice(0, 2),
      subjects: [],
      grades: [],
      gradeRangeLabel: 'All grades',
      modes: ['Online'],
      rating: 0,
      reviewsCount: 0,
      experience: 0,
      price: 250,
      verified: false,
      verificationStatus: 'Pending',
      about: '',
      description: 'Tutor profile pending completion.',
      photoUrl: '',
      city: 'Dire Dawa',
      ...profile,
    };
    try {
      const result = await apiClient.post('/tutors', newTutor);
      const savedTutor = result?.tutor || result;
      if (savedTutor?.id) {
        saveLocalTutors([savedTutor, ...getLocalTutors().filter((tutor) => String(tutor.id) !== String(savedTutor.id))]);
        return savedTutor;
      }
    } catch {
      // Keep a local profile available when the API is offline or has no create endpoint yet.
    }
    const tutors = getLocalTutors();
    saveLocalTutors([newTutor, ...tutors]);
    return newTutor;
  },

  async updateTutor(id, updates) {
    try {
      await apiClient.put(`/tutors/${id}`, updates);
    } catch {
      // Local fallback
    }

    const tutors = getLocalTutors();
    const updated = tutors.map((t) =>
      String(t.id) === String(id) ? { ...t, ...updates } : t
    );
    saveLocalTutors(updated);
    return updated.find((t) => String(t.id) === String(id));
  },

  async verifyTutor(id, status) {
    const numericId = Number(id);
    const verified = status === 'Verified';
    return this.updateTutor(numericId, {
      verified,
      verificationStatus: status,
    });
  },

  async addReview(tutorId, reviewData) {
    const numericId = Number(tutorId);
    const newReview = {
      id: Date.now(),
      author: reviewData.author || 'Parent / Learner',
      rating: Number(reviewData.rating) || 5,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      comment: reviewData.comment || '',
    };

    try {
      await apiClient.post(`/tutors/${tutorId}/reviews`, newReview);
    } catch {
      // Fallback
    }

    const tutors = getLocalTutors();
    const tutor = tutors.find((t) => t.id === numericId);
    if (!tutor) return null;

    const currentReviews = tutor.reviews || [];
    const updatedReviews = [newReview, ...currentReviews];

    // Recalculate average rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0);
    const newAverage = (totalRating / updatedReviews.length).toFixed(1);

    const updatedTutor = {
      ...tutor,
      reviews: updatedReviews,
      rating: Number(newAverage),
      reviewsCount: updatedReviews.length,
    };

    const allUpdated = tutors.map((t) => (t.id === numericId ? updatedTutor : t));
    saveLocalTutors(allUpdated);

    return { tutor: updatedTutor, review: newReview };
  },

  getSavedTutorIds() {
    return getStorage(SAVED_TUTORS_KEY, []);
  },

  toggleSavedTutor(tutorId) {
    const numericId = Number(tutorId);
    const current = this.getSavedTutorIds();
    const exists = current.includes(numericId);
    const updated = exists
      ? current.filter((id) => id !== numericId)
      : [...current, numericId];

    setStorage(SAVED_TUTORS_KEY, updated);
    return updated;
  },

  isSaved(tutorId) {
    const current = this.getSavedTutorIds();
    return current.includes(Number(tutorId));
  },
};

import { createContext, useContext, useState, useCallback } from 'react';
import { tutorService } from '../services/tutorService';
import { useNotification } from './NotificationContext';

const SavedTutorsContext = createContext(null);

export function SavedTutorsProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => tutorService.getSavedTutorIds());
  const { addToast } = useNotification();

  const toggleSaved = useCallback(
    (tutorId, tutorName = 'Tutor') => {
      const updated = tutorService.toggleSavedTutor(tutorId);
      setSavedIds(updated);

      const isNowSaved = updated.includes(Number(tutorId));
      addToast(
        isNowSaved
          ? `Added ${tutorName} to your saved tutors.`
          : `Removed ${tutorName} from saved tutors.`,
        'info'
      );
    },
    [addToast]
  );

  const isSaved = useCallback(
    (tutorId) => {
      return savedIds.includes(Number(tutorId));
    },
    [savedIds]
  );

  return (
    <SavedTutorsContext.Provider
      value={{
        savedIds,
        toggleSaved,
        isSaved,
      }}
    >
      {children}
    </SavedTutorsContext.Provider>
  );
}

export function useSavedTutors() {
  const context = useContext(SavedTutorsContext);
  if (!context) {
    throw new Error('useSavedTutors must be used within a SavedTutorsProvider');
  }
  return context;
}

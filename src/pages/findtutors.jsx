import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tutorService } from '../services/tutorService';
import { useSavedTutors } from '../context/SavedTutorsContext';
import ChatModal from '../Components/ChatModal';
import { usePreferences } from '../context/PreferencesContext';
import TutorPortrait from '../Components/TutorPortrait';
import '../CssPages/FIndTutors.css';

function FindTutors() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSaved, isSaved } = useSavedTutors();
  const { t } = usePreferences();

  const [tutorList, setTutorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatTutor, setActiveChatTutor] = useState(null);

  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('Any');
  const [grade, setGrade] = useState('');
  const [mode, setMode] = useState('Any');
  const [city, setCity] = useState('Dire Dawa');
  const [maxPrice, setMaxPrice] = useState(400);
  const [minRating, setMinRating] = useState('0');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('recommended');

  useEffect(() => {
  const loadTutors = async () => {
    setLoading(true);
    try {
      const data = await tutorService.getAllTutors();
      setTutorList(data);
    } catch (error) {
      console.error('Failed to load tutors:', error);
      setTutorList([]);
    } finally {
      setLoading(false);
    }
  };

  loadTutors();
}, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('search') || '');
    setSubject(params.get('subject') || 'Any');
    setGrade(params.get('grade') || '');
    setMode(params.get('mode') || 'Any');
    setCity(params.get('city') || 'Dire Dawa');
    setVerifiedOnly(params.get('verified') === 'true');
  }, [location.search]);

  const filteredTutors = useMemo(() => {
    const results = tutorList.filter((tutor) => {
      const searchMatch = `${tutor.name} ${(tutor.subjects || []).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const subjectMatch =
        subject === 'Any' || (tutor.subjects || []).includes(subject);

      const gradeMatch =
        grade === '' || (tutor.grades || []).includes(Number(grade));

      const modeMatch = mode === 'Any' || (tutor.modes || []).includes(mode);
      const cityMatch = city === 'Any' || (tutor.city || 'Dire Dawa') === city || (mode !== 'In-person' && (tutor.modes || []).includes('Online'));

      const priceMatch = tutor.price <= maxPrice;
      const ratingMatch = tutor.rating >= Number(minRating);
      const verifiedMatch = !verifiedOnly || tutor.verified;

      return (
        searchMatch &&
        subjectMatch &&
        gradeMatch &&
        modeMatch &&
        cityMatch &&
        priceMatch &&
        ratingMatch &&
        verifiedMatch
      );
    });

    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'experience') {
      results.sort((a, b) => b.experience - a.experience);
    }

    return results;
  }, [tutorList, search, subject, grade, mode, city, maxPrice, minRating, verifiedOnly, sort]);

  function clearFilters() {
    setSearch('');
    setSubject('Any');
    setGrade('');
    setMode('Any');
    setCity('Dire Dawa');
    setMaxPrice(400);
    setMinRating('0');
    setVerifiedOnly(false);
    setSort('recommended');
  }

  return (
    <div className="app">
      <main className="find-page">
        <div className="find-heading">
          <span className="eyebrow">{t('findLearningPartner')}</span>
          <h1>{t('findTutor')}</h1>
          <p>
            {t('compareTutors')}
          </p>
        </div>

        <div className="find-layout">
          <aside className="filter-panel">
            <div className="filter-title">
              <h2>{t('filters')}</h2>
              <button
                type="button"
                className="clear-btn"
                onClick={clearFilters}
              >
                {t('clearAll')}
              </button>
            </div>

            <label htmlFor="tutor-search">{t('searchNameSubject')}</label>
            <input
              id="tutor-search"
              type="search"
              placeholder="e.g. Hanna, Mathematics"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <label htmlFor="subject-filter">{t('subject')}</label>
            <select
              id="subject-filter"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              <option value="Any">{t('anySubject')}</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
              <option>Amharic</option>
            </select>

            <label htmlFor="grade-filter">{t('grade')}</label>
            <select
              id="grade-filter"
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
            >
              <option value="">{t('anyGrade')}</option>
              {Array.from({ length: 13 }, (_, index) => (
                <option key={index} value={index}>
                  {t('gradeOption')} {index}
                </option>
              ))}
            </select>

            <label htmlFor="mode-filter">{t('mode')}</label>
            <select
              id="mode-filter"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="Any">{t('any')}</option>
              <option value="Online">{t('online')}</option>
              <option value="In-person">{t('inPerson')}</option>
              <option value="Hybrid">{t('hybrid')}</option>
            </select>

            <label htmlFor="city-filter">{t('location')}</label>
            <select id="city-filter" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="Any">{t('anyLocation')}</option>
              <option value="Dire Dawa">{t('direDawa')}</option>
            </select>

            <div className="filter-label-row">
              <label htmlFor="price-filter">{t('maxPrice')}</label>
              <strong>{maxPrice} ETB</strong>
            </div>
            <input
              id="price-filter"
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />

            <label htmlFor="rating-filter">{t('minRating')}</label>
            <select
              id="rating-filter"
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
            >
              <option value="0">Any rating</option>
              <option value="4">4.0+ stars</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4.8">4.8+ stars</option>
            </select>

            <label className="verified-filter">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(event) => setVerifiedOnly(event.target.checked)}
              />
              {t('verifiedOnly')}
            </label>
          </aside>

          <section className="results-panel">
            <div className="results-toolbar">
              <div>
                <h2>
                  {loading ? t('searching') : `${filteredTutors.length} ${t('tutorsFound')}`}
                </h2>
                <p>{t('reviewDetails')}</p>
              </div>

              <div className="sort-control">
                <label htmlFor="sort-filter">{t('sortBy')}</label>
                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="recommended">{t('recommended')}</option>
                  <option value="rating">{t('highestRating')}</option>
                  <option value="price-low">{t('lowestPrice')}</option>
                  <option value="price-high">{t('highestPrice')}</option>
                  <option value="experience">{t('mostExperience')}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>{t('loadingTutors')}</p>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="no-results">
                <h3>{t('noMatches')}</h3>
                <p>{t('changeFilters')}</p>
                <button className="primary-btn" onClick={clearFilters}>
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className="find-results">
                {filteredTutors.map((tutor) => {
                  const saved = isSaved(tutor.id);
                  return (
                    <article className="find-tutor-card" key={tutor.id}>
                      <TutorPortrait tutor={tutor} className="find-avatar" />

                      <div className="find-tutor-info">
                        <div className="find-tutor-name">
                          <h3>{tutor.name}</h3>
                          {tutor.verified ? (
                            <span className="verified">✓ {t('verified')}</span>
                          ) : (
                            <span className="pending-badge">
                              {t('pendingVerification')}
                            </span>
                          )}
                        </div>

                        <p className="find-subject">
                          {(tutor.subjects || []).join(', ')} ·{' '}
                          {(tutor.modes || []).map((tutorMode) => tutorMode === 'In-person' ? t('inPerson') : tutorMode === 'Online' ? t('online') : t('hybrid')).join(' · ')}
                        </p>

                        <p className="find-description">{tutor.description}</p>

                        <div className="find-meta">
                          <span>
                            â˜… {tutor.rating} ({tutor.reviewsCount || tutor.reviews?.length || 0})
                          </span>
                          <span>{tutor.city || 'Dire Dawa'}</span>
                          <span>{tutor.experience} {t('yearsExperience')}</span>
                          <span>{t('nextSlot')}: {tutor.availability}</span>
                        </div>

                        <p className="match-note">
                          Subject, availability and price are shown to help you
                          compare tutors.
                        </p>

                        <div className="find-card-actions">
                          <button
                            className="primary-btn"
                            onClick={() => navigate(`/tutors/${tutor.id}`)}
                          >
                            {t('viewProfile')}
                          </button>

                          <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => toggleSaved(tutor.id, tutor.name)}
                          >
                            {saved ? `♥ ${t('saved')}` : `♡ ${t('saveTutor')}`}
                          </button>
                        </div>
                      </div>

                      <div className="find-price">
                        <strong>{tutor.price} ETB</strong>
                        <span>{t('perHour')}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Direct Chat Modal */}
      {activeChatTutor && (
        <ChatModal
          tutor={activeChatTutor}
          onClose={() => setActiveChatTutor(null)}
        />
      )}
    </div>
  );
}

export default FindTutors;


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tutorService } from '../services/tutorService';
import { usePreferences } from '../context/PreferencesContext';
import TutorPortrait from '../Components/TutorPortrait';
import '../App.css';

const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Programming', 'Amharic', 'Economics'];

function Home() {
  const navigate = useNavigate();
  const { t } = usePreferences();
  const [featuredTutors, setFeaturedTutors] = useState([]);

  useEffect(() => {
    tutorService.getAllTutors().then((list) => setFeaturedTutors(list.filter((tutor) => tutor.verified).slice(0, 3))).catch(() => setFeaturedTutors([]));
  }, []);

  const searchTutors = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    ['subject', 'grade', 'mode', 'city'].forEach((key) => {
      const value = form.get(key);
      if (value) params.set(key, value);
    });
    navigate(`/find-tutors?${params.toString()}`);
  };

  return (
    <main className="business-home">
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow"><span className="eyebrow-dot" /> {t('homeEyebrow')}</span>
          <h1>{t('homeHeadline')} <em>{t('homeHeadlineEm')}</em></h1>
          <p>{t('homeDescription')}</p>
          <div className="hero-actions">
            <Link to="/find-tutors" className="primary-btn">{t('findTutor')} <span aria-hidden="true">↗</span></Link>
            <Link to="/how-it-works" className="hero-text-link">{t('howItWorks')} <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-proof"><div className="proof-avatars"><span>AM</span><span>MK</span><span>TH</span></div><div><strong>{t('trustedFamilies')}</strong><small>{t('personalSupport')}</small></div></div>
        </div>
        <div className="hero-visual" aria-label="Personal tutoring and learning support">
          <div className="hero-image-wash" />
          <div className="visual-note note-top"><span className="note-icon">✦</span><span><strong>{t('learningPersonal')}</strong><small>{t('supportGoals')}</small></span></div>
          <div className="visual-person"><div className="person-sun" /><div className="person-head" /><div className="person-body" /><div className="person-book">A+</div></div>
          <div className="visual-note note-bottom"><span className="rating-star">★</span><span><strong>4.9 / 5</strong><small>From learner reviews</small></span></div>
          <span className="visual-caption">{t('nextChapter')}</span>
        </div>
        <div className="hero-search-wrap"><form className="hero-search" onSubmit={searchTutors}>
          <div className="search-heading"><span className="search-icon">⌕</span><span><strong>{t('findTutor')}</strong><small>{t('searchPrompt')}</small></span></div>
          <label><span>{t('subject').toUpperCase()}</span><select name="subject" defaultValue=""><option value="">{t('anySubject')}</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
          <label><span>{t('grade').toUpperCase()}</span><select name="grade" defaultValue=""><option value="">{t('anyGrade')}</option>{Array.from({ length: 13 }, (_, index) => <option key={index} value={index}>{t('gradeOption')} {index}</option>)}</select></label>
          <label><span>{t('mode').toUpperCase()}</span><select name="mode" defaultValue=""><option value="">{t('any')}</option><option value="Online">{t('online')}</option><option value="In-person">{t('inPerson')}</option><option value="Hybrid">{t('hybrid')}</option></select></label>
          <label><span>{t('location').toUpperCase()}</span><select name="city" defaultValue="Dire Dawa"><option value="Dire Dawa">{t('direDawa')}</option><option value="Any">{t('anyLocation')}</option></select></label>
          <button type="submit" className="primary-btn search-btn">{t('search')} <span aria-hidden="true">→</span></button>
        </form></div>
      </section>

      <section className="trust-strip"><span>{t('learningSupportFor')}</span><strong>{t('everyGrade')}</strong><i /><strong>{t('everySubject')}</strong><i /><strong>{t('everyLearner')}</strong></section>

      <section className="subjects-section">
        <div className="section-heading"><div><span className="eyebrow">{t('exploreOptions')}</span><h2>{t('whatLearn')}</h2></div><Link to="/find-tutors" className="text-link">{t('exploreSubjects')} <span aria-hidden="true">→</span></Link></div>
        <div className="subjects-list">{subjects.map((subject, index) => <Link to={`/find-tutors?subject=${encodeURIComponent(subject)}`} className="subject-chip" key={subject}><span className="subject-symbol">{['∑', 'Aa', '⚛', '◉', '⌬', '</>', '文', '↗'][index]}</span><span>{subject}</span><span className="subject-arrow" aria-hidden="true">↗</span></Link>)}</div>
      </section>

      <section className="steps-section" id="how-it-works"><div className="section-heading centered"><span className="eyebrow">{t('clearPath')}</span><h2>{t('fromLooking')}</h2><p>{t('simpleSteps')}</p></div><div className="steps-grid">{[['01', t('tellNeeds'), t('chooseSubjectGrade')], ['02', t('meetMatch'), t('compareProfiles')], ['03', t('bookConfident'), t('chooseTime')], ['04', t('makeProgress'), t('learnTogether')]].map(([number, title, description]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section className="safety-section"><div className="safety-intro"><span className="eyebrow">{t('confidenceEveryStep')}</span><h2>{t('learningSafe')}</h2><p>{t('safetyDescription')}</p><Link to="/about" className="text-link">{t('saferLearning')} <span aria-hidden="true">→</span></Link></div><div className="safety-features">{[['✓', t('reviewedProfiles'), t('safetyReviewedBody')], ['◎', t('guardianBookings'), t('guardianBookingsBody')], ['↗', t('supportAvailable'), t('supportBody')], ['⌖', t('privacyDesign'), t('privacyBody')]].map(([icon, title, body]) => <article key={title}><span>{icon}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section>

      {featuredTutors.length > 0 && <section className="tutors-section"><div className="section-heading"><div><span className="eyebrow">{t('meetTutors')}</span><h2>{t('featuredTutors')}</h2></div><Link to="/find-tutors" className="text-link">{t('meetAllTutors')} <span aria-hidden="true">→</span></Link></div><div className="tutors-grid">{featuredTutors.map((tutor) => <article className="tutor-card" key={tutor.id}><div className="tutor-top"><TutorPortrait tutor={tutor} className="avatar" /><span className="verified">✓ {t('verified')}</span></div><h3>{tutor.name}</h3><p className="tutor-subject">{(tutor.subjects || []).join(', ')} · {tutor.gradeRangeLabel || t('anyGrade')}</p><div className="tutor-bottom"><span className="rating">★ {tutor.rating} <span>({tutor.reviewsCount || tutor.reviews?.length || 0})</span></span><strong>{tutor.price} ETB<span>/{t('perHour')}</span></strong></div><button className="secondary-btn full-width" onClick={() => navigate(`/tutors/${tutor.id}`)}>{t('viewProfile')} <span aria-hidden="true">→</span></button></article>)}</div></section>}

      <section className="become-tutor"><div><span className="eyebrow">{t('tutorsCta')}</span><h2>{t('teachersCta')}</h2><p>{t('tutorCtaBody')}</p></div><Link to="/register" className="primary-btn">{t('teachWithUs')} <span aria-hidden="true">↗</span></Link></section>
    </main>
  );
}

export default Home;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tutorService } from '../services/tutorService';
import '../App.css';

const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Programming', 'Amharic', 'Economics'];

function Home() {
  const navigate = useNavigate();
  const [featuredTutors, setFeaturedTutors] = useState([]);

  useEffect(() => {
    tutorService.getAllTutors().then((list) => setFeaturedTutors(list.filter((tutor) => tutor.verified).slice(0, 3))).catch(() => setFeaturedTutors([]));
  }, []);

  const searchTutors = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    ['subject', 'grade', 'mode'].forEach((key) => {
      const value = form.get(key);
      if (value) params.set(key, value);
    });
    navigate(`/find-tutors?${params.toString()}`);
  };

  return (
    <main className="business-home">
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow"><span className="eyebrow-dot" /> A better way to learn</span>
          <h1>Good teaching changes <em>everything.</em></h1>
          <p>One-to-one tutoring for every learner. Find a trusted local or online tutor, book with confidence, and make real progress together.</p>
          <div className="hero-actions">
            <Link to="/find-tutors" className="primary-btn">Find your tutor <span aria-hidden="true">↗</span></Link>
            <Link to="/how-it-works" className="hero-text-link">See how it works <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-proof"><div className="proof-avatars"><span>AM</span><span>MK</span><span>TH</span></div><div><strong>Trusted by families across Ethiopia</strong><small>Personal support for every learning journey</small></div></div>
        </div>
        <div className="hero-visual" aria-label="Personal tutoring and learning support">
          <div className="hero-image-wash" />
          <div className="visual-note note-top"><span className="note-icon">✦</span><span><strong>Learning, made personal</strong><small>Support that fits your goals</small></span></div>
          <div className="visual-person"><div className="person-sun" /><div className="person-head" /><div className="person-body" /><div className="person-book">A+</div></div>
          <div className="visual-note note-bottom"><span className="rating-star">★</span><span><strong>4.9 / 5</strong><small>From learner reviews</small></span></div>
          <span className="visual-caption">Your next chapter starts here.</span>
        </div>
        <div className="hero-search-wrap"><form className="hero-search" onSubmit={searchTutors}>
          <div className="search-heading"><span className="search-icon">⌕</span><span><strong>Find the right tutor</strong><small>Start with what you want to learn</small></span></div>
          <label><span>SUBJECT</span><select name="subject" defaultValue=""><option value="">Choose a subject</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
          <label><span>GRADE</span><select name="grade" defaultValue=""><option value="">Any grade</option>{Array.from({ length: 13 }, (_, index) => <option key={index} value={index}>Grade {index}</option>)}</select></label>
          <label><span>LESSON TYPE</span><select name="mode" defaultValue=""><option value="">Online or in-person</option><option>Online</option><option>In-person</option><option>Hybrid</option></select></label>
          <button type="submit" className="primary-btn search-btn">Search tutors <span aria-hidden="true">→</span></button>
        </form></div>
      </section>

      <section className="trust-strip"><span>Thoughtful learning support for</span><strong>Every grade</strong><i /><strong>Every subject</strong><i /><strong>Every learner</strong></section>

      <section className="subjects-section">
        <div className="section-heading"><div><span className="eyebrow">Explore your options</span><h2>What would you like to learn?</h2></div><Link to="/find-tutors" className="text-link">Explore all subjects <span aria-hidden="true">→</span></Link></div>
        <div className="subjects-list">{subjects.map((subject, index) => <Link to={`/find-tutors?subject=${encodeURIComponent(subject)}`} className="subject-chip" key={subject}><span className="subject-symbol">{['∑', 'Aa', '⚛', '◉', '⌬', '</>', '文', '↗'][index]}</span><span>{subject}</span><span className="subject-arrow" aria-hidden="true">↗</span></Link>)}</div>
      </section>

      <section className="steps-section" id="how-it-works"><div className="section-heading centered"><span className="eyebrow">A clear path forward</span><h2>From looking to learning</h2><p>Everything you need to get started, in just a few simple steps.</p></div><div className="steps-grid">{[['01', 'Tell us what you need', 'Choose a subject, grade, and lesson format that works for you.'], ['02', 'Meet your match', 'Compare tutor profiles, experience, availability, and reviews.'], ['03', 'Book with confidence', 'Choose a time that suits you and review the details before confirming.'], ['04', 'Make real progress', 'Learn together, track your journey, and share feedback after a lesson.']].map(([number, title, description]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section className="safety-section"><div className="safety-intro"><span className="eyebrow">Confidence at every step</span><h2>Learning works best when everyone feels safe.</h2><p>We make it easier for families to find the right support with tutor profile reviews, guardian-led bookings, and a clear way to get help.</p><Link to="/about" className="text-link">Our approach to safer learning <span aria-hidden="true">→</span></Link></div><div className="safety-features">{[['✓', 'Reviewed tutor profiles', 'Tutor identity and qualifications are reviewed before a profile is verified.'], ['◎', 'Guardian-led bookings', 'Guardians can manage learner accounts and approve lesson bookings.'], ['↗', 'Support when you need it', 'Get in touch with our team whenever you have a question or concern.'], ['⌖', 'Privacy by design', 'Personal contact and location details stay protected.']].map(([icon, title, body]) => <article key={title}><span>{icon}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section>

      {featuredTutors.length > 0 && <section className="tutors-section"><div className="section-heading"><div><span className="eyebrow">Meet your learning partners</span><h2>Featured tutors</h2></div><Link to="/find-tutors" className="text-link">Meet all tutors <span aria-hidden="true">→</span></Link></div><div className="tutors-grid">{featuredTutors.map((tutor) => <article className="tutor-card" key={tutor.id}><div className="tutor-top"><div className="avatar">{tutor.initials}</div><span className="verified">✓ Verified</span></div><h3>{tutor.name}</h3><p className="tutor-subject">{(tutor.subjects || []).join(', ')} · {tutor.gradeRangeLabel || 'All grades'}</p><div className="tutor-bottom"><span className="rating">★ {tutor.rating} <span>({tutor.reviewsCount || tutor.reviews?.length || 0} reviews)</span></span><strong>{tutor.price} ETB<span>/hour</span></strong></div><button className="secondary-btn full-width" onClick={() => navigate(`/tutors/${tutor.id}`)}>View profile <span aria-hidden="true">→</span></button></article>)}</div></section>}

      <section className="become-tutor"><div><span className="eyebrow">For passionate educators</span><h2>Great teachers belong here.</h2><p>Share your expertise, build a profile that reflects your teaching, and connect with learners looking for your skills.</p></div><Link to="/register" className="primary-btn">Teach with us <span aria-hidden="true">↗</span></Link></section>
    </main>
  );
}

export default Home;

import ScrollToTopLink from './ScrollToTopLink';
import { Link } from 'react-router-dom';
import '../CssPages/Footer.css';
import { usePreferences } from '../context/PreferencesContext';

function Footer() {
  const { t, language } = usePreferences();
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Tutor<span>Connect</span>
          </Link>

          <p>
            Connecting learners, guardians, and tutors to make personalized
            learning easier.
          </p>
        </div>

        <div className="footer-links">
          <h3>{language === 'am' ? 'ይመልከቱ' : 'Explore'}</h3>
          <ScrollToTopLink to="/">{t('home')}</ScrollToTopLink>
          <ScrollToTopLink to="/find-tutors">{t('findTutors')}</ScrollToTopLink>
          <ScrollToTopLink to="/how-it-works">{t('howItWorks')}</ScrollToTopLink>
          <ScrollToTopLink to="/about">{language === 'am' ? 'ስለ እኛ' : 'About Us'}</ScrollToTopLink>
        </div>

        <div className="footer-links">
          <h3>{language === 'am' ? 'መለያ' : 'Account'}</h3>
          <Link to="/login">{language === 'am' ? 'ግባ' : 'Log In'}</Link>
          <Link to="/register">{language === 'am' ? 'መለያ ይፍጠሩ' : 'Create Account'}</Link>
          <Link to="/contact">{t('contact')}</Link>
        </div>

        <div className="footer-contact">
          <h3>{language === 'am' ? 'ያግኙን' : 'Get in touch'}</h3>
          <p>{language === 'am' ? 'ስለ TutorConnect ጥያቄ አለዎት?' : 'Questions about TutorConnect?'}</p>
          <Link to="/contact" className="footer-contact-link">
            {language === 'am' ? 'ቡድናችንን ያግኙ' : 'Contact our team'}
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
        <p>{language === 'am' ? 'የተሻለ ትምህርትን ለመደገፍ ተሰርቷል።' : 'Built to support better learning.'}</p>
      </div>
    </footer>
  );
}

export default Footer;

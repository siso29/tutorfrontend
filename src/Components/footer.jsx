import ScrollToTopLink from './ScrollToTopLink';
import { Link } from 'react-router-dom';
import '../CssPages/Footer.css';
import { usePreferences } from '../context/PreferencesContext';

function Footer() {
  const { t, language } = usePreferences();
  const am = language === 'am';

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Tutor<span>Connect</span></Link>
          <p>{am ? 'ተማሪዎችን፣ ወላጆችን እና አስተማሪዎችን እናገናኛለን።' : t('footerBlurb')}</p>
        </div>
        <div className="footer-links">
          <h3>{am ? 'ይመልከቱ' : t('footerExplore')}</h3>
          <ScrollToTopLink to="/">{t('home')}</ScrollToTopLink>
          <ScrollToTopLink to="/find-tutors">{t('findTutors')}</ScrollToTopLink>
          <ScrollToTopLink to="/how-it-works">{t('howItWorks')}</ScrollToTopLink>
          <ScrollToTopLink to="/about">{am ? 'ስለ እኛ' : t('about')}</ScrollToTopLink>
        </div>
        <div className="footer-links">
          <h3>{am ? 'መለያ' : t('footerAccount')}</h3>
          <Link to="/login">{am ? 'ግባ' : t('loginButton')}</Link>
          <Link to="/register">{am ? 'መለያ ይፍጠሩ' : t('createAccount')}</Link>
          <Link to="/contact">{t('contact')}</Link>
        </div>
        <div className="footer-contact">
          <h3>{am ? 'ያግኙን' : t('footerGetInTouch')}</h3>
          <p>{am ? 'ስለ TutorConnect ጥያቄ አለዎት?' : t('footerQuestions')}</p>
          <Link to="/contact" className="footer-contact-link">{am ? 'ቡድናችንን ያግኙ' : t('footerContactTeam')}</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
        <p>{am ? 'የተሻለ ትምህርትን ለመደገፍ ተሰርቷል።' : t('footerBuilt')}</p>
      </div>
    </footer>
  );
}

export default Footer;

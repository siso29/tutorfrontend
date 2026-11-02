import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PreferencesContext = createContext(null);
const LANGUAGE_KEY = 'tutorConnectLanguage';
const LOW_DATA_KEY = 'tutorConnectLowData';

const translations = {
  en: {
    home: 'Home', findTutors: 'Find tutors', howItWorks: 'How it works', about: 'About', contact: 'Contact',
    lowData: 'Low data', language: 'Language',
    findLearningPartner: 'Find your learning partner', findTutor: 'Find a tutor',
    compareTutors: 'Compare tutors by subject, grade, price, location, and availability to find the right match.',
    filters: 'Filters', clearAll: 'Clear all', searchNameSubject: 'Search by name or subject',
    any: 'Any', anyGrade: 'Any grade', subject: 'Subject', grade: 'Grade', mode: 'Lesson type',
    location: 'Location', anyLocation: 'Anywhere', direDawa: 'Dire Dawa',
    online: 'Online', inPerson: 'Face-to-face', hybrid: 'Hybrid',
    maxPrice: 'Max price per hour', minRating: 'Minimum rating', verifiedOnly: 'Verified tutors only',
    searching: 'Searching…', tutorsFound: 'tutors found', reviewDetails: 'Review each tutor’s details before booking.',
    sortBy: 'Sort by', recommended: 'Recommended', highestRating: 'Highest rating', lowestPrice: 'Lowest price',
    highestPrice: 'Highest price', mostExperience: 'Most experience', loadingTutors: 'Loading available tutors…',
    noMatches: 'No tutors match your filters', changeFilters: 'Try changing the subject, grade, location, or lesson type.',
    clearFilters: 'Clear filters', verified: 'Verified', pendingVerification: 'Verification pending',
    yearsExperience: 'years experience', nextSlot: 'Next slot', viewProfile: 'View profile', saveTutor: 'Save tutor',
    saved: 'Saved', perHour: 'per hour', anySubject: 'Any subject', search: 'Search tutors',
    gradeOption: 'Grade', noPhoto: 'Tutor photo hidden in low-data mode',
    homeEyebrow: 'A better way to learn', homeHeadline: 'Good teaching changes', homeHeadlineEm: 'everything.',
    homeDescription: 'One-to-one tutoring for every learner. Find a trusted local or online tutor, book with confidence, and make real progress together.',
    searchPrompt: 'Start with what you want to learn',
    exploreOptions: 'Explore your options', whatLearn: 'What would you like to learn?', exploreSubjects: 'Explore all subjects',
    clearPath: 'A clear path forward', fromLooking: 'From looking to learning', simpleSteps: 'Everything you need to get started, in just a few simple steps.',
    trustedFamilies: 'Trusted by families across Ethiopia', personalSupport: 'Personal support for every learning journey',
    confidenceEveryStep: 'Confidence at every step', learningSafe: 'Learning works best when everyone feels safe.',
    safetyDescription: 'We help families find the right support with reviewed tutor profiles, guardian-led bookings, and a clear way to get help.',
    saferLearning: 'Our approach to safer learning', reviewedProfiles: 'Reviewed tutor profiles', guardianBookings: 'Guardian-led bookings',
    supportAvailable: 'Support when you need it', privacyDesign: 'Privacy by design',
    featuredTutors: 'Featured tutors', meetTutors: 'Meet your learning partners', meetAllTutors: 'Meet all tutors',
    tutorsCta: 'For passionate educators', teachersCta: 'Great teachers belong here.', teachWithUs: 'Teach with us',
    learningPersonal: 'Learning, made personal', supportGoals: 'Support that fits your goals', nextChapter: 'Your next chapter starts here.',
    learningSupportFor: 'Thoughtful learning support for', everyGrade: 'Every grade', everySubject: 'Every subject', everyLearner: 'Every learner',
    tellNeeds: 'Tell us what you need', chooseSubjectGrade: 'Choose a subject, grade, and lesson format that works for you.',
    meetMatch: 'Meet your match', compareProfiles: 'Compare tutor profiles, experience, availability, and reviews.',
    bookConfident: 'Book with confidence', chooseTime: 'Choose a time that suits you and review the details before confirming.',
    makeProgress: 'Make real progress', learnTogether: 'Learn together, track your journey, and share feedback after a lesson.',
    safetyReviewedBody: 'Tutor identity and qualifications are reviewed before a profile is verified.',
    guardianBookingsBody: 'Guardians can manage learner accounts and approve lesson bookings.',
    supportBody: 'Get in touch with our team whenever you have a question or concern.',
    privacyBody: 'Personal contact and location details stay protected.',
    tutorCtaBody: 'Share your expertise, build a profile that reflects your teaching, and connect with learners looking for your skills.',
    authHeadline: 'Your learning journey starts here.', authIntro: 'Connect with qualified tutors, discover new skills, and make every learning session count.',
    authBenefit1: 'Find tutors for your learning goals', authBenefit2: 'Manage lessons and bookings', authBenefit3: 'Keep track of learning progress',
    welcomeBack: 'Welcome back!', joinTutorConnect: 'Join TutorConnect', enterDetails: 'Enter your details to access your account.', createStart: 'Create an account to get started.',
    fullName: 'Full name', email: 'Email address', password: 'Password', confirmPassword: 'Confirm password',
    joinAs: 'I want to join as', learner: 'Learner', guardian: 'Parent / Guardian', tutor: 'Tutor', rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?', loginAccount: 'Login to Account', createAccount: 'Create My Account',
    noAccount: "Don't have an account?", alreadyAccount: 'Already have an account?', terms: "By continuing, you agree to the platform's terms and privacy policy.",
  },
  am: {
    home: 'መነሻ', findTutors: 'አስተማሪ ፈልግ', howItWorks: 'እንዴት ይሰራል', about: 'ስለ እኛ', contact: 'ያግኙን',
    lowData: 'ዝቅተኛ ዳታ', language: 'ቋንቋ',
    findLearningPartner: 'የትምህርት አጋርዎን ያግኙ', findTutor: 'አስተማሪ ይፈልጉ',
    compareTutors: 'ትክክለኛውን አስተማሪ ለማግኘት ትምህርት አይነት፣ ክፍል፣ ዋጋ፣ አካባቢ እና የስራ ሰዓት ያወዳድሩ።',
    filters: 'ማጣሪያዎች', clearAll: 'ሁሉን አጽዳ', searchNameSubject: 'በስም ወይም በትምህርት ፈልግ',
    any: 'ሁሉም', anyGrade: 'ሁሉም ክፍሎች', subject: 'ትምህርት', grade: 'ክፍል', mode: 'የትምህርት አይነት',
    location: 'አካባቢ', anyLocation: 'ሁሉም አካባቢ', direDawa: 'ድሬዳዋ',
    online: 'በኦንላይን', inPerson: 'ፊት ለፊት', hybrid: 'በሁለቱም',
    maxPrice: 'ከፍተኛ የሰዓት ዋጋ', minRating: 'ዝቅተኛ ደረጃ', verifiedOnly: 'የተረጋገጡ አስተማሪዎች ብቻ',
    searching: 'በመፈለግ ላይ…', tutorsFound: 'አስተማሪዎች ተገኝተዋል', reviewDetails: 'ከማስያዝዎ በፊት የአስተማሪውን መረጃ ይመልከቱ።',
    sortBy: 'አስቀድም በ', recommended: 'የሚመከር', highestRating: 'ከፍተኛ ደረጃ', lowestPrice: 'ዝቅተኛ ዋጋ',
    highestPrice: 'ከፍተኛ ዋጋ', mostExperience: 'ብዙ ልምድ', loadingTutors: 'አስተማሪዎችን በመጫን ላይ…',
    noMatches: 'ከማጣሪያዎቹ ጋር የሚስማማ አስተማሪ አልተገኘም', changeFilters: 'የትምህርት አይነት፣ ክፍል፣ አካባቢ ወይም የትምህርት ዘዴ ይቀይሩ።',
    clearFilters: 'ማጣሪያዎችን አጽዳ', verified: 'የተረጋገጠ', pendingVerification: 'ማረጋገጫ በመጠባበቅ ላይ',
    yearsExperience: 'ዓመት ልምድ', nextSlot: 'ቀጣይ ሰዓት', viewProfile: 'መገለጫ ይመልከቱ', saveTutor: 'አስቀምጥ',
    saved: 'ተቀምጧል', perHour: 'በሰዓት', anySubject: 'ማንኛውም ትምህርት', search: 'አስተማሪ ፈልግ',
    gradeOption: 'ክፍል', noPhoto: 'በዝቅተኛ ዳታ ሁነታ የአስተማሪ ፎቶ አይታይም',
    homeEyebrow: 'የተሻለ የትምህርት መንገድ', homeHeadline: 'ጥሩ ትምህርት', homeHeadlineEm: 'ሁሉንም ይቀይራል።',
    homeDescription: 'ለእያንዳንዱ ተማሪ የግል ትምህርት። የሚታመን የአካባቢ ወይም የኦንላይን አስተማሪ ያግኙ፣ በልበ ሙሉነት ይያዙ እና እድገት ያድርጉ።',
    searchPrompt: 'መማር በሚፈልጉት ይጀምሩ',
    exploreOptions: 'አማራጮችዎን ይመልከቱ', whatLearn: 'ምን መማር ይፈልጋሉ?', exploreSubjects: 'ሁሉንም ትምህርቶች ይመልከቱ',
    clearPath: 'ግልጽ የትምህርት መንገድ', fromLooking: 'ከፍለጋ ወደ ትምህርት', simpleSteps: 'ለመጀመር የሚያስፈልጉዎት ነገሮች በጥቂት ቀላል ደረጃዎች።',
    trustedFamilies: 'በኢትዮጵያ ያሉ ቤተሰቦች ይተማመኑብናል', personalSupport: 'ለእያንዳንዱ የትምህርት ጉዞ የግል ድጋፍ',
    confidenceEveryStep: 'በእያንዳንዱ ደረጃ እምነት', learningSafe: 'ሁሉም ደህንነት ሲሰማቸው ትምህርት ይሻሻላል።',
    safetyDescription: 'በተመረመሩ የአስተማሪ መገለጫዎች፣ በወላጅ ቁጥጥር ማስያዣ እና ግልጽ የድጋፍ መንገድ ቤተሰቦችን እናግዛለን።',
    saferLearning: 'ደህንነቱ ስለተጠበቀ ትምህርት', reviewedProfiles: 'የተመረመሩ መገለጫዎች', guardianBookings: 'በወላጅ ቁጥጥር ማስያዣ',
    supportAvailable: 'በሚያስፈልግዎ ጊዜ ድጋፍ', privacyDesign: 'የግል መረጃ ጥበቃ',
    featuredTutors: 'ተመራጭ አስተማሪዎች', meetTutors: 'የትምህርት አጋሮችዎን ያግኙ', meetAllTutors: 'ሁሉንም አስተማሪዎች ይመልከቱ',
    tutorsCta: 'ለትምህርት ፍቅር ላላቸው', teachersCta: 'ጥሩ አስተማሪዎች እዚህ ያስፈልጋሉ።', teachWithUs: 'አብረውን ያስተምሩ',
    learningPersonal: 'ግላዊ ትምህርት', supportGoals: 'ከግቦችዎ ጋር የሚስማማ ድጋፍ', nextChapter: 'ቀጣዩ ምዕራፍዎ እዚህ ይጀምራል።',
    learningSupportFor: 'የትምህርት ድጋፍ ለ', everyGrade: 'ለእያንዳንዱ ክፍል', everySubject: 'ለእያንዳንዱ ትምህርት', everyLearner: 'ለእያንዳንዱ ተማሪ',
    tellNeeds: 'ፍላጎትዎን ይንገሩን', chooseSubjectGrade: 'የሚስማማዎትን ትምህርት፣ ክፍል እና የትምህርት ዘዴ ይምረጡ።',
    meetMatch: 'ተስማሚዎን ያግኙ', compareProfiles: 'የአስተማሪዎችን መገለጫ፣ ልምድ፣ የስራ ሰዓት እና ግምገማ ያወዳድሩ።',
    bookConfident: 'በልበ ሙሉነት ያስይዙ', chooseTime: 'የሚስማማዎትን ሰዓት ይምረጡ እና ከማረጋገጥዎ በፊት ዝርዝሩን ይመልከቱ።',
    makeProgress: 'እውነተኛ እድገት ያድርጉ', learnTogether: 'አብረው ይማሩ፣ ጉዞዎን ይከታተሉ እና ከትምህርት በኋላ አስተያየት ይስጡ።',
    safetyReviewedBody: 'መገለጫው ከመረጋገጡ በፊት የአስተማሪው ማንነት እና ብቃት ይመረመራሉ።',
    guardianBookingsBody: 'ወላጆች የተማሪ መለያዎችን ማስተዳደር እና ማስያዣዎችን ማጽደቅ ይችላሉ።',
    supportBody: 'ጥያቄ ወይም ስጋት ሲኖርዎ የድጋፍ ቡድናችንን ያግኙ።',
    privacyBody: 'የግል የእውቂያ እና የአካባቢ መረጃዎ ይጠበቃል።',
    tutorCtaBody: 'እውቀትዎን ያካፍሉ፣ የማስተማር መገለጫዎን ይገንቡ እና ክህሎትዎን ከሚፈልጉ ተማሪዎች ጋር ይገናኙ።',
    authHeadline: 'የትምህርት ጉዞዎ እዚህ ይጀምራል።', authIntro: 'ከብቁ አስተማሪዎች ጋር ይገናኙ፣ አዳዲስ ክህሎቶችን ያዳብሩ እና ከእያንዳንዱ ትምህርት ይጠቀሙ።',
    authBenefit1: 'ለትምህርት ግቦችዎ አስተማሪ ያግኙ', authBenefit2: 'ትምህርቶችን እና ማስያዣዎችን ያስተዳድሩ', authBenefit3: 'የትምህርት እድገትን ይከታተሉ',
    welcomeBack: 'እንኳን ደህና መጡ!', joinTutorConnect: 'TutorConnect ይቀላቀሉ', enterDetails: 'ወደ መለያዎ ለመግባት መረጃዎን ያስገቡ።', createStart: 'ለመጀመር መለያ ይፍጠሩ።',
    fullName: 'ሙሉ ስም', email: 'ኢሜይል አድራሻ', password: 'የይለፍ ቃል', confirmPassword: 'የይለፍ ቃሉን ያረጋግጡ',
    joinAs: 'እንደ ማን መቀላቀል ይፈልጋሉ?', learner: 'ተማሪ', guardian: 'ወላጅ / አሳዳጊ', tutor: 'አስተማሪ', rememberMe: 'አስታውሰኝ',
    forgotPassword: 'የይለፍ ቃል ረሱ?', loginAccount: 'ወደ መለያ ይግቡ', createAccount: 'መለያ ይፍጠሩ',
    noAccount: 'መለያ የለዎትም?', alreadyAccount: 'መለያ አለዎት?', terms: 'በመቀጠል የመድረኩን ውሎች እና የግላዊነት መመሪያ ተስማምተዋል።',
  },
};

function initialLowData() {
  try {
    const saved = localStorage.getItem(LOW_DATA_KEY);
    if (saved !== null) return saved === 'true';
  } catch { /* Ignore unavailable storage. */ }
  const connection = typeof navigator === 'undefined' ? null : navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return Boolean(connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType));
}

export function PreferencesProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try { return localStorage.getItem(LANGUAGE_KEY) === 'am' ? 'am' : 'en'; } catch { return 'en'; }
  });
  const [lowData, setLowDataState] = useState(initialLowData);

  useEffect(() => {
    document.documentElement.lang = language === 'am' ? 'am' : 'en';
    document.documentElement.classList.toggle('low-data-mode', lowData);
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      localStorage.setItem(LOW_DATA_KEY, String(lowData));
    } catch { /* Preferences remain active for this session. */ }
  }, [language, lowData]);

  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage) => setLanguageState(nextLanguage === 'am' ? 'am' : 'en'),
    lowData,
    setLowData: setLowDataState,
    t: (key) => translations[language][key] || translations.en[key] || key,
  }), [language, lowData]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}

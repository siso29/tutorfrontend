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

const additionalTranslations = {
  om: {
    ...translations.en,
    home: 'Fuula jalqabaa', findTutors: 'Barsiisaa barbaadi', howItWorks: 'Akkaataa itti hojjetu', about: 'Waa’ee keenya', contact: 'Nu qunnamaa',
    lowData: 'Daataa xiqqaa', language: 'Afaan', findLearningPartner: 'Hiriyyaa barnootaa kee barbaadi', findTutor: 'Barsiisaa barbaadi',
    compareTutors: 'Barsiisota barnoota, kutaa, gatii, bakka fi yeroo argamaatiin wal bira qabi.',
    filters: 'Calallii', clearAll: 'Hunda qulqulleessi', searchNameSubject: 'Maqaa yookaan barnootaan barbaadi',
    any: 'Kamiyyuu', anyGrade: 'Kutaa kamiyyuu', subject: 'Barnoota', grade: 'Kutaa', mode: 'Gosa barnootaa',
    location: 'Bakka', anyLocation: 'Bakka kamiyyuu', direDawa: 'Dirree Dhawaa', online: 'Toora interneetii', inPerson: 'Fuulaa fuulatti', hybrid: 'Lamaan isaanii',
    maxPrice: 'Gatii sa’aatii olaanaa', minRating: 'Sadarkaa xiqqaa', verifiedOnly: 'Barsiisota mirkanaa’an qofa',
    searching: 'Barbaadaa jira…', tutorsFound: 'barsiisota argaman', reviewDetails: 'Osoo hin qabatin dura odeeffannoo barsiisaa ilaali.',
    sortBy: 'Tartiibessi', recommended: 'Kan gorfame', highestRating: 'Sadarkaa olaanaa', lowestPrice: 'Gatii gadi aanaa', highestPrice: 'Gatii olaanaa', mostExperience: 'Muuxannoo baay’ee',
    loadingTutors: 'Barsiisota fe’aa jira…', noMatches: 'Barsiisaan calallii kanaan wal simu hin argamne', changeFilters: 'Barnoota, kutaa, bakka yookaan gosa barnootaa jijjiiri.',
    clearFilters: 'Calallii qulqulleessi', verified: 'Mirkanaa’e', pendingVerification: 'Mirkaneessa eeggataa jira', yearsExperience: 'waggaa muuxannoo',
    nextSlot: 'Yeroo itti aanu', viewProfile: 'Odeeffannoo ilaali', saveTutor: 'Barsiisaa olkaa’i', saved: 'Olkaa’ame', perHour: 'sa’aatii tokkoof', anySubject: 'Barnoota kamiyyuu', search: 'Barsiisaa barbaadi', gradeOption: 'Kutaa',
    homeEyebrow: 'Karaa barnootaa fooyya’aa', homeHeadline: 'Barsiisni gaariin', homeHeadlineEm: 'waan hunda jijjiira.',
    homeDescription: 'Barataa hundaaf barnoota dhuunfaa. Barsiisaa naannoo yookaan toora interneetii amanamaa barbaadi, beellami, guddinas taasis.',
    searchPrompt: 'Waan barachuu barbaadduun jalqabi', exploreOptions: 'Filannoo kee ilaali', whatLearn: 'Maal barachuu barbaadda?', exploreSubjects: 'Barnoota hunda ilaali',
    clearPath: 'Karaa barnootaa ifa ta’e', fromLooking: 'Barbaaduu irraa gara barnootaatti', simpleSteps: 'Tarkaanfii salphaa muraasaan jalqabi.',
    trustedFamilies: 'Maatiin Itoophiyaa nu amanu', personalSupport: 'Deeggarsa barnootaa dhuunfaa', confidenceEveryStep: 'Tarkaanfii hunda irratti ofitti amanamummaa', learningSafe: 'Namni hundi yeroo nageenya qabu barnoonni ni milkaa’a.',
    safetyDescription: 'Maatiiwwan barsiisaa sirrii akka argatan ni gargaarra; odeeffannoo barsiisotaa ni qoranna, maatiin beellama ni to’atu.', saferLearning: 'Mala nageenya barnootaa', reviewedProfiles: 'Odeeffannoo barsiisaa qorame', guardianBookings: 'Beellama maatiin to’atu', supportAvailable: 'Yeroo barbaaddan deeggarsa', privacyDesign: 'Iccitii eeguu',
    featuredTutors: 'Barsiisota filataman', meetTutors: 'Hiriyoota barnootaa kee argadhu', meetAllTutors: 'Barsiisota hunda ilaali', tutorsCta: 'Barsiisotaaf', teachersCta: 'Barsiisota gaariin asitti ni barbaachisu.', teachWithUs: 'Nu waliin barsiisi',
    learningPersonal: 'Barnoota dhuunfaa', supportGoals: 'Deeggarsa galma kee waliin deemu', nextChapter: 'Boqonnaan kee itti aanu asitti jalqaba.', learningSupportFor: 'Deeggarsa barnootaa', everyGrade: 'Kutaa hundaaf', everySubject: 'Barnoota hundaaf', everyLearner: 'Barataa hundaaf',
    tellNeeds: 'Waan si barbaachisu nutti himi', chooseSubjectGrade: 'Barnoota, kutaa fi gosa barnootaa siif ta’u filadhu.', meetMatch: 'Barsiisaa siif malu argadhu', compareProfiles: 'Odeeffannoo barsiisaa, muuxannoo, yeroo fi yaada maamilaa wal bira qabi.',
    bookConfident: 'Ofitti amanamummaan beellami', chooseTime: 'Yeroo siif mijatu filadhu; osoo hin mirkaneessin dura odeeffannoo ilaali.', makeProgress: 'Guddina dhugaa argadhu', learnTogether: 'Waliin baradhaa, adeemsa hordofaa, yaada keessan qoodaa.',
    safetyReviewedBody: 'Mirkaneessa dura eenyummaa fi gahumsi barsiisaa ni qorama.', guardianBookingsBody: 'Maatiin herrega barataa bulchuu fi beellama hayyamuu danda’u.', supportBody: 'Gaaffii yookaan yaaddoo yoo qabaattan garee keenya qunnamaa.', privacyBody: 'Odeeffannoon dhuunfaa fi bakka jireenyaa ni eegama.', tutorCtaBody: 'Beekumsa kee qoodi, odeeffannoo barsiisummaa kee guuti, barattoota si barbaadan waliin wal qunnami.',
    authHeadline: 'Imalli barnootaa kee asitti jalqaba.', authIntro: 'Barsiisota gahumsa qaban waliin wal qunnami, dandeettii haaraa baradhu.',
    authBenefit1: 'Galma barnoota keetiif barsiisaa argadhu', authBenefit2: 'Barnootaa fi beellama bulchi', authBenefit3: 'Guddina barnootaa hordofi', welcomeBack: 'Baga nagaan deebite!', joinTutorConnect: 'TutorConnect makami', enterDetails: 'Herrega seenuuf odeeffannoo kee galchi.', createStart: 'Jalqabuuf herrega bani.',
    fullName: 'Maqaa guutuu', email: 'Teessoo imeelii', password: 'Jecha icciitii', confirmPassword: 'Jecha icciitii mirkaneessi', joinAs: 'Akka eenyuutti makamuu barbaadda?', learner: 'Barataa', guardian: 'Maatii / Eegduu', tutor: 'Barsiisaa', rememberMe: 'Na yaadadhu', forgotPassword: 'Jecha icciitii dagatte?', loginAccount: 'Herrega seeni', createAccount: 'Herrega bani', noAccount: 'Herrega hin qabduu?', alreadyAccount: 'Herrega qabdaa?', terms: 'Itti fufuun, seeraa fi imaammata iccitii ni fudhatta.',
    authTag: 'BARADHU • BARSIISI • GUDDADHU', registerButton: 'Galmaa’i', loginButton: 'Seeni',
    footerExplore: 'Sakatta’i', footerAccount: 'Herrega', footerGetInTouch: 'Nu qunnamaa', footerQuestions: 'TutorConnect irratti gaaffii qabdaa?', footerContactTeam: 'Garee keenya qunnami', footerBuilt: 'Barnoota fooyya’aa deeggaruuf hojjetame.',
  },
  so: {
    ...translations.en,
    home: 'Bogga hore', findTutors: 'Raadi macallin', howItWorks: 'Sida ay u shaqayso', about: 'Nagu saabsan', contact: 'Nala soo xiriir',
    lowData: 'Xog yar', language: 'Luqad', findLearningPartner: 'Raadi lammaanahaaga waxbarasho', findTutor: 'Raadi macallin',
    compareTutors: 'Is barbar dhig macallimiinta maaddo, fasal, qiime, goob iyo waqti si aad u hesho midka kugu habboon.',
    filters: 'Shaandhayn', clearAll: 'Dhammaan nadiifi', searchNameSubject: 'Ku raadi magac ama maaddo', any: 'Mid kasta', anyGrade: 'Fasal kasta', subject: 'Maaddo', grade: 'Fasal', mode: 'Nooca casharka',
    location: 'Goobta', anyLocation: 'Meel kasta', direDawa: 'Dire Dawa', online: 'Khadka internetka', inPerson: 'Fool-ka-fool', hybrid: 'Labada nooc',
    maxPrice: 'Qiimaha ugu sarreeya saacaddii', minRating: 'Qiimaynta ugu yar', verifiedOnly: 'Macallimiin la xaqiijiyey oo keliya', searching: 'Waa la raadinayaa…', tutorsFound: 'macallin ayaa la helay',
    reviewDetails: 'Faahfaahinta macallinka eeg ka hor intaadan ballansan.', sortBy: 'U kala saar', recommended: 'La soo jeediyey', highestRating: 'Qiimaynta ugu sarreysa', lowestPrice: 'Qiimaha ugu hooseeya', highestPrice: 'Qiimaha ugu sarreeya', mostExperience: 'Khibradda ugu badan', loadingTutors: 'Macallimiinta waa la soo rarayaa…',
    noMatches: 'Macallin ku habboon shaandhayntan lama helin', changeFilters: 'Beddel maaddada, fasalka, goobta ama nooca casharka.', clearFilters: 'Nadiifi shaandhaynta', verified: 'La xaqiijiyey', pendingVerification: 'Xaqiijin ayaa socota', yearsExperience: 'sano oo waayo-aragnimo ah', nextSlot: 'Waqtiga xiga', viewProfile: 'Eeg astaanta', saveTutor: 'Kaydi macallinka', saved: 'La kaydiyey', perHour: 'saacaddii', anySubject: 'Maaddo kasta', search: 'Raadi macallin', gradeOption: 'Fasal',
    homeEyebrow: 'Hab ka wanaagsan waxbarashada', homeHeadline: 'Waxbarid wanaagsan', homeHeadlineEm: 'wax walba way beddeshaa.', homeDescription: 'Casharro gaar ah oo arday kasta ah. Raadi macallin deegaankaaga ama internetka, si kalsooni leh u ballanso, horumarna samee.', searchPrompt: 'Ka bilow waxa aad rabto inaad barato',
    exploreOptions: 'Eeg xulashooyinkaaga', whatLearn: 'Maxaad jeclaan lahayd inaad barato?', exploreSubjects: 'Eeg maaddooyinka oo dhan', clearPath: 'Jid waxbarasho oo cad', fromLooking: 'Raadin ilaa waxbarasho', simpleSteps: 'Wax kasta oo aad ku bilaabi karto, dhowr tallaabo oo fudud.',
    trustedFamilies: 'Qoysas badan oo Itoobiya jooga ayaa nagu kalsoon', personalSupport: 'Taageero u gaar ah safar kasta oo waxbarasho', confidenceEveryStep: 'Kalsooni tallaabo kasta', learningSafe: 'Waxbarashadu way wanaagsanaataa marka qof kastaa ammaan dareemo.', safetyDescription: 'Waxaan qoysaska ka caawinnaa helitaanka taageerada saxda ah annagoo eegayna astaamaha macallimiinta, ballansashadana waalidku maamulo.', saferLearning: 'Habkayaga badbaadada waxbarashada', reviewedProfiles: 'Astaamaha macallimiinta la hubiyey', guardianBookings: 'Ballansashada waalidku maamulo', supportAvailable: 'Taageero markaad u baahato', privacyDesign: 'Ilaalinta xogta gaarka ah',
    featuredTutors: 'Macallimiin la xushay', meetTutors: 'La kulan lammaanahaaga waxbarasho', meetAllTutors: 'La kulan dhammaan macallimiinta', tutorsCta: 'Macallimiinta', teachersCta: 'Macallimiin wanaagsan halkan ayay ku habboon yihiin.', teachWithUs: 'Nala shaqee macallin ahaan',
    learningPersonal: 'Waxbarasho kuu gaar ah', supportGoals: 'Taageero ku habboon yoolalkaaga', nextChapter: 'Cutubkaaga xiga halkan ayuu ka bilaabmaa.', learningSupportFor: 'Taageero waxbarasho oo loogu talagalay', everyGrade: 'Fasal kasta', everySubject: 'Maaddo kasta', everyLearner: 'Arday kasta',
    tellNeeds: 'Noo sheeg baahidaada', chooseSubjectGrade: 'Dooro maaddo, fasal iyo nooca casharka kugu habboon.', meetMatch: 'Hel macallinka kugu habboon', compareProfiles: 'Is barbar dhig astaamaha, khibradda, helitaanka iyo faallooyinka macallimiinta.', bookConfident: 'Si kalsooni leh u ballanso', chooseTime: 'Dooro waqti kugu habboon oo eeg faahfaahinta ka hor xaqiijinta.', makeProgress: 'Horumar dhab ah samee', learnTogether: 'Wada barta, la socda horumarka, fikradahana wadaaga casharka ka dib.',
    safetyReviewedBody: 'Aqoonsiga iyo aqoonta macallinka waa la hubiyaa ka hor xaqiijinta astaanta.', guardianBookingsBody: 'Waalidiintu waxay maamuli karaan akoonnada ardayda oo ansixin karaan ballamaha.', supportBody: 'La xiriir kooxdayada haddii aad su’aal ama walaac qabto.', privacyBody: 'Xogta xiriirka iyo goobta gaarka ah waa la ilaaliyaa.', tutorCtaBody: 'La wadaag aqoontaada, dhis astaantaada macallinnimo, lana xiriir ardayda u baahan xirfadahaaga.',
    authHeadline: 'Safarkaaga waxbarasho halkan ayuu ka bilaabmaa.', authIntro: 'La xiriir macallimiin aqoon leh, baro xirfado cusub, cashar kastana ka faa’iidayso.', authBenefit1: 'Hel macallimiin taageera yoolalkaaga', authBenefit2: 'Maamul casharrada iyo ballamaha', authBenefit3: 'La soco horumarka waxbarashada', welcomeBack: 'Soo dhawoow!', joinTutorConnect: 'Ku biir TutorConnect', enterDetails: 'Geli faahfaahintaada si aad akoonka u furato.', createStart: 'Samee akoon si aad u bilowdo.',
    fullName: 'Magaca oo buuxa', email: 'Cinwaanka iimaylka', password: 'Furaha sirta', confirmPassword: 'Xaqiiji furaha sirta', joinAs: 'Waxaan rabaa inaan ku biiro anigoo ah', learner: 'Arday', guardian: 'Waalid / Mas’uul', tutor: 'Macallin', rememberMe: 'I xasuuso', forgotPassword: 'Ma illowday furaha sirta?', loginAccount: 'Gal akoonka', createAccount: 'Samee akoonkayga', noAccount: 'Akoon ma lihid?', alreadyAccount: 'Akoon ma leedahay?', terms: 'Markaad sii waddo, waxaad oggolaanaysaa shuruudaha iyo siyaasadda asturnaanta.',
    authTag: 'BARO • BAR • KOR', registerButton: 'Is diiwaangeli', loginButton: 'Gal',
    footerExplore: 'Baadh', footerAccount: 'Akoon', footerGetInTouch: 'Nala soo xiriir', footerQuestions: 'Su’aalo ma ka qabtaa TutorConnect?', footerContactTeam: 'La xiriir kooxdayada', footerBuilt: 'Waxaa loo sameeyey taageeridda waxbarasho wanaagsan.',
  },
};

Object.assign(translations, additionalTranslations);
translations.om.footerBlurb = 'Barattoota, maatii fi barsiisota walitti fidna.';
translations.so.footerBlurb = 'Waxaan isku xirnaa ardayda, waalidiinta iyo macallimiinta.';
Object.assign(translations.en, {
  authTag: 'LEARN • TEACH • GROW',
  registerButton: 'Register',
  loginButton: 'Log in',
  footerExplore: 'Explore',
  footerAccount: 'Account',
  footerGetInTouch: 'Get in touch',
  footerQuestions: 'Questions about TutorConnect?',
  footerContactTeam: 'Contact our team',
  footerBuilt: 'Built to support better learning.',
  footerBlurb: 'Connecting learners, guardians, and tutors to make personalized learning easier.',
});

const supportedLanguages = ['en', 'am', 'om', 'so'];

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
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return supportedLanguages.includes(saved) ? saved : 'en';
    } catch { return 'en'; }
  });
  const [lowData, setLowDataState] = useState(initialLowData);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.classList.toggle('low-data-mode', lowData);
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      localStorage.setItem(LOW_DATA_KEY, String(lowData));
    } catch { /* Preferences remain active for this session. */ }
  }, [language, lowData]);

  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage) => setLanguageState(supportedLanguages.includes(nextLanguage) ? nextLanguage : 'en'),
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

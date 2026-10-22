import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import FindTutors from './pages/findtutors.jsx';
import TutorProfile from './pages/TutorProfile.jsx';
import GuardianDashboard from './pages/GuardianDashboard.jsx';
import TutorDashboard from './pages/tutorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Auth from './pages/Auth.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/footer.jsx';
import ScrollTop from './Components/ScrollTop.jsx';
import BookingConfirmation from './pages/BookingConfrimation.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import ToastContainer from './Components/ToastContainer.jsx';

import { NotificationProvider } from './context/NotificationContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { SavedTutorsProvider } from './context/SavedTutorsContext.jsx';

import './CssPages/ModalsAndComponents.css';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BookingProvider>
          <SavedTutorsProvider>
            <BrowserRouter>
              <ScrollTop />
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-tutors" element={<FindTutors />} />
                <Route path="/tutors/:id" element={<TutorProfile />} />
                <Route
                  path="/guardian-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['guardian', 'student', 'learner', 'admin']}>
                      <GuardianDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tutor-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['tutor', 'admin']}>
                      <TutorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              </Routes>
              <Footer />
              <ToastContainer />
            </BrowserRouter>
          </SavedTutorsProvider>
        </BookingProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;

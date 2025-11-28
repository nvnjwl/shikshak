import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Dashboard from './pages/student/Dashboard';
import Login from './pages/auth/Login';
import ChatSession from './pages/student/ChatSession';
import Signup from './pages/auth/Signup';
import ProfileSetup from './pages/onboarding/ProfileSetup';
import SyllabusHome from './pages/student/syllabus/SyllabusHome';
import SubjectView from './pages/student/syllabus/SubjectView';
import ChapterView from './pages/student/syllabus/ChapterView';
import History from './pages/student/History';
import ParentLogin from './pages/parent/ParentLogin';
import ParentDashboard from './pages/parent/ParentDashboard';
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import SuccessStories from './pages/public/SuccessStories';
import TopicLearning from './pages/student/TopicLearning';
import Pricing from './pages/public/Pricing';
import PracticeQuestions from './pages/student/PracticeQuestions';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudySession from './pages/student/StudySession';
import Checkout from './pages/payment/Checkout';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailure from './pages/payment/PaymentFailure';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';



function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  // For MVP dev, if we don't have a real user, we might want to bypass or mock.
  // But let's keep it strict for now, or maybe allow null if we are just testing UI.
  // Actually, let's just redirect to login if no user.
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/parent/login" element={<ParentLogin />} />
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={
              // <PrivateRoute>
              <ProfileSetup />
              // </PrivateRoute>
            } />
            <Route path="/app" element={
              // <PrivateRoute> 
              <Dashboard />
              // </PrivateRoute>
            } />
            <Route path="/syllabus" element={<SyllabusHome />} />
            <Route path="/syllabus/:subjectId" element={<SubjectView />} />
            <Route path="/syllabus/:subjectId/:chapterId" element={<ChapterView />} />
            <Route path="/history" element={<History />} />
            <Route path="/learn/:subjectId/:chapterId/:topicId" element={<TopicLearning />} />
            <Route path="/practice/:subjectId/:chapterId/:topicId" element={<PracticeQuestions />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/legal/terms-of-service" element={<TermsOfService />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/refund-policy" element={<RefundPolicy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/study-session" element={<StudySession />} />
            <Route path="/chat" element={
              // <PrivateRoute>
              <ChatSession />
              // </PrivateRoute>
            } />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;

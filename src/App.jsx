import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ProfileProvider } from './contexts/ProfileContext';
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
import FAQ from './pages/public/FAQ';
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
import AdminRoute from './components/AdminRoute';
import StudentList from './pages/admin/students/StudentList';
import StudentDetail from './pages/admin/students/StudentDetail';
import SalesDashboard from './pages/admin/sales/SalesDashboard';
import CouponManager from './pages/admin/coupons/CouponManager';
import SyllabusManager from './pages/admin/syllabus/SyllabusManager';
import AdminLogin from './pages/admin/AdminLogin';
import Settings from './pages/student/Settings';
import AdminSetup from './pages/admin/AdminSetup';
import ChangeAdminPassword from './pages/admin/ChangeAdminPassword';
import SupportTicketList from './pages/admin/support/SupportTicketList';
import SupportTicketDetail from './pages/admin/support/SupportTicketDetail';
import AdminManagement from './pages/admin/settings/AdminManagement';
import StudentLayout from './components/layouts/StudentLayout';
import ErrorBoundary from './components/ErrorBoundary';


function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  // For MVP dev, if we don't have a real user, we might want to bypass or mock.
  // But let's keep it strict for now, or maybe allow null if we are just testing UI.
  // Actually, let's just redirect to login if no user.
  return currentUser ? children : <Navigate to="/login" />;
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ProfileProvider>
          <Router>
            <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/parent/login" element={<ParentLogin />} />
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={
                // <PrivateRoute>
                <ProfileSetup />
                // </PrivateRoute>
              } />

              {/* Student Routes with Layout and Error Boundary */}
              <Route element={<StudentLayout />}>
                <Route path="/app" element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="/settings" element={
                  <ErrorBoundary>
                    <Settings />
                  </ErrorBoundary>
                } />
                <Route path="/syllabus" element={
                  <ErrorBoundary>
                    <SyllabusHome />
                  </ErrorBoundary>
                } />
                <Route path="/syllabus/:subjectId" element={
                  <ErrorBoundary>
                    <SubjectView />
                  </ErrorBoundary>
                } />
                <Route path="/syllabus/:subjectId/:chapterId" element={
                  <ErrorBoundary>
                    <ChapterView />
                  </ErrorBoundary>
                } />
                <Route path="/history" element={
                  <ErrorBoundary>
                    <History />
                  </ErrorBoundary>
                } />
                <Route path="/learn/:subjectId/:chapterId/:topicId" element={
                  <ErrorBoundary>
                    <TopicLearning />
                  </ErrorBoundary>
                } />
                <Route path="/practice/:subjectId/:chapterId/:topicId" element={
                  <ErrorBoundary>
                    <PracticeQuestions />
                  </ErrorBoundary>
                } />
                <Route path="/study-session" element={
                  <ErrorBoundary>
                    <StudySession />
                  </ErrorBoundary>
                } />
                <Route path="/chat" element={
                  <ErrorBoundary>
                    <ChatSession />
                  </ErrorBoundary>
                } />
              </Route>

              <Route path="/pricing" element={<Pricing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              <Route path="/legal/terms-of-service" element={<TermsOfService />} />
              <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/legal/refund-policy" element={<RefundPolicy />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/admin/change-password" element={<ChangeAdminPassword />} />

              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/students" element={
                <AdminRoute>
                  <StudentList />
                </AdminRoute>
              } />
              <Route path="/admin/students/:id" element={
                <AdminRoute>
                  <StudentDetail />
                </AdminRoute>
              } />
              <Route path="/admin/sales" element={
                <AdminRoute requiredRole="sales">
                  <SalesDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/coupons" element={
                <AdminRoute requiredRole="sales">
                  <CouponManager />
                </AdminRoute>
              } />
              <Route path="/admin/syllabus" element={
                <AdminRoute requiredRole="teacher">
                  <SyllabusManager />
                </AdminRoute>
              } />
              <Route path="/admin/support" element={
                <AdminRoute requiredRole="teacher">
                  <SupportTicketList />
                </AdminRoute>
              } />
              <Route path="/admin/support/:id" element={
                <AdminRoute requiredRole="teacher">
                  <SupportTicketDetail />
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute requiredRole="super_admin">
                  <AdminManagement />
                </AdminRoute>
              } />

            </Routes>
          </Router>
        </ProfileProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;

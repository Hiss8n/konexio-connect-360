import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LoginPage from './auth/login';
import SignUpPage from './auth/signUp';
import HomePage from './pages/homePage';
import RoleLayout from './layouts/RoleLayout';
import {
  AlumniPartnersPage,
  AlumniTeamsPage,
  DonorDirectoryPage,
  DonorPartnersPage,
  LearnerAssignmentsPage,
  LearnerClassmatesPage,
  LearnerLMSPage,
  LearnerProfilePage,
  LearnerQuizzesPage,
} from './pages/RolePages';
import { useAuthStore } from './store/authStore';

const sendVisitorWebhook = async () => {
  try {
    const response = await fetch('https://hook.us2.make.com/5yg1flixiqx6xxbip21v5btnbsqifchj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        new_visitor: true,
      }),
    });

    const responseText = await response.text();
    const contentType = response.headers.get('content-type') ?? '';
    let data: unknown = responseText;

    if (responseText && contentType.includes('application/json')) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}; ${String(data)}`);
    }

    console.log('Webhook success:', data);
    return data;
  } catch (error) {
    console.error('Webhook failed:', error);
  }
};

function AppShell() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    sendVisitorWebhook();
  }, []);

  const canAccess = (role: 'learner' | 'alumni' | 'donor' | 'partner') =>
    isAuthenticated && user?.account_type === role;

  return (
    <div className="site-shell">
      <Navbar
        onHome={() => navigate('/')}
        onLogin={() => navigate('/login')}
        onSignup={() => navigate('/signup')}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <LoginPage
              onSwitchToSignup={() => navigate('/signup')}
              onBackHome={() => navigate('/')}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignUpPage
              onSwitchToLogin={() => navigate('/login')}
              onBackHome={() => navigate('/')}
            />
          }
        />

        <Route
          path="/learner/*"
          element={
            canAccess('learner') ? (
              <RoleLayout
                role="learner"
                title="Learner portal"
                links={[
                  { to: '/learner/profile', label: 'Profile' },
                  { to: '/learner/quizzes', label: 'Quizzes' },
                  { to: '/learner/assignments', label: 'Assignments' },
                  { to: '/learner/classmates', label: 'Classmates' },
                  { to: '/learner/lms', label: 'LMS' },
                ]}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="profile" element={<LearnerProfilePage />} />
          <Route path="quizzes" element={<LearnerQuizzesPage />} />
          <Route path="assignments" element={<LearnerAssignmentsPage />} />
          <Route path="classmates" element={<LearnerClassmatesPage />} />
          <Route path="lms" element={<LearnerLMSPage />} />
          <Route index element={<Navigate to="/learner/profile" replace />} />
        </Route>

        <Route
          path="/donor/*"
          element={
            canAccess('donor') ? (
              <RoleLayout
                role="donor"
                title="Donor portal"
                links={[
                  { to: '/donor/directory', label: 'Donors & partners' },
                  { to: '/donor/partners', label: 'Partner profiles' },
                ]}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="directory" element={<DonorDirectoryPage />} />
          <Route path="partners" element={<DonorPartnersPage />} />
          <Route index element={<Navigate to="/donor/directory" replace />} />
        </Route>

        <Route
          path="/alumni/*"
          element={
            canAccess('alumni') ? (
              <RoleLayout
                role="alumni"
                title="Alumni portal"
                links={[
                  { to: '/alumni/teams', label: 'Teams' },
                  { to: '/alumni/partners', label: 'Partner profiles' },
                ]}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="teams" element={<AlumniTeamsPage />} />
          <Route path="partners" element={<AlumniPartnersPage />} />
          <Route index element={<Navigate to="/alumni/teams" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;

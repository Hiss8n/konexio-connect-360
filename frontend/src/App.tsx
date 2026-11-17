import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LoginPage from './auth/login';
import SignUpPage from './auth/signUp';
import HomePage from './pages/homePage';

function App() {
  const [view, setView] = useState<'home' | 'login' | 'signup'>('home');

      // 1. The standalone webhook function
const sendVisitorWebhook = async () => {
  try {
    const response = await fetch("https://hook.us2.make.com/5yg1flixiqx6xxbip21v5btnbsqifchj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    console.log("Webhook success:", data);
    return data;
  } catch (error) {
    console.error("Webhook failed:", error);
  }
};
 useEffect(()=>{
    sendVisitorWebhook()
 },[])
  

  const renderContent = () => {
    if (view === 'login') {
      return (
        <LoginPage
          onSwitchToSignup={() => setView('signup')}
          onBackHome={() => setView('home')}
        />
      );
    }

    if (view === 'signup') {
      return (
        <SignUpPage
          onSwitchToLogin={() => setView('login')}
          onBackHome={() => setView('home')}
        />
      );
    }

    return <HomePage />;
  };

  return (
    <div className="site-shell">
      <Navbar
        onHome={() => setView('home')}
        onLogin={() => setView('login')}
        onSignup={() => setView('signup')}
      />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;

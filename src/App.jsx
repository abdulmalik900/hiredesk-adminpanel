import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Login } from './components/Login';
import { DashboardLayout } from './components/DashboardLayout';

function App() {
  const [user, setUser] = useState(() => {
    return sessionStorage.getItem('hiredesk_user') || null;
  });

  const handleLogin = (username) => {
    sessionStorage.setItem('hiredesk_user', username);
    setUser(username);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hiredesk_user');
    setUser(null);
  };

  return (
    <AppProvider>
      {user ? (
        <DashboardLayout username={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </AppProvider>
  );
}

export default App;

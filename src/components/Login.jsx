import { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Artificial delay to make it feel premium & authentic
    setTimeout(() => {
      if (username.toLowerCase() === 'malik' && password === '12345') {
        onLogin(username);
      } else {
        setError('Invalid username or password.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <div className="login-header">
          {/* Brand-new Premium Geometric SVG Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="url(#login-logo-grad)" />
              {/* Geometric Desk and Pipeline Lines */}
              <path d="M18 42V22C18 20.8954 18.8954 20 20 20H44C45.1046 20 46 20.8954 46 22V42" stroke="#744577" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M24 28H40" stroke="#744577" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M24 35H40" stroke="#744577" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M24 42H32" stroke="#744577" strokeWidth="3.5" strokeLinecap="round" />
              {/* Sage Mint Checkmark representing hired candidates */}
              <path d="M37 45L41 49L50 38" stroke="#ACCFA3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="login-logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F0E9B6" />
                  <stop offset="100%" stopColor="#84C5B1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to manage your recruitment portal</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-wrapper">
            <User className="login-input-icon" />
            <input
              type={showUsername ? "text" : "password"}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              disabled={isLoading}
              autoComplete="username"
            />
            <button 
              type="button" 
              className="login-input-toggle"
              onClick={() => setShowUsername(!showUsername)}
              title={showUsername ? "Hide Username" : "Show Username"}
            >
              {showUsername ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="login-input-wrapper">
            <Lock className="login-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button 
              type="button" 
              className="login-input-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};


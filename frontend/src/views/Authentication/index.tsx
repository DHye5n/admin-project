import './style.css';
import { useState } from 'react';

/**
 * Main Authentication Component
 */
export default function Authentication() {
  // State to manage the current view: 'sign-in' or 'sign-up'
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  // Function to toggle between views
  const toggleView = (newView: 'sign-in' | 'sign-up') => {
    setView(newView);
  };

  return (
    <div id="wrapper">
      <div className='auth-wrapper'>
        <div className={`auth-container ${view}`}>
            {/* Sign-Up View */}
            {view === 'sign-in' && <SignInCard />}
            {/* Sign-In View */}
            {view === 'sign-up' && <SignUpCard />}
        </div>

        <div className={`toggle-container ${view}`}>
          {view === 'sign-in' ? (
              <div className="toggle-panel-box">
                <div className='toggle-panel-text'>Hello, Friend!</div>
                <div className='toggle-panel-text'>Sign up now to access all features.</div>
                <button className='hidden' onClick={() => toggleView('sign-up')}>Sign Up</button>
              </div>
          ) : (
              <div className="toggle-panel-box">
                <div className='toggle-panel-text'>Welcome Back!</div>
                <div className='toggle-panel-text'>Sign in to continue.</div>
                <button className='hidden' onClick={() => toggleView('sign-in')}>Sign In</button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sign-Up Component
 */
function SignUpCard() {
  return (
    <div className="sign-up-card">
      <div>Sign up</div>
    </div>
  );
}

/**
 * Sign-In Component
 */
function SignInCard() {
  return (
    <div className="sign-in-card">
      <div>Sign in</div>
    </div>
  );
}

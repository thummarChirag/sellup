import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, updateDoc, increment } from "firebase/firestore";
import Logo from "../../sellup-logo.png";
import RoundLoading from "../Loading/RoundLoading";
import "./Login.css";

function Login() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading,setLoading]=useState(false)
  const history = useHistory()

  // Toast notification function
  const showToast = (message, type = 'error') => {
    // Remove existing toast if any
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add toast styles if not already added
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ef4444;
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          max-width: 400px;
          animation: slideInRight 0.3s ease-out;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .toast.toast-success {
          background: #10b981;
        }
        .toast.toast-error {
          background: #ef4444;
        }
        .toast-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .toast-message {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }
        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }
        .toast-close:hover {
          opacity: 0.8;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .toast.fade-out {
          opacity: 0;
          transform: translateX(100%);
        }
      `;
      document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(toast);

    // Auto remove after 10 seconds with fade out animation
    const timeoutId = setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.classList.add('fade-out');
        setTimeout(() => {
          if (toast && toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }
    }, 10000);

    // Store timeout ID on toast element for cleanup
    toast.dataset.timeoutId = timeoutId;
  };

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault();

    // Clear any existing toasts
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
      const timeoutId = existingToast.dataset.timeoutId;
      if (timeoutId) {
        clearTimeout(parseInt(timeoutId));
      }
      existingToast.remove();
    }

    // Add timestamp for login attempt
    const loginAttemptTime = new Date().toISOString();
    console.log("Login attempt at:", loginAttemptTime);

    signInWithEmailAndPassword(auth, email, password).then((result) => {
      console.log("Login successful:", result.user);
      setLoading(false);

      // Update user's last login time in Firestore
      const userRef = doc(db, "users", result.user.uid);
      updateDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
        loginCount: increment(1)
      }).catch(err => {
        console.log("Could not update login time:", err);
      });

      // Show success toast
      showToast("Login successful! Redirecting to home page...", 'success');

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        history.push("/");
      }, 1500);
    }).catch((error) => {
      setLoading(false)
      console.log("=== LOGIN ERROR DEBUG ===");
      console.log("Login error code:", error.code);
      console.log("Login error message:", error.message);
      console.log("Full error object:", error);
      console.log("Error name:", error.name);
      console.log("Error stack:", error.stack);
      console.log("==========================");

      let errorMessage = "";

      // Check error code first
      if (error.code === 'auth/user-not-found') {
        errorMessage = "User not found. Please check your email or sign up for a new account.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please enter a valid email.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.code === 'auth/user-mismatch') {
        errorMessage = "User not found. Please check your email or sign up for a new account.";
      } else if (error.code === 'auth/invalid-login-credentials') {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with this email using a different sign-in method.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password sign-in is not enabled. Please contact support.";
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = "Authentication service error. Please try again later.";
      } else if (error.code === 'auth/app-not-authorized') {
        errorMessage = "Authentication service error. Please try again later.";
      } else {
        // Check error message content as fallback
        const errorMsg = error.message.toLowerCase();
        console.log("Checking error message content:", errorMsg);

        if (errorMsg.includes('user-not-found') ||
          errorMsg.includes('user not found') ||
          errorMsg.includes('no user record') ||
          errorMsg.includes('there is no user record') ||
          errorMsg.includes('no user found') ||
          errorMsg.includes('user does not exist')) {
          errorMessage = "User not found. Please check your email or sign up for a new account.";
        } else if (errorMsg.includes('wrong-password') ||
          errorMsg.includes('wrong password') ||
          errorMsg.includes('password is invalid') ||
          errorMsg.includes('password is incorrect') ||
          errorMsg.includes('invalid password') ||
          errorMsg.includes('password does not match')) {
          errorMessage = "Incorrect password. Please try again.";
        } else if (errorMsg.includes('invalid-email') ||
          errorMsg.includes('invalid email') ||
          errorMsg.includes('malformed email') ||
          errorMsg.includes('email format')) {
          errorMessage = "Invalid email address. Please enter a valid email.";
        } else if (errorMsg.includes('too many requests') ||
          errorMsg.includes('too many attempts') ||
          errorMsg.includes('rate limit')) {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (errorMsg.includes('network') ||
          errorMsg.includes('connection') ||
          errorMsg.includes('offline')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (errorMsg.includes('firebase') ||
          errorMsg.includes('auth') ||
          errorMsg.includes('authentication')) {
          errorMessage = "Authentication service error. Please try again later.";
        } else {
          // If we still can't determine the error, show a generic message
          errorMessage = "Login failed. Please check your email and password and try again.";
        }
      }

      // Show toast notification only
      showToast(errorMessage, 'error');
    })
  };

  return (
    <>
      {loading && <RoundLoading />}
      <div className="login-container">
        <div className="login-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="login-card">
          <div className="logo-container">
            <img width="200px" height="200px" src={Logo} alt="SellUp Logo" className="logo-image" />
          </div>

          <div className="form-container">
            <h2 className="welcome-text">Welcome Back!</h2>
            <p className="subtitle">Sign in to continue to SellUp</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                <span className="button-text">Sign In</span>
                <div className="button-loader"></div>
              </button>
            </form>

            <div className="signup-link-container">
              <p className="signup-text">
                Don't have an account?
                <Link to="/signup" className="signup-link"> Sign up here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

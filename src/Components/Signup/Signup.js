import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../sellup-logo.png";
import "./Signup.css";
import { auth, db } from "../../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useHistory } from "react-router";
import SignUpLoading from "../Loading/SignUpLoading";

export default function Signup() {
  const history = useHistory();
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");
  let [loading,setLoading]=useState(false)

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

    // Add timestamp for registration attempt
    const registrationAttemptTime = new Date().toISOString();
    console.log("Registration attempt at:", registrationAttemptTime);

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log("Signup successful:", result.user);

        // Update user profile
        updateProfile(result.user, { displayName: name }).then(() => {
          // Create user document in Firestore
          const userRef = doc(db, "users", result.user.uid);
          setDoc(userRef, {
            id: result.user.uid,
            name: name,
            phone: phone,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            loginCount: 1,
            registrationAttemptTime: registrationAttemptTime
          });
        });
      })
      .then(() => {
        setLoading(false);

        // Show success toast
        showToast("Account created successfully! Redirecting to login...", 'success');

        // Redirect after a short delay to show the success message
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      })
      .catch((error) => {
        setLoading(false)
        console.log("=== SIGNUP ERROR DEBUG ===");
        console.log("Signup error code:", error.code);
        console.log("Signup error message:", error.message);
        console.log("Full error object:", error);
        console.log("Error name:", error.name);
        console.log("Error stack:", error.stack);
        console.log("==========================");

        let errorMessage = "";

        // Check error code first
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = "User already exists. This email is already registered. Please try logging in instead.";
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = "Invalid email address. Please enter a valid email.";
        } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password is too weak. Please use a stronger password (at least 6 characters).";
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          errorMessage = "An account already exists with this email using a different sign-in method.";
        } else if (error.code === 'auth/requires-recent-login') {
          errorMessage = "Please log out and log back in to continue.";
        } else if (error.code === 'auth/invalid-api-key') {
          errorMessage = "Authentication service error. Please try again later.";
        } else if (error.code === 'auth/app-not-authorized') {
          errorMessage = "Authentication service error. Please try again later.";
        } else {
          // Check error message content as fallback
          const errorMsg = error.message.toLowerCase();
          console.log("Checking signup error message content:", errorMsg);

          if (errorMsg.includes('email-already-in-use') ||
            errorMsg.includes('email already in use') ||
            errorMsg.includes('already exists') ||
            errorMsg.includes('already registered') ||
            errorMsg.includes('email address is already in use') ||
            errorMsg.includes('account already exists')) {
            errorMessage = "User already exists. This email is already registered. Please try logging in instead.";
          } else if (errorMsg.includes('invalid-email') ||
            errorMsg.includes('invalid email') ||
            errorMsg.includes('malformed email') ||
            errorMsg.includes('email format')) {
            errorMessage = "Invalid email address. Please enter a valid email.";
          } else if (errorMsg.includes('weak-password') ||
            errorMsg.includes('weak password') ||
            errorMsg.includes('password is too weak') ||
            errorMsg.includes('password should be at least')) {
            errorMessage = "Password is too weak. Please use a stronger password (at least 6 characters).";
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
            errorMessage = "Registration failed. Please check your information and try again.";
          }
        }

        // Show toast notification only
        showToast(errorMessage, 'error');
      });
  };

  return (
    <>
      {loading && <SignUpLoading />}
      <div className="signup-container">
        <div className="signup-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>

        <div className="signup-card">
          <div className="logo-container">
            <img width="200px" height="200px" src={Logo} alt="SellUp Logo" className="logo-image" />
          </div>

          <div className="form-container">
            <h2 className="welcome-text">Join SellUp Today!</h2>
            <p className="subtitle">Create your account and start selling</p>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    placeholder="Enter your full name"
                    required
                  />
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Phone</label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    name="phone"
                    placeholder="Enter your phone number"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    placeholder="Create a strong password"
                    required
                  />
                  <div className="input-focus-border"></div>
                </div>
              </div>

              <button type="submit" className="signup-button" disabled={loading}>
                <span className="button-text">Create Account</span>
                <div className="button-loader"></div>
              </button>
            </form>

            <div className="login-link-container">
              <p className="login-text">
                Already have an account?
                <Link to="/login" className="login-link"> Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

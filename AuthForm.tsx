import React, { useState } from "react";
import { auth } from "../Firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import "./AuthForm.css";

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await sendEmailVerification(userCredential.user);
        alert(
          "Registration successful! Please verify your email before logging in."
        );
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (!userCredential.user.emailVerified) {
          alert("Please verify your email before logging in.");
          return;
        }
        alert("Login successful!");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google login successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-form-content">
        <h1>Welcome to Sports Dunia</h1>
        <p>
          Discover the world of sports, stay updated with live scores, and
          connect with fellow enthusiasts. Join us today!
        </p>
        <div className="auth-form-container">
          <h2>{isRegister ? "Register" : "Login"}</h2>
          <form onSubmit={handleEmailAuth}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="auth-button">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <button onClick={handleGoogleAuth} className="google-auth-button">
            Login with Google
          </button>
          <p>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

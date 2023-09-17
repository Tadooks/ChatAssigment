"use client";
import React, { useState } from 'react';
import firebase from '../Firebase/firebase_config';
import { auth } from '../Firebase/firebase_config';
import {signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, signOut} from 'firebase/auth'


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle email/password login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User is logged in
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // User is logged in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleEmailLogin}>Login with Email/Password</button>
      <button onClick={handleGoogleSignIn}>Login with Google</button>
    </div>
  );
};

export default Login;
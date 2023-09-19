"use client";
import React, { useState } from 'react';
import {signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, signOut} from 'firebase/auth'
import { auth } from '@/Firebase/firebase_config';
import Link from 'next/link';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle email/password login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    
      if(auth.currentUser){
        console.log(auth.currentUser)
        if(!auth.currentUser.emailVerified){
            signOut(auth);
            alert("Please verify your email!");
        }
      }
      else{
        alert("Invalid email or password!")
      }
      alert("Logged in successfully!")

      // User is logged in
    } catch (error) {
      alert('Error signing in:' + error);
    }
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in successfully!")
      // User is logged in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  {(() => {
    console.log(auth);
    console.log(auth.currentUser?.email);
    return null;
  })()}

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
      <button onClick={handleSignOut}>Sign out</button>

      Currently logged in: {auth.currentUser?.email}
      Verified: {auth.currentUser?.emailVerified}

        <Link href="/register">
            Register
        </Link>
    </div>
  );
};

export default Login;
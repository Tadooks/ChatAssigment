"use client";
import React, { useState } from 'react';
import {signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, signOut} from 'firebase/auth'
import { auth } from '@/Firebase/firebase_config';
import Link from 'next/link';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, TextField  } from "@mui/material";

import {useRouter} from 'next/navigation';


import {makeStyles} from "@mui/styles"



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  
  //LOADING NEEDED SO THAT AFTER LOGIN DATA APPEARS  

  // Function to handle email/password login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    
      if (auth.currentUser) {
        if (!auth.currentUser.emailVerified) {
          signOut(auth);
          alert("Please verify your email!");
        } 
        else {
          // The user is logged in successfully, so display the message.
          alert("Logged in successfully!");
          window.location.reload();
          // router.push('/');
        }
      } else {
        alert("Invalid email or password!");
      }
      

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
      window.location.reload();//gmail gets desynced and doesnt load fast enough. Need loading screen to wait until data loads?
      // User is logged in
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // {(() => {
  //   console.log(auth);
  //   console.log(auth.currentUser?.email);
  //   return null;
  // })()}

  //forgor password

  //reset password


  return (
    <div className='center'>
      {/* <ThemeProvider theme={theme}> */}
      <div className='auth'>
      <h2>Login</h2>
      <div className='space'>
        <label>
          <TextField 
            id="outlined-basic" 
            label="Email" 
            variant="outlined" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
      </div>
      <div  className='space'>
        <label>
          <TextField 
            id="outlined-basic" 
            label="Password" 
            variant="outlined" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </label>
      </div>
      <div  className='space'>
        <Button variant="contained" onClick={handleEmailLogin}>Login</Button>
      </div>
      <div  className='space'>
        <Button variant="contained" onClick={handleGoogleSignIn}>Login with Google</Button>
      </div>

      <div  className='space'>
        <Link href="/register">
        <Button variant="contained">Register</Button>
        </Link>
      </div>
      <div  className='space'>
        <Link href="/forgotpassword">
        <Button variant="contained">Forgot password</Button>
        </Link>
      </div>

      <div  className='space'>
        Currently logged in: {auth.currentUser?.email}
        Verified: {auth.currentUser?.emailVerified.toString()}
      </div>
      <div  className='space'>
        <Button variant="contained" onClick={handleSignOut}>Sign out</Button>
      </div>

      </div>
      {/* </ThemeProvider> */}
    </div>
  );
};

export default Login;
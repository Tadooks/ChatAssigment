"use client";
import { useState } from 'react';
import { auth } from '@/Firebase/firebase_config';
import {createUserWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth'


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth,email, password);
      // Registration successful; you can redirect to a different page
      
      alert('Registration successful! An email has been sent.');
      // auth.currentUser
      if(auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
        .then(async () => {
          await signOut(auth)//sign out user, so he could only login when verified.
          signOut(auth)
          window.location.reload();
        }).catch((err) => alert(err.message))
      }
      // sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.log(error)
    }
  };
  

  return (
    <div>
      <h1>Register</h1>
      Email:
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      Password:
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
}
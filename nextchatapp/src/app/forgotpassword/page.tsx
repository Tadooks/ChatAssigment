"use client";
import React, { useState } from 'react';
import {sendPasswordResetEmail} from 'firebase/auth'
import { auth } from '@/Firebase/firebase_config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your inbox.');
      router.push('/profile');
    } catch (error) {
      alert(error);
    }
  };


  //reset password

  return (
    <div>
        <Link href="/profile">
            Back
        </Link>
      <h1>Forgot Password</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Reset Password</button>
    </div>
  );
};

export default ForgotPassword;
"use client";
import React, { useState } from 'react';
import {sendPasswordResetEmail} from 'firebase/auth'
import { auth } from '@/Firebase/firebase_config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, TextField  } from "@mui/material";

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
    <div className='center'>
        <div className='auth'>
            <div className='space'>
                <Link href="/profile">
                    <Button variant="contained">Back</Button>
                </Link>
            </div>
            <h1>Forgot Password</h1>
            <div className='space'>
                <TextField 
                    id="outlined-basic" 
                    label="Email" 
                    variant="outlined" 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <Button variant="contained" onClick={handleForgotPassword}>Reset Password</Button>
        </div>
    </div>
  );
};

export default ForgotPassword;
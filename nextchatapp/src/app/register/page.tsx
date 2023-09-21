"use client";
import { useState } from 'react';
import { auth } from '@/Firebase/firebase_config';
import {createUserWithEmailAndPassword, sendEmailVerification, signOut} from 'firebase/auth'
import { Button, TextField  } from "@mui/material";
import {useRouter} from 'next/navigation';
import Link from 'next/link';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

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
          router.push('/profile');
          window.location.reload();
          router.push('/profile');
        }).catch((err) => alert(err.message))
      }
      // sendEmailVerification(auth.currentUser);
      router.push('/profile');
    } catch (error) {
      alert(error)
    }
  };
  

  return (
    <div className='center'>
      <div className='auth'>
      <div className='space'>
                <Link href="/profile">
                    <Button variant="contained">Back</Button>
                </Link>
            </div>
      <h1>Register</h1>
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
      <div className='space'>
        <TextField
          id="outlined-basic" 
          label="Password" 
          variant="outlined" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button variant="contained" onClick={handleRegister}>Register</Button>
      {error && <p>{error}</p>}
      </div>
    </div>
  );
}
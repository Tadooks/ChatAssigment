"use client";
import Image from 'next/image'
// import styles from './page.module.css'

import firebase from '../Firebase/firebase_config';
import { getFirestore, collection, getDocs, onSnapshot, QuerySnapshot, DocumentData, addDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {useRouter} from 'next/navigation';

import { auth } from '@/Firebase/firebase_config';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, TextField  } from "@mui/material";


export default function Chat(){
  interface ChatMessageData {
    id: string;
    date: Date;
    message: string;
    username: string;
  }


  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false); // Track if user is logged in
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if chat data is loaded


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [allowView, setAllowView] = useState(false);
  

  const router = useRouter();

  //message length
  const messageLengthLimit=30;
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const db = getFirestore(firebase);
    const chatCollection = collection(db, 'messages');

    

    // console.log("HUH" + JSON.stringify(chatCollection))
    // Set up a real-time listener for the chat collection
    const unsubscribe = onSnapshot(chatCollection, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const updatedMessages: ChatMessageData[] = [];
      querySnapshot.forEach((doc) => {
        
        const data = doc.data();
        const date = data.timestamp.toDate();//converting timestamp to readable format date

        const chatMessageData: ChatMessageData = {
          id: doc.id,
          date,
          message: data.message,
          username: data.username
        }
        
        updatedMessages.push(chatMessageData);
      });

      // Sort messages by date in ascending order
      updatedMessages.sort((a, b) => a.date.getTime() - b.date.getTime());
    
      setMessages(updatedMessages);

      if(auth.currentUser?.email){
        setCurrentUserName(auth.currentUser?.email.split('@')[0])
      }

      if(!auth.currentUser?.emailVerified){

        alert("User is not signed in!")
        router.push('/profile');
      }
      setLoading(false);
      console.log("HUH" + JSON.stringify(updatedMessages))
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);



  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };


  
  
  const sendMessage = async () => {
    // Check if the newMessageData is not empty
    if (messageInput.trim() === '') {
      alert("Message is empty")
      return;
    }
    if (!auth.currentUser?.emailVerified) {
      alert("Please login first!")
      return;
    }

    // Check if the message length exceeds a certain limit (e.g., 200 characters)
    if (messageInput.length > messageLengthLimit) {
      alert("Message is too long. Please keep it under " +{messageLengthLimit} + " characters.");
      return;
    }
  
    const db = getFirestore(firebase);
    const chatCollection = collection(db, 'messages');


    try {
      // Add the new message to Firestore
      await addDoc(chatCollection, {
        timestamp: Timestamp.now(),
        username: currentUserName,
        message: messageInput,
        
        
        //sent message properties
      });
  
      // Clear the input field
      setMessageInput('');
    } catch (error) {
      alert('Error sending message:' + error);
    }
  };




  //debugging
  {(() => {
    console.log(messages);
    return null; // This will not render anything to the UI
  })()}

  return (
    <main>
      <div className='center2'>
      {loading ?(
          <p>Loading...</p>
      ) : error ? (
          <p>An error occured</p>
      ):(
      <>

      
      {(() => {
        if (auth.currentUser?.emailVerified) {
          return(
            <div className='chat-container'>
              <div className="chat-messages">
                {messages.map((messageData) => (
                  
                  <div key={messageData.id}>
                    <div className='messageDate'>
                      {(Object(Object(messageData).date.toLocaleString()))}
                    </div>
                    
                    <div className='messageName'>
                      {" "+(Object(messageData).username)}
                    </div>
                    <div className='messageMessage'>
                      {" "+(Object(messageData).message)}
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          );
          
        }
        "Loading..."
        return null;
      })()}


      <br></br>

        <div className='chat-input'>
          <div className="message-field">
            <TextField
              type="text"
              placeholder="Type your message here"
              value={messageInput}
              onChange={handleMessageChange}
              inputProps={{maxLength: messageLengthLimit}}
              fullWidth
              size="small"
            />
          </div>

          <div className='chat-send'>
            <Button 
              variant="outlined" 
              onClick={sendMessage}>
                Send
            </Button>
          </div>
        </div>

        </>
        )}
      </div>
    </main>
  )

}

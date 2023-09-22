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
  const messageLengthLimit=200;
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const db = getFirestore(firebase);
    const chatCollection = collection(db, 'messages');


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

        var elem = document.getElementById('chat-messages'); // Use the ID you assigned

        


        if(elem){
          elem.scrollTop = elem.scrollHeight;
        }
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
    }, (error) => {
      // Handle Firestore errors
      console.error('Firestore error:', error);
  
      // Check if the error is a permission-denied error
      if (error.code === 'permission-denied') {
        alert('Firestore security rules deny reading. Please log in!');
        router.push('/profile');
      }
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

    testFirestoreSecurityRules();
    if (messageInput.trim() === '') {
      alert("Message is empty")
      return;
    }
    if (!auth.currentUser?.emailVerified) {
      alert("Please login first!")
      return;
    }

    // Check if the message length exceeds a certain limit
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

      var elem = document.getElementById('chat-messages'); // Use the ID you assigned
        if(elem){
          elem.scrollTop = elem.scrollHeight;
        }
  
      // Clear the input field
      setMessageInput('');
    } catch (error) {
      alert('Error sending message:' + error);
    }
  };


  //SCROLL TO BOTTOM CHAT
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);






  // Function to test Firestore security rules
  const testFirestoreSecurityRules = async () => {
    try {
      const db = getFirestore(firebase);
      const chatCollection = collection(db, 'messages');

      // Attempt to read data (change the path as needed)
      const querySnapshot = await getDocs(chatCollection);

      querySnapshot.forEach((doc) => {
        console.log('Document ID:', doc.id);
        console.log('Data:', doc.data());
      });

      console.log('Read success: Firestore security rules allow reading.');
    } catch (error) {
      alert('Read error: Firestore security rules denied. Please log in!' + " " + error);
      router.push('/profile');

    }
  };

  // Function to test Firestore security rules for writing
  const testFirestoreSecurityRulesForWriting = async () => {
    try {
      const db = getFirestore(firebase);
      const chatCollection = collection(db, 'messages');

      // Define the data you want to write (modify as needed)
      const dataToWrite = {
        timestamp: Timestamp.now(),
        username: currentUserName,
        message: 'Test message', // Modify with the actual message you want to write
      };

      // Attempt to add a new document (change the path as needed)
      const docRef = await addDoc(chatCollection, dataToWrite);

      console.log('Write success: Firestore security rules allow writing.');
      console.log('New document ID:', docRef.id);
    } catch (error) {
      alert('Write error: Firestore security rules denied. Please log in!' + " " + error);
      router.push('/profile');
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

      {/*----------------------READ-WRITE PERMISSION TEST---------------------- */}
      {/* <button onClick={testFirestoreSecurityRulesForWriting}>
          Test Firestore Security Rules
        </button>

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
        </div> */}
      {/*---------------------------------------------------------------------- */}


      {loading ?(
          <div>Loading...</div>
      ) : error ? (
          <div>An error occured</div>
      ):(
      <>

      
      {(() => {
        if (auth.currentUser?.emailVerified) {
          return(
            <div className='chat-container'>
              <div className="chat-messages">
                {messages.map((messageData) => (
                  <>
                    <div
                      className={`${ auth.currentUser?.email?.split('@')[0] === messageData.username ? 'highlighted-message' : 'other-message'}`}
                      key={messageData.id}
                    >

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
                    <span ref={messagesEndRef} />
                  </>
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

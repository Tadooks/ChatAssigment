"use client";
import Image from 'next/image'
// import styles from './page.module.css'

import firebase from '../Firebase/firebase_config';
import { getFirestore, collection, getDocs, onSnapshot, QuerySnapshot, DocumentData, addDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import Login from './Login';

export default function ChatPage(){
  interface ChatMessageData {
    id: string;
    date: Date;
    message: string;
    username: string;
  }


  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const router = useRouter();

  //message length
  const messageLengthLimit=30;

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

    // Check if the message length exceeds a certain limit (e.g., 200 characters)
    if (messageInput.length > messageLengthLimit) {
      alert("Message is too long. Please keep it under 200 characters.");
      return;
    }
  
    const db = getFirestore(firebase);
    const chatCollection = collection(db, 'messages');
  
    try {
      // Add the new message to Firestore
      await addDoc(chatCollection, {
        timestamp: Timestamp.now(),
        username: "testUser",
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
      <button type="button" onClick={() => router.push('/login')}>
        Woop
      </button>
      Chat messages:
      <div>
        {messages.map((messageData) => (
          
          <div key={messageData.id}>
            {(Object(Object(messageData).date.toLocaleString()))}
            {" "+(Object(messageData).username)}
            :
            {" "+(Object(messageData).message)}
            

            {(() => {
              console.log("Time: " + Object(Object(messageData).date.toLocaleString()));
              // Point3d(Object(smartTableList[i][2])["X"],Object(smartTableList[i][2])["Y"],Object(smartTableList[i][2])["Z"])
              return null;
            })()}
            
          </div>
        ))}

        
      </div>

      <br></br>
      <div>
        Type your message here:
        <input
          type="text"
          placeholder="Type your message here"
          value={messageInput}
          onChange={handleMessageChange}
          maxLength={messageLengthLimit}
        />
        <button onClick={sendMessage}>Send</button>
      </div>



      <Login/>
    
    
    </main>
  )

}

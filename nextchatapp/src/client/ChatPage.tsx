"use client";
import Image from 'next/image'
// import styles from './page.module.css'

import firebase from '../Firebase/firebase_config';
import { getFirestore, collection, getDocs, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function ChatPage(){
  interface ChatMessage {
    id: string;
    text: string;
    // Add other message properties as needed
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const db = getFirestore(firebase);
    const chatCollection = collection(db, 'messages');
    // console.log("HUH" + JSON.stringify(chatCollection))
    // Set up a real-time listener for the chat collection
    const unsubscribe = onSnapshot(chatCollection, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const updatedMessages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        updatedMessages.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(updatedMessages);

      console.log("HUH" + JSON.stringify(updatedMessages))
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  messages.map(message =>
    console.log("Yipee" + (Object(message).message)
  ));

  // {(() => {
  //   console.log(messages);
  //   return null; // This will not render anything to the UI
  // })()}

  return (
    <main>
      
      Chat messages:
      <div>
        {messages.map((message) => (
          
          <div key={message.id}>
            {(Object(message).message)}
            
          </div>
        ))}

        
      </div>
      
      <br></br>
      <div>
        Type your message here:
      </div>
    </main>
  )

}

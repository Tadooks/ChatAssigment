import  { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

//move to ENV file
// const firebaseConfig=({
//   apiKey: process.env.REACT_APP_FIREBASE_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: "-",
//   messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// });

// Your web app's Firebase configuration


const firebaseConfig = {
  apiKey: "AIzaSyDTndufnD_nyAvka5YKVwzPKjET4clf4hw",
  authDomain: "chatapp-7e034.firebaseapp.com",
  projectId: "chatapp-7e034",
  storageBucket: "chatapp-7e034.appspot.com",
  messagingSenderId: "610794415576",
  appId: "1:610794415576:web:d793c370851ec6f1ec3ead",
  measurementId: "G-N9ZJG2LPTX"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;

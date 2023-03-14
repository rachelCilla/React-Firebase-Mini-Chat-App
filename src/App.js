import React from "react";
import "./App.css";
// FIREBASE SDK (software dev kit) help developers build apps that integrate with Firebase
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// HOOKS
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

// initialize firebase app
firebase.initializeApp({});
// reference to the auth and firestore SDKs as global variables
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;

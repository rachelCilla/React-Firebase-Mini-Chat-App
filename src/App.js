import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { render } from "@testing-library/react";

firebase.initializeApp({
  apiKey: "AIzaSyCSTQVzhFXYWW6ESfCRSdFlAqY2tg6zJAA",
  authDomain: "react-firebase-mini-chat-app.firebaseapp.com",
  projectId: "react-firebase-mini-chat-app",
  storageBucket: "react-firebase-mini-chat-app.appspot.com",
  messagingSenderId: "620424410305",
  appId: "1:620424410305:web:076bd9234cc0d7b52dd040",
  measurementId: "G-S2X8N43D1C",
});

// Use Firebase Authentication in your app
// For example, you can sign in a user with Google:

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // HOW TO TELL IF USER IS LOGGED IN OR NOT: useAuthState() hook
  // if a user is logged in, useAuthState() returns an array with the user object
  // if a user is NOT logged in, useAuthState() returns an array with null
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header"></header>
      {/* IF USER IS SIGNED IN : show chatroom. USER NOT SIGNED IN: show sign in section */}
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

// SIGN IN WITH GOOGLE COMPONENT
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    {
      console.log("messages");
    }
  };
  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
}
// SIGN OUT COMPONENT
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

// CHATROOM COMPONENT
function ChatRoom() {
  // reference to the messages collection in firestore
  const messagesRef = firestore.collection("messages");
  // query to get the messages from firestore
  const query = messagesRef.orderBy("createdAt").limit(25);
  // make this query and listen to any updates in real time with the useCollectionData() hook
  //  returns an array of ojects; each object is the chat message in the data base
  const [messages] = useCollectionData(query, { idField: "id" });
  return (
    <>
      {console.log("messages")}
      <div>
        <p>hi</p>
        {/* map through the messages array and render a ChatMessage component for each message */}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
    </>
  );
}
function ChatMessage(props) {
  const { text, uid } = props.message;
  return <p>TEST{text}</p>;
}

export default App;

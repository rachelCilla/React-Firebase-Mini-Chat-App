import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
      <header className="App-header">
        <SignOut />
      </header>
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
  const dummy = useRef();
  // reference to the messages collection in firestore
  const messagesRef = firestore.collection("messages");
  // query to get the messages from firestore
  const query = messagesRef.orderBy("createdAt").limit(25);
  // make this query and listen to any updates in real time with the useCollectionData() hook
  //  returns an array of ojects; each object is the chat message in the data base
  const [messages] = useCollectionData(query, { idField: "id" });
  // stateful variable to store the message
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    // prevent the default behavior of the form(when the user presses enter, the page refreshes)
    e.preventDefault();

    // get the current user
    const { uid, photoURL } = auth.currentUser;

    // add the message to the database
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    // whenever the user sends a message, scroll the newest message into view
    dummy.current.scrollIntoView({ behavior: "smooth" });
    // clear the form
    setFormValue("");
  };

  return (
    <>
      <main>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        ) : (
          <p>No messages yet</p>
        )}
        {/* used to scroll the newest message into view */}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        {/* whenever the user types into the form, it triggers to the change event*/}
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // we need to distinguish between the user's messages and other messages
  // if the user's uid is the same as the message's uid, then the message is from the user
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <>
      {/* className is either "message sent" or "message received" to distinguish
      between the user's messages and other messages */}
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
      {/* FORM- a feature for users to type messages. BUTTON to submit message */}
    </>
  );
}

export default App;

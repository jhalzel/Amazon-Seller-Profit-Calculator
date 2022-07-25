//firebase version_8
// import firebase from 'firebase/app'
// import 'firebase/firestore'
// import 'firebase/auth'

/* firebase version_9 */
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAz1_gYoLvYk0v5s7n_JjxQnlEt03VG21w",
  authDomain: "fba-profit-tracker.firebaseapp.com",
  projectId: "fba-profit-tracker",
  storageBucket: "fba-profit-tracker.appspot.com",
  messagingSenderId: "1053162066651",
  appId: "1:1053162066651:web:0ae9402fed4273e65d72fe",
};

// init firebase (old)
// firebase.initializeApp(firebaseConfig)

// init firebase (new)
// connects to firebase backend
initializeApp(firebaseConfig);

// init services old
// const projectFirestore = firebase.firestore()
// const projectAuth = firebase.auth()

// initializes services (version 9)
const database = getFirestore();
const auth = getAuth();

// timestamp
const timestamp = serverTimestamp();

export { database, auth, timestamp };

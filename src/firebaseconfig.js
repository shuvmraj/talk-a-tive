import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEmwvTEwoiyk2PLrfuy2vMCG0y0dC-2u0",
  authDomain: "cutpaste-554f6.firebaseapp.com",
  databaseURL: "https://cutpaste-554f6-default-rtdb.firebaseio.com",
  projectId: "cutpaste-554f6",
  storageBucket: "cutpaste-554f6.appspot.com",
  messagingSenderId: "374693823984",
  appId: "1:374693823984:web:13a316c8ad0126890d8935",
  measurementId: "G-D31KKZFWSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, onChildAdded };

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAJkcNq8_QVJs1-2hqGIb4z11w7Q2Zx3w0",
  authDomain: "talkup-655f0.firebaseapp.com",
  databaseURL: "https://talkup-655f0-default-rtdb.firebaseio.com",
  projectId: "talkup-655f0",
  storageBucket: "talkup-655f0.appspot.com",
  messagingSenderId: "68034554323",
  appId: "1:68034554323:web:d72b162dcc5caf33bca726",
  measurementId: "G-TP3L1XE5M7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
export default firebaseConfig;

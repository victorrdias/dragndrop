import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDredpXJ8DLKdiWf0MumegXqAkbqcjrBg",
  authDomain: "firedrop-test.firebaseapp.com",
  projectId: "firedrop-test",
  storageBucket: "firedrop-test.appspot.com",
  messagingSenderId: "632749017779",
  appId: "1:632749017779:web:396e1cb164cf58f6c47ec6",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
export { app, db, storage };

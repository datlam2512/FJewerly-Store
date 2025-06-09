import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig1 = {
  apiKey: "AIzaSyCrQZdclDxp4rBsvYvpz5EJ3c0xGKaO8hA",
  authDomain: "imsd-5d4b3.firebaseapp.com",
  projectId: "imsd-5d4b3",
  storageBucket: "imsd-5d4b3.appspot.com",
  messagingSenderId: "796113946915",
  appId: "1:796113946915:web:a3de301d75e2e272d46496"
};

const app1 = initializeApp(firebaseConfig1);
export const db = getFirestore(app1);
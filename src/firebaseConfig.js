// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOuQ3s4GSyzTE-jf-vJWmBR_FMs5hgmyU",
  authDomain: "shukri-dc819.firebaseapp.com",
  projectId: "shukri-dc819",
  storageBucket: "shukri-dc819.firebasestorage.app",
  messagingSenderId: "909858770408",
  appId: "1:909858770408:web:af1bbafb56d945856c285d",
  measurementId: "G-E5FFBGHYVC"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
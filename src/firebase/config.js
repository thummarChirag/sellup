import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
// const firebaseConfig = {
//     apiKey: "AIzaSyCggZCcBun0cwNfOWGC2K8pZcgIRWMfqwY",
//     authDomain: "olx-sijeesh.firebaseapp.com",
//     projectId: "olx-sijeesh",
//     storageBucket: "olx-sijeesh.appspot.com",
//     messagingSenderId: "767411886432",
//     appId: "1:767411886432:web:2ef6862afc88f2c423a605",
//     measurementId: "G-4ELNR9DJHL"
//   };
const firebaseConfig = {
  apiKey: "AIzaSyDSdo8hr_kQVK4tgdMnKNDzn0vq6hwOtwE",
  authDomain: "sellup-fdede.firebaseapp.com",
  projectId: "sellup-fdede",
  storageBucket: "sellup-fdede.firebasestorage.app",
  messagingSenderId: "15420218676",
  appId: "1:15420218676:web:46ca70689d6487d2c69961",
  measurementId: "G-NY5Y14K8XC"
};

  export const Firebase= firebase.initializeApp(firebaseConfig)//named export
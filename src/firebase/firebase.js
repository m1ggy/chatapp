import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/app';

var firebaseConfig = {
  apiKey: 'AIzaSyAcDiWnt92s4IM47pblIV6KwKBLVb3pnCg',
  authDomain: 'chatapp-3102a.firebaseapp.com',
  projectId: 'chatapp-3102a',
  storageBucket: 'chatapp-3102a.appspot.com',
  messagingSenderId: '377011669835',
  appId: '1:377011669835:web:8ef620fa46dd32a36af6ce',
};

export const firebaseapp = firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

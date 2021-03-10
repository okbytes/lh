import firebase from "firebase/app"
import "firebase/auth"

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`
  })
}

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  firebase.auth().useEmulator("http://localhost:9099/")
}

export default firebase

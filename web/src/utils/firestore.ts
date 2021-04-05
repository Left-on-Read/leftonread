import 'firebase/firestore'

import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

let db: firebase.firestore.Firestore | null = null

export function initFirestore() {
  firebase.initializeApp(firebaseConfig)
  db = firebase.firestore()
}

export async function writeEmailToFirestore(email: string) {
  if (!db) {
    return
  }
  return db.collection('email').add({
    email,
  })
}

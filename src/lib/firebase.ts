import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC6-AdU8Rl9GY5CzL-Unt87pqW5zg8W37E',
  authDomain: 'zisthweb.firebaseapp.com',
  projectId: 'zisthweb',
  storageBucket: 'zisthweb.firebasestorage.app',
  messagingSenderId: '1012797052059',
  appId: '1:1012797052059:web:1253f127edee29bd50223e',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

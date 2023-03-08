// interface FirebaseConfig {
//   apiKey?: string;
//   authDomain: string;
//   projectId: string;
//   storageBucket: string;
//   messagingSenderId?: string;
//   appId?: string;
// }
// firebaseConfig object is of type string | undefined, but the FirebaseConfig interface expects a value of type string for the apiKey property (and the other properties as well)
// interfaces are not supported in JS (only TS), so I can't use the interface to define the type of firebaseConfig

// const firebaseConfig: FirebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: 'prompt-guessr.firebaseapp.com',
//   projectId: 'prompt-guessr',
//   storageBucket: 'prompt-guessr.appspot.com',
//   messagingSenderId: process.env.FIREBASE_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'prompt-guessr.firebaseapp.com',
  projectId: 'prompt-guessr',
  storageBucket: 'prompt-guessr.appspot.com',
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default firebaseConfig;
export { db, app };

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {
  FirebaseAdapterConfig,
  FirestoreAdapter,
} from '@next-auth/firebase-adapter';
import firebaseConfig from '@/firebase.config';
import 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
// import { cert } from 'firebase-admin/app';

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app'; // import firebase from 'firebase/app'; didn't work because it is not v9 beta compatible
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { credential } from 'firebase-admin';

// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  adapter: FirestoreAdapter(), // using the GOOGLE_APPLICATION_CREDENTIALS environment variable
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
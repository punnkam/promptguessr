import NextAuth, { NextAuthOptions } from 'next-auth';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import firebase from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import GoogleProvider from 'next-auth/providers/google';
import { initializeApp } from '@firebase/app';
import { getAnalytics } from 'firebase/analytics';
// import firebase from 'firebase/app';

import 'firebase/auth';

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: 'prompt-guessr.firebaseapp.com',
//   projectId: 'prompt-guessr',
//   storageBucket: 'prompt-guessr.appspot.com',
//   messagingSenderId: process.env.FIREBASE_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAaJJ3sXKYTqHEPjnm6cjp-wKaCFa97ifI',
  authDomain: 'prompt-guessr.firebaseapp.com',
  projectId: 'prompt-guessr',
  storageBucket: 'prompt-guessr.appspot.com',
  messagingSenderId: '542920157952',
  appId: '1:542920157952:web:d3936317001cb05f64e1e5',
  measurementId: 'G-38XPQ1CGNV',
};


const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientSecret) {
  throw new Error('Google client secret not set');
}

const clientId = process.env.GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error('Google client ID not set');
}


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  debug: true,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
  adapter: FirestoreAdapter(firebaseConfig),
};

export default (req: NextApiRequest, res: NextApiResponse<any>) =>
  NextAuth(req, res, authOptions);

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// to export authOptions, write this code
// export default authOptions;

// import { signUp } from '@/firebase/auth/signup';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';

// import { app } from '../../../app/firebase.config';
import * as firestoreFunctions from 'firebase/firestore';

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    // @ts-ignore
    apiKey: process.env.FIREBASE_API_KEY,
    appId: process.env.FIREBASE_APP_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  }),
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // "are you sure you want to sign out?"
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user', // redirect to new user page for first time on user sign
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
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
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prompt, Error } from './types';

import { initializeApp } from 'firebase/app';
import {
    getDoc,
    getFirestore,
    doc,
    getCountFromServer,
    collection,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'prompt-guessr.firebaseapp.com',
    projectId: 'prompt-guessr',
    storageBucket: 'prompt-guessr.appspot.com',
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a random prompt from the firebase store
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Prompt | Error>
) {
    try {
        // TODO: Change to 1000 or something
        const promptCount: number = 950;

        // Pick a random prompt from the database
        const randomPrompt: number = Math.floor(
            Math.random() * (promptCount + 1)
        );

        const prompt = await getDoc(
            doc(db, 'prompts', randomPrompt.toString())
        );

        // If prompt exists, return it
        if (prompt.exists()) {
            const promptResult = prompt.data();

            // Convert document data to Prompt
            const promptObj: Prompt = {
                pid: randomPrompt.toString(),
                prompt: promptResult.prompt,
                image: promptResult.image,
                length: promptResult.length,
                hint_words: promptResult.hint_words,
            };
            res.status(200).json(promptObj);
        } else {
            res.status(400).json({ message: 'No such document!' });
        }
    } catch (e: any) {
        res.status(400).json({ message: e });
    }
}

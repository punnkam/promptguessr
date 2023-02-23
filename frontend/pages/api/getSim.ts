// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prompt, Error } from './types';
import { Configuration, OpenAIApi } from 'openai';
import { initializeApp } from 'firebase/app';
import { getDoc, getFirestore, doc } from 'firebase/firestore';

// Initialize Firebase and Firestore
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

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Get similarity score between prompt and guess
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Prompt | Error>
) {
    try {
        const { pid } = req.query;
        const { guess } = req.body;
        const completion = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: guess,
        });
        console.log(completion.data.data[0].embedding);
        //TODO finish this

        if (!pid) {
            res.status(400).json({ message: 'No prompt id provided' });
            return;
        }

        if (!guess) {
            res.status(400).json({ message: 'No guess provided' });
            return;
        }

        const prompt = await getDoc(doc(db, 'prompts', pid as string));
        if (prompt.exists()) {
            // Call OpenAI API to get similarity score
        } else {
            res.status(404).json({ message: `Prompt ${pid} not found` });
        }
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

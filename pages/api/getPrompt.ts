// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prompt, Error } from './types';

import { initializeApp } from 'firebase/app';
import { getDoc, getFirestore, doc } from 'firebase/firestore';

import applyRateLimit from '../../utils/rateLimiter'; // https://kittygiraudel.com/2022/05/16/rate-limit-nextjs-api-routes/

import firebaseConfig from '../../firebase.config';
import { app, db } from '../../firebase.config';

// Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Get a random prompt from the firebase store
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Prompt | Error>
) {
    try {
        await applyRateLimit(req, res, 100);
    } catch {
        res.status(429).json({ message: 'Too many requests!' });
        return;
    }

    try {
        // TODO: Change to 1000 or something
        const promptCount: number = 950;

        // Pick a random prompt from the database
        let randomPrompt: number = Math.floor(
            Math.random() * (promptCount + 1)
        );

        let prompt = await getDoc(doc(db, 'prompts', randomPrompt.toString()));

        if (!prompt.exists()) {
            randomPrompt = Math.floor(Math.random() * (promptCount + 1));
            prompt = await getDoc(doc(db, 'prompts', randomPrompt.toString()));
        }

        // If prompt exists, return it
        if (prompt.exists()) {
            const promptResult = prompt.data();

            // Convert document data to Prompt
            const promptObj: Prompt = {
                pid: randomPrompt.toString(),
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

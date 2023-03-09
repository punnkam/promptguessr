// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { SubmitResponse, Error } from './types';
import { Configuration, OpenAIApi } from 'openai';
import { initializeApp } from 'firebase/app';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { addScore } from './addScore';

import applyRateLimit from '../../utils/rateLimiter'; // https://kittygiraudel.com/2022/05/16/rate-limit-nextjs-api-routes/

import firebaseConfig from '../../firebase.config';
import { app, db } from '../../firebase.config';

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Get similarity score between prompt and guess
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SubmitResponse | Error>
) {
    try {
        await applyRateLimit(req, res);
    } catch {
        res.status(429).json({ message: 'Too many requests!' });
        return;
    }

    // TODO: possible store existing embeddings in firebase
    try {
        const { pid } = req.query;
        const { guess, user, sawAnswer } = req.body;

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
            const guessEmbedding = await openai.createEmbedding({
                model: 'text-embedding-ada-002',
                input: guess,
            });
            const guessVector = guessEmbedding.data.data[0].embedding;

            let promptEmbedding = null;

            try {
                promptEmbedding = await openai.createEmbedding({
                    model: 'text-embedding-ada-002',
                    input: prompt.data().prompt,
                });
                if (!promptEmbedding) throw new Error('No prompt embedding');
            } catch (err: any) {
                res.status(401).json({
                    message: `OpenAI Error: ${err.message}`,
                });
            }

            const promptVector = promptEmbedding?.data.data[0].embedding;

            const similarity = calculateCosineSimilarity(
                guessVector,
                promptVector
            );

            // If similarity is greater than or equal to 0.9, update the leaderboard
            if (user && similarity >= 0.9 && !sawAnswer) {
                console.log('Updating leaderboard...');
                console.log(user.email, Math.round(similarity * 100));
                addScore(
                    user.email,
                    Math.round(similarity * 100),
                    pid as string
                );
            }

            res.send({
                pid: pid as string,
                prompt: prompt.data().prompt,
                similarity: Math.round(similarity * 100) / 100,
                won: similarity >= 0.9,
            });
        } else {
            res.status(404).json({ message: `Prompt ${pid} not found` });
        }
    } catch (e: any) {
        res.status(500).json({ message: e.message });
        // to log the error in the console, uncomment the following line
        console.error(e);
    }
}

function calculateCosineSimilarity(
    vectorA: number[] | undefined,
    vectorB: number[] | undefined
) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    if (vectorA && vectorB) {
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            magnitudeA += vectorA[i] * vectorA[i];
            magnitudeB += vectorB[i] * vectorB[i];
        }
    }

    return dotProduct / Math.sqrt(magnitudeA * magnitudeB);
}

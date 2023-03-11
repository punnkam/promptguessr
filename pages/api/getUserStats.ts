// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserStats, Error } from './types';

import { initializeApp } from 'firebase/app';
import { getDocs, collection } from 'firebase/firestore';
import applyRateLimit from '../../utils/rateLimiter';

import firebaseConfig from '../../firebase.config';
import { app, db } from '../../firebase.config';
// Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Get a random prompt from the firebase store
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserStats | Error>
) {
    const { email } = req.query;
    try {
        await applyRateLimit(req, res, 10);
    } catch {
        res.status(429).json({ message: 'Too many requests!' });
        return;
    }

    if (!email) {
        res.status(400).json({ message: 'No user provided!' });
        return;
    }
    try {
        const users = await getDocs(collection(db, 'users'));
        const usersArray = users.docs.map((doc) => doc.data());
        const sortedUsers = usersArray.sort((a: any, b: any) => {
            if (a.score === undefined) {
                return 1;
            }
            if (b.score === undefined) {
                return -1;
            }
            return b.score - a.score;
        });

        const userIndex = sortedUsers.findIndex((u: any) => u.email === email);
        const userRank: number = userIndex + 1;
        const userScore: number = sortedUsers[userIndex].score || 0;
        // this is an array of prompt ids
        // const userSolved: string[] = sortedUsers[userIndex].played?.length || [];
        // to make it the number of prompts solved, use userSolved.length
        const userSolved: number = sortedUsers[userIndex].played?.length || 0;

        const userStats: UserStats = {
            rank: userRank,
            score: userScore,
            solved: userSolved,
        };

        res.send(userStats);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
}

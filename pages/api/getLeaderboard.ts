import { Leaderboard, User } from './types';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prompt, Error } from './types';

import { initializeApp } from 'firebase/app';
import { getDocs, collection } from 'firebase/firestore';

import firebaseConfig from '../../firebase.config';
import { app, db } from '../../firebase.config';
// Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Get a random prompt from the firebase store
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Leaderboard | Error>
) {
    // get all users from firebase and sort by score and return top 10
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
        const topTen = sortedUsers.slice(0, 10);
        let userList: User[] = [];
        for (let i = 0; i < topTen.length; i++) {
            const user = topTen[i];
            userList.push({
                name: user.name,
                email: user.email,
                solved: user.played || [],
                totalScore: user.score || 0,
                image: user.image || '',
            });
        }

        const leaderboard: Leaderboard = {
            timestamp: new Date().getTime(),
            userList,
        };

        res.send(leaderboard);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
}

import {
    getDocs,
    getFirestore,
    doc,
    collection,
    setDoc,
    where,
    query,
} from 'firebase/firestore';
import { db } from '../../firebase.config';

export async function addScore(email: string, score: number, pid: string) {
    // find the users collection
    const users = collection(db, 'users');
    // find the user with the email
    const q = query(users, where('email', '==', email));
    let docs = await getDocs(q);
    let user = docs && docs.docs && docs.docs[0];

    // if the user doesn't exist, return
    if (!user.exists()) {
        return;
    } else {
        // if the user does exist, check if they have a played field
        if (user.data().played) {
            // if they do, convert the played field to a set
            // and add the new played to the existing played
            const playedSet = new Set(user.data().played);
            if (playedSet.has(pid)) {
                console.log('User has already played this problem');
                return;
            } else {
                playedSet.add(pid);
                await setDoc(doc(users, user.id), {
                    ...user.data(),
                    played: Array.from(playedSet),
                });
            }
        }

        // if the user does exist, check if they have a score field
        if (user.data().score) {
            // if they do, add the new score to the existing score
            await setDoc(doc(users, user.id), {
                ...user.data(),
                score: user.data().score + score,
                played: user.data().played.concat([pid]),
            });
        } else {
            // if they don't, set the score to the new score
            await setDoc(doc(users, user.id), {
                // leave everything else the same
                ...user.data(),
                score: score,
                played: [pid],
            });
        }
    }
}

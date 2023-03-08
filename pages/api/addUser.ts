// code for adding a user to the database
import { db } from '@/firebase.config';
import applyRateLimit from '@/utils/rateLimiter';
import { initializeApp } from 'firebase/app';
import { getDoc, getFirestore, doc, setDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { Prompt, SubmitResponse, User } from './types';

class MyError extends Error {
  constructor(message: string) {
    super(message); // calls the parent constructor, passing the message to it
    this.name = 'MyError';
  }
}

export default async function addUser(
  req: NextApiRequest,
  res: NextApiResponse<SubmitResponse | Error>
) {
  try {
    await applyRateLimit(req, res);
  } catch {
    res.status(429).json({ name: 'Error', message: 'Too many requests!' });

    return;
  }

  try {
    const { uid } = req.query;
    // uid is the user id of the user that is currently logged in
    // req.query is an object that contains the query string parameters of the request
    const { name, email } = req.body as User;
    // we set const { name, email } = req.body as User; because we want to make sure that the body of the request is a User object. If it is not, then we throw an error.
    // for example, the name and email properties are required in the User object, so if they are not provided, then we throw an error.

    if (!uid) {
      res.status(400).json({ name: 'Error', message: 'No user id provided' });
      return;
    }

    if (!name) {
      res.status(400).json({ name: 'Error', message: 'No name provided' });
      return;
    }

    // userRef is a reference to the user document in the database
    const userRef = doc(db, 'users', uid as string);
    const user = await getDoc(doc(db, 'users', uid as string));

    if (user.exists()) {
      const userData = user.data() as User;
      await setDoc(userRef, {
        ...userData,
        name,
        email,
      }); // this would set the name of the user to the name provided in the request body, and the rest of the properties would remain the same
      // to be able to change the email, we can add the email property to the object that is passed to setDoc
      // this would allow us to change the email of the user to the email provided in the request body, and the rest of the properties would remain the same
    } else {
      const newUser: User = {
        uid: uid as string,
        name,
        email: email as string,
        solved: [],
          totalScore: 0,
        message: 'New user'
      };
      await setDoc(userRef, newUser);
    }

    // this would set the name of the user to the name provided in the request body, and the rest of the properties would remain the same
    res.status(200).json({ name: 'Success', message: 'User added or updated' });
    //   console.log('User added or updated');
  } catch (e: any) {
    res.status(400).json({ name: 'Error', message: e });
  }
} // overall, this code is used to add a user to the database if they do not already exist, and if they do exist, then we update their name and email, the json returned would be { name: 'Success', message: 'User added or updated' } with a status code of 200. You can see this in the console when you run the code.
//

// the url for this code would be http://localhost:3000/api/addUser?uid=1234

// // Path: pages/api/addScore.ts
// // Add score to user
// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<SubmitResponse | Error>
// ) {
//     try {
//         await applyRateLimit(req, res);
//     } catch {
//         res.status(429).json({ message: 'Too many requests!' });
//         return;
//     }
//
//     try {
//         const { uid } = req.query;
//         const { score } = req.body;
//
//         if (!uid) {
//             res.status(400).json({ message: 'No user id provided' });
//             return;
//         }
//
//         if (!score) {
//             res.status(400).json({ message: 'No score provided' });
//             return;
//         }
//
//         const user = await getDoc(doc(db, 'users', uid as string));
//         if (user.exists()) {
//             await updateDoc(doc(db, 'users', uid as string), {
//                 score: user.data().score + score,
//             });
//         }
//
//         res.status(200).json({ message: 'Score added' });
//     } catch (e: any) {
//         res.status(400).json({ message: e });
//     }
// }
//
// // Path: pages/api/getLeaderboard.ts
// // Get leaderboard
// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<SubmitResponse | Error>
// ) {
//     try {
//         await applyRateLimit(req, res);
//     } catch {
//         res.status(429).json({ message: 'Too many requests!' });
//         return;
//     }
//
//     try {
//         const users = await getDocs(collection(db, 'users'));
//         const leaderboard = [];
//         users.forEach((user) => {
//             leaderboard.push({
//                 name: user.data().name,
//                 score: user.data().score,
//             });
//         });
//         leaderboard.sort((a, b) => b.score - a.score);
//
//         res.status(200).json({ leaderboard: leaderboard });
//     } catch (e: any) {
//         res.status(400).json({ message: e });
//     }
// }
//

import { NoUserFound } from './types';
// Path: pages/api/getUser.ts
// code to get user from firebase
import { db } from '@/firebase.config';
import applyRateLimit from '@/utils/rateLimiter';
import { getDoc, doc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { SubmitResponse, User } from './types';

class MyError extends Error {
  constructor(message: string) {
    super(message); // calls the parent constructor, passing the message to it
    this.name = 'MyError';
  }
}

export default async function getUserByUID(
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

    if (!uid) {
      res.status(400).json({ name: 'Error', message: 'No user id provided' });
      return;
    } // we need the uid to get the user

    const user = await getDoc(doc(db, 'users', uid as string));
    // we get the user from the database by using the uid, which is the id of the user



    if (user.exists()) {
      const userData = user.data() as User;
      // we get the data of the user from the user document and cast it as a User object

      const response: User = {
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        solved: userData.solved,
        totalScore: userData.totalScore,
        message: 'User found',
      };

      res.status(200).json(response);
    } else {
      const response: NoUserFound = {
        success: false,
        message: 'No user found with that id',
        user: null,
        name: 'NoUserFound', // name of the error, required for the Error interface
      };

      res.status(404).json(response);
    }
  } catch (e: any) {
    res.status(400).json({ name: 'Error', message: e });
  }
}
// the link to this file is http://localhost:3000/api/getUserByUID?uid={uid}

// todo: get user by email
// export async function getUserWithEmail(
//   req: NextApiRequest,
//   res: NextApiResponse<SubmitResponse | Error>
// ) {
//   try {
//     await applyRateLimit(req, res);
//   } catch {
//     res.status(429).json({ name: 'Error', message: 'Too many requests!' });
//     return;
//   }
//   try {
//     const { email } = req.query;

//   if (!email) {
//       res.status(400).json({ name: 'Error', message: 'No email provided' });
//       return;
//     } // we need the uid to get the user

//   // can we get a User by just their email? Yes, we can. We can use the where clause to get the user by their email. We can also use the where clause to get the user by their name, or any other property that we want to use to get the user.
// // we can use the where clause to get the user by their name, or any other property that we want to use to get the user.
// // here is an example of how to get the user by their email:
// // const user = await getDocs(
// //   query(collection(db, 'users'), where('email', '==', email))
// // );
// // the first argument of the query function is the collection that we want to query, and the second argument is the where clause. The where clause takes three arguments: the field that we want to query, the operator that we want to use to query the field, and the value that we want to use to query the field.
// // the first argument of the where clause is the field that we want to query. In this case, we want to query the email field.
// // the second argument of the where clause is the operator that we want to use to query the field. In this case, we want to use the '==' operator, which is the equality operator.
// // the third argument of the where clause is the value that we want to use to query the field. In this case, we want to use the email that the user entered in the login form.
// // the where clause returns a query, which we can then pass to the getDocs function to get the documents that match the query.
// // the getDocs function returns a query snapshot, which we can then iterate over to get the documents that match the query.
// // the getDocs function returns a query snapshot, which we can then iterate over to get the documents that match the query.
// // here is an example of how to get the user by their name:
// // const user = await getDocs(
// //   query(collection(db, 'users'), where('name', '==', name))
// // );
// // the first argument of the query function is the collection that we want to query, and the second argument is the where clause. The where clause takes three arguments: the field that we want to query, the operator that we want to use to query the field, and the value that we want to use to query the field.
// // the first argument of the where clause is the field that we want to query. In this case, we want to query the name field.
// // the second argument of the where clause is the operator that we want to use to query the field. In this case, we want to use the '==' operator, which is the equality operator.
// // the third argument of the where clause is the value that we want to use to query the field. In this case, we want to use the name that the user entered in the login form.
// // the where clause returns a query, which we can then pass to the getDocs function to get the documents that match the query.
// // the getDocs function returns a query snapshot, which we can then iterate over to get the documents that match the query.
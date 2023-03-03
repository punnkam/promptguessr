// 'use client';
import React from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';

const account = () => {
  const { data: session, status } = useSession();
  console.log(session);

  if (status === 'authenticated') {
    return (
      <div>
        <p>Welcome {session.user.name}</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>You are not signed in</p>
      </div>
    );
  }
};

export default account;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}

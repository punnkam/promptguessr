'use client';
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Account() {
    const { data: session, status } = useSession();

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
}

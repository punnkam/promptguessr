import './globals.css';
import { Session } from 'next-auth';
import { headers } from 'next/headers';
import AuthContext from './AuthContext';
import axios from 'axios';
import { Toaster } from '@/components/ui/toaster';

async function getSession(cookie: string): Promise<Session | null> {
    const response = await axios.get<Session>(
        `http://127.0.0.1:3000/api/auth/session`,
        {
            headers: {
                cookie,
            },
        }
    );
    // convert the response to a Session object
    const session = response.data;

    return Object.keys(session).length > 0 ? session : null;
}

// This is where you can add components and providers that will be around your entire app.
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const session = await getSession(headers().get('cookie') ?? '');
    return (
        <html lang='en'>
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <body>
                <Toaster />
                {/* <AuthContext session={session}>{children}</AuthContext> */}
            </body>
        </html>
    );
}

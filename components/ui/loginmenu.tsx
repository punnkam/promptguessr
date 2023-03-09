'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './alertdialog';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdownmenu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import { Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';

const Login = () => {
    const { data: session, status } = useSession();
    if (session && status === 'authenticated') {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className='h-10 px-4 py-2 bg-sky-500 active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 text-white'>
                        Welcome {session.user.name.split(' ')[0]}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full font-mono'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem> */}
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    } else {
        return (
            <Button className='bg-sky-500' onClick={() => signIn()}>
                <Mail className='w-4 h-4 mr-2 ' />
                Login with Email
            </Button>
        );
    }
};

export default Login;

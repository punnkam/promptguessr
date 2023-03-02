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
  console.log(session);
  if (session && status === 'authenticated') {
    return (
      <Button className="" onClick={() => signOut()}>
        Sign Out
      </Button>
    );
  } else {
    return (
      <Button className=" bg-sky-500" onClick={() => signIn()}>
        <Mail className="w-4 h-4 mr-2 " />
        Login with Email
      </Button>
    );
  }
};

export default Login;

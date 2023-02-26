'use client';
import Image from 'next/image';
import React from 'react';
import { JetBrains_Mono } from '@next/font/google';
import styles from './page.module.css';
import Rankings from '@/components/ui/rankings';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import type { Prompt, SubmitResponse } from '../../pages/api/types';

import Spinner from '@/components/ui/spinner';

import { useEffect, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
    CommandDialog,
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hovercard';

const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

export default function Home() {
    const [open, setOpen] = React.useState(false);
    const [scores, setScores] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
    const [result, setResult] = useState<SubmitResponse | undefined>(undefined);
    const [shortcutPressed, setShortcutPressed] = useState(false);

    const getPrompt = async () => {
        const prompt = await axios.get('/api/getPrompt');
        return prompt;
    };

    const submitPrompt = () => {
        // add error handling
        if (inputValue === '') return;
        if (prompt === undefined) return;
        axios
            .post(`/api/getSim?pid=${prompt.pid}`, {
                guess: inputValue,
            })
            .then((res) => {
                setResult(res.data);
                setScores(scores.concat(res.data.similarity));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getPrompt()
            .then((res) => {
                setPrompt(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className={`${mono.className} flex h-screen bg-[#F7F7F7]`}>
            <div className='flex items-center justify-center w-1/2 '>
                <Command className='z-50 justify-center w-full p-4 m-4 bg-white border rounded-lg shadow-md outline-none h-2/5 border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800'>
                    <CommandInput
                        placeholder='Type the prompt and press enter and get your scores!'
                        className={mono.className}
                        value={inputValue}
                        onInput={(event) =>
                            setInputValue(
                                (event.target as HTMLInputElement).value
                            )
                        }
                        onEnter={submitPrompt}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <div className='relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm font-medium outline-none aria-selected:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-700'>
                            <p className='mx-2 text-gray-500'>Scores:</p>
                            {scores.map((score, index) =>
                                score < 0.9 ? (
                                    <div
                                        key={index}
                                        className='inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300'
                                    >
                                        {score}
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className='inline-flex items-center px-2 py-1 mr-2 text-sm font-medium bg-green-100 rounded green-indigo-800 dark:bg-green-900 dark:green-indigo-300'
                                    >
                                        {score}
                                    </div>
                                )
                            )}
                        </div>
                        {/* <CommandItem>Remove all scores</CommandItem> */}
                        <CommandGroup heading='Suggestions'>
                            <CommandItem>
                                {/* <Calendar className="w-4 h-4 mr-2" /> */}
                                <span>
                                    Hint: It describes a specific planet
                                </span>
                            </CommandItem>
                            <CommandItem>
                                {/* <Smile className="w-4 h-4 mr-2" /> */}
                                <span># words: </span>
                            </CommandItem>
                            <CommandItem>
                                {/* <Calculator className="w-4 h-4 mr-2" /> */}
                                <span>I give up, show the answer</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                    </CommandList>
                    <div className='flex flex-row justify-end mx-5 mt-5'>
                        <Button
                            variant='default'
                            className='text-white bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-20 '
                            onClick={submitPrompt}
                        >
                            <p className='font-semibold text-white'>Submit</p>
                        </Button>
                    </div>
                </Command>
            </div>
            {/* column 2 */}
            <div className='flex items-center justify-center w-1/2 '>
                <Command className='z-50 justify-center w-3/4 px-4 mx-4 bg-white border rounded-lg shadow-md outline-none h-4/5 border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800'>
                    <div className='relative gap-2 bg-white border border-gray-200 rounded-lg shadow max-w-4/5 dark:bg-gray-800 dark:border-gray-700 h-4/5'>
                        {prompt ? (
                            <Image
                                src={prompt ? prompt.image : ''}
                                alt='Prompt to guess :)'
                                fill={true}
                                style={{ objectFit: 'contain' }}
                                priority={true}
                            />
                        ) : (
                            <div className='flex items-center justify-center h-full'>
                                <Spinner />
                            </div>
                        )}
                    </div>

                    <div className='flex flex-row justify-center gap-2 mt-5'>
                        {/* <Button
              variant="default"
              className="flex w-24 text-sm font-medium text-center text-white rounded-md bg-sky-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 8 8 12 12 16"></polyline>
                <line x1="16" y1="12" x2="8" y2="12"></line>
              </svg>
              <p className="font-semibold text-white">&nbsp;Prev</p>
            </Button> */}
                        <Button
                            variant='default'
                            className='text-white bg-sky-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-24	'
                            onClick={() => {
                                setPrompt(undefined);
                                setInputValue('');
                                setScores([]);
                                getPrompt()
                                    .then((res) => {
                                        setPrompt(res.data);
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }}
                        >
                            <p className='font-semibold text-white'>
                                Shuffle&nbsp;
                            </p>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <circle cx='12' cy='12' r='10'></circle>
                                <polyline points='12 16 16 12 12 8'></polyline>
                                <line x1='8' y1='12' x2='16' y2='12'></line>
                            </svg>
                        </Button>
                    </div>
                </Command>
            </div>
        </div>
    );
}

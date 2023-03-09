'use client';
import Image from 'next/image';
import { JetBrains_Mono } from '@next/font/google';
import styles from './page.module.css';
import Rankings from '@/components/ui/rankings';
import React from 'react';
import Link from 'next/link';
import axios from 'axios';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

export default function Home() {
    const [open, setOpen] = React.useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [leaderboard, setLeaderboard] = useState<any>([]);

    useEffect(() => {
        axios.get('/api/getLeaderboard').then((res) => {
            setLeaderboard(res.data);
        });
    }, []);

    return (
        <div
            className={`${mono.className} bg-[#F7F7F7] flex flex-col md:flex-row h-screen`}
        >
            <div className='pt-24 pb-12 mx-auto sm:pt-24'>
                <div className='max-w-xl'>
                    <p
                        className={`font-bold  text-sky-500 text-xl lg:mx-0 md:mx-0 mx-auto text-center`}
                    >
                        Achieve the AI skill you need
                    </p>
                    <h2
                        className={` mt-3 text-2xl font-black	 tracking-wide text-black sm:text-4xl md:text-4xl lg:text-6xl lg:mx-0 md:mx-0 mx-5 text-center animate-bounce`}
                    >
                        Prompt Guessr{' '}
                    </h2>
                    <p className='mx-10 mt-3 text-center text-md text-slate-600 lg:mx-0 md:mx-0'>
                        Prompt Guessr is a tool that allows you to practice
                        prompt engineering by guessing prompts from given images
                    </p>
                </div>
                <div className={mono.className}>
                    <div>
                        <Link href='/guessr'>
                            <div className='mt-6 relative border rounded-md before:absolute before:-bottom-2 before:border-sky-500 before:-right-2 before:h-8 before:w-8 before:rounded-lg before:border-b before:border-r before:transition-all before:duration-300 before:ease-in-out after:absolute after:-top-2 after:-left-2 after:h-8 after:w-8 after:border-t after:border-l after:transition-all after:duration-300 after:ease-in-out hover:before:h-[calc(100%+16px)] hover:before:w-[calc(100%+16px)] hover:after:h-[calc(100%+16px)] hover:after:w-[calc(100%+16px)] h-15 w-28 after:border-sky-500 after:rounded-lg mx-auto my-auto'>
                                <Button
                                    variant='default'
                                    className='mx-auto my-auto font-semibold text-white w-28 px-auto bg-sky-500 lex lg:text-xl dark:text-sky-400'
                                >
                                    Play!
                                </Button>
                            </div>
                        </Link>
                    </div>
                </div>
                <Rankings leaderboard={leaderboard} />
            </div>
        </div>
    );
}

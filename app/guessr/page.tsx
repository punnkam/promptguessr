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
import type { Image as LexicaImage } from 'lexica-api';
import { AspectRatio } from '@/components/ui/aspectratio';
import Modal from '@/components/ui/modal';
import { ToastWithTitle } from '@/components/ui/toastwithtitle';
import Login from '@/components/ui/loginmenu';

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
import { useToast } from '@/hooks/ui/usetoast';
import { Toast } from '@/components/ui/toast';

const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

export default function Home() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [modalBody, setModalBody] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const [score, setScore] = useState(undefined);
    const [inputValue, setInputValue] = useState<string>('');
    const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
    const [result, setResult] = useState<SubmitResponse | undefined>(undefined);
    const [search, setSearch] = useState<LexicaImage[]>([]);
    const [guessImg, setGuessImg] = useState<string>('');
    const [shortcutPressed, setShortcutPressed] = useState<boolean>(false);
    const { toast } = useToast();

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
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                },
            })
            .then((res) => {
                setResult(res.data);
                setScore(res.data.similarity);
                const won = res.data.similarity > 0.9;
                const close = res.data.similarity > 0.8;

                toast({
                    title: won
                        ? 'Your guess is correct!'
                        : close
                        ? 'Your guess is close!'
                        : 'Your guess is incorrect',
                    description: 'Check below to see your score',
                    className: `${
                        won
                            ? 'bg-green-500'
                            : close
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                    } text-white `,
                });
            })
            .catch((err) => {
                console.log(err.response.data);
            });

        axios
            .post('/api/getSearch', {
                guess: inputValue,
            })
            .then((res) => {
                setSearch(res.data);
                setGuessImg(res.data[0].src);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const showAnswer = (bool: boolean) => {
        if (result === undefined) return;
        setModalBody(result?.prompt ?? '');
        setModalTitle('Answer');
        setShowModal(bool);
    };

    useEffect(() => {
        getPrompt()
            .then((res) => {
                setPrompt(res.data);
                console.log('current prompt', res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <main className={`${mono.className} bg-[#F7F7F7]`}>
            <div className='absolute top-0 right-0 m-4'>
                <Login />
            </div>
            {showModal && (
                <Modal
                    setShowModal={setShowModal}
                    title={modalTitle}
                    body={modalBody}
                />
            )}
            <div
                className={`${mono.className} flex flex-row h-screen w-screen bg-[#F7F7F7]`}
            >
                {/* column 1 */}
                <div className='flex flex-col items-center justify-center w-1/2 '>
                    <div className='flex flex-col items-center justify-center w-3/4 gap-2 h-4/5'>
                        {/* User inputted image */}

                        <Command className='z-10 flex justify-center w-full px-4 pt-2 bg-white border rounded-lg shadow-md outline-none border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800'>
                            <h1 className='flex justify-center p-2 text-2xl font-semibold text-gray-700 dark:text-gray-200 '>
                                {result ? 'Your Guess' : 'Submit a Guess!'}
                            </h1>
                            <div className='relative w-full h-full bg-white border border-gray-200 rounded-lg shadow max-w-4/5 dark:bg-gray-800 dark:border-gray-700 '>
                                <Image
                                    src={
                                        guessImg ||
                                        'https://lexica-serve-encoded-images2.sharif.workers.dev/full_jpg/7ba81728-87c7-4858-9366-aeaa3058c475'
                                    }
                                    alt='Generated Image'
                                    fill={true}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: '0.5rem',
                                    }}
                                    priority={true}
                                />
                            </div>
                            <div className='flex flex-row justify-center mt-5'></div>
                            <div className='flex flex-col justify-start gap-2 pb-2'>
                                <div className='flex flex-col gap-2 mx-2 my-2'>
                                    <span>
                                        Hint:{' '}
                                        {prompt &&
                                            prompt.hint_words.map(
                                                (word, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`blur-${
                                                                showHint
                                                                    ? 'none'
                                                                    : 'sm'
                                                            } inline-flex items-center px-2 py-1 mr-2 text-sm font-medium bg-gray-100 rounded  green-gray-800 dark:bg-gray-900 dark:green-gray-300`}
                                                        >
                                                            {word}
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </span>
                                    <span>
                                        Length:{' '}
                                        <span
                                            className={`blur-${
                                                showHint ? 'none' : 'sm'
                                            }`}
                                        >
                                            {prompt && `${prompt.length} words`}{' '}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </Command>
                        {/* Typing prompt Dialog */}
                        <Command className='z-10 justify-center w-full p-3 bg-white border rounded-lg shadow-md outline-none border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800 h-1/3'>
                            <div className=''>
                                <CommandInput
                                    placeholder='Guess the prompt and press enter!'
                                    className={mono.className}
                                    value={inputValue}
                                    onInput={(event) =>
                                        setInputValue(
                                            (event.target as HTMLInputElement)
                                                .value
                                        )
                                    }
                                    onEnter={() => {
                                        if (inputValue) {
                                            submitPrompt();
                                        } else {
                                            alert('Please enter a prompt');
                                        }
                                    }}
                                />
                                <CommandList>
                                    {score !== undefined && (
                                        <div className='relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm font-medium outline-none aria-selected:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-700'>
                                            <p className='mx-2 text-gray-500'>
                                                Score:
                                            </p>
                                            {score < 0.9 ? (
                                                <div className='inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300'>
                                                    {score}
                                                </div>
                                            ) : (
                                                <div className='inline-flex items-center px-2 py-1 mr-2 text-sm font-medium bg-green-100 rounded green-indigo-800 dark:bg-green-900 dark:green-indigo-300'>
                                                    {score}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* <CommandSeparator /> */}
                                </CommandList>
                                <div className='flex flex-row justify-center gap-2 mx-5 mt-5'>
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <Button
                                                variant='default'
                                                className={`text-white focus:outline-none font-medium rounded-md text-sm px-2.5 py-2.5 text-center flex w-25 ${
                                                    result || !showHint
                                                        ? 'bg-orange-500 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                                                        : 'bg-orange-200 hover:none focus:none'
                                                } `}
                                                onClick={() => {
                                                    if (showHint) {
                                                        result &&
                                                            showAnswer(true);
                                                    } else {
                                                        setShowHint(true);
                                                    }
                                                }}
                                            >
                                                <p className='font-semibold text-white'>
                                                    See{' '}
                                                    {showHint
                                                        ? 'Answer'
                                                        : 'Hint'}
                                                </p>
                                                <HoverCardContent>
                                                    <text className='font-semibold text-black'>
                                                        {result
                                                            ? 'Click on this to reveal the answer to the prompt'
                                                            : 'Submit a guess'}
                                                    </text>
                                                </HoverCardContent>
                                            </Button>
                                        </HoverCardTrigger>
                                    </HoverCard>
                                    <Button
                                        variant='default'
                                        className='text-white bg-green-500 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 flex w-20 '
                                        // onClick={submitPrompt}
                                        onClick={() => {
                                            if (inputValue) {
                                                submitPrompt();
                                            } else {
                                                alert('Please enter a prompt');
                                            }
                                        }}
                                    >
                                        <p className='font-semibold text-white'>
                                            Submit
                                        </p>
                                    </Button>
                                </div>
                            </div>
                        </Command>
                    </div>
                </div>
                {/* column 2 */}
                <div className='flex flex-col items-center justify-center w-1/2 p-2'>
                    <div className='w-3/4 h-4/5'>
                        <Command className='z-10 flex justify-center w-full px-4 bg-white border rounded-lg shadow-md outline-none border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800'>
                            <h1 className='flex justify-center p-2 text-2xl font-semibold text-gray-700 dark:text-gray-200 '>
                                Given Image
                            </h1>
                            <div className='relative w-full bg-white border border-gray-200 rounded-lg shadow max-w-4/5 dark:bg-gray-800 dark:border-gray-700 h-4/5'>
                                {/* <AspectRatio> */}
                                {prompt ? (
                                    <Image
                                        src={prompt ? prompt.image : ''}
                                        alt='Prompt to guess :)'
                                        fill={true}
                                        style={{
                                            objectFit: 'contain',
                                        }}
                                        priority={true}
                                    />
                                ) : (
                                    <div className='flex items-center justify-center h-full'>
                                        <Spinner />
                                    </div>
                                )}
                                {/* </AspectRatio> */}
                            </div>
                            <div className='flex flex-row justify-center mt-5'>
                                <Button
                                    variant='default'
                                    className='text-white bg-sky-500 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 flex 	'
                                    onClick={() => {
                                        setPrompt(undefined);
                                        setInputValue('');
                                        setScore(undefined);
                                        setGuessImg('');
                                        setShowHint(false);
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
                                        width='15'
                                        height='15'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    >
                                        <polyline points='16 3 21 3 21 8'></polyline>
                                        <line
                                            x1='4'
                                            y1='20'
                                            x2='21'
                                            y2='3'
                                        ></line>
                                        <polyline points='21 16 21 21 16 21'></polyline>
                                        <line
                                            x1='15'
                                            y1='15'
                                            x2='21'
                                            y2='21'
                                        ></line>
                                        <line
                                            x1='4'
                                            y1='4'
                                            x2='9'
                                            y2='9'
                                        ></line>
                                    </svg>
                                </Button>
                            </div>
                        </Command>
                    </div>
                </div>
            </div>
        </main>
    );
}

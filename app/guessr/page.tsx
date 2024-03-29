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
import LoginMenu from '@/components/ui/loginmenu';

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
import { ShuffleIcon, ArrowRightIcon } from '@/components/ui/icons';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hovercard';
import { useToast } from '@/hooks/ui/usetoast';
import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';

const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    display: 'swap',
});

export default function Home() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [loadingResult, setLoadingResult] = useState<boolean>(false);
    const [modalBody, setModalBody] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const [score, setScore] = useState(undefined);
    const [inputValue, setInputValue] = useState<string>('');
    const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
    const [result, setResult] = useState<SubmitResponse | undefined>(undefined);
    const [search, setSearch] = useState<LexicaImage[]>([]);
    const [guessImg, setGuessImg] = useState<string>('');
    const [update, setUpdate] = useState<boolean>(false);
    const [shortcutPressed, setShortcutPressed] = useState<boolean>(false);
    const { toast } = useToast();
    const { data: session, status } = useSession();

    const [sawAnswer, setSawAnswer] = useState<boolean>(false);

    const getPrompt = async () => {
        const prompt = await axios.get('/api/getPrompt');
        return prompt;
    };

    const submitPrompt = () => {
        // add error handling
        if (inputValue === '') return;
        if (prompt === undefined) return;
        toast({
            title: 'Your guess is being processed',
            description: 'Wait a few seconds to see your score',
            className: 'bg-slate-500 text-white',
        });
        setLoadingResult(true);
        axios
            .post(`/api/getSim?pid=${prompt.pid}`, {
                guess: inputValue,
                user: status == 'authenticated' ? session?.user : undefined,
                sawAnswer: sawAnswer,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
                },
            })
            .then((res) => {
                setResult(res.data);
                setScore(res.data.similarity);
                const won = res.data.similarity >= 0.9;
                const close = res.data.similarity > 0.8;

                if (won) {
                    toast({
                        title: 'Your guess is correct! Points added to your score.',
                        description: 'Check below to see your similarity score',
                        className: 'bg-green-500 text-white',
                    });
                    setUpdate(!update);
                } else if (close) {
                    toast({
                        title: 'Your guess is close!',
                        description: 'Check below to see your score',
                        className: 'bg-amber-500 text-white',
                    });
                } else {
                    toast({
                        title: 'Your guess is incorrect',
                        description: 'Check below to see your score',
                        className: 'bg-red-500 text-white',
                    });
                }

                setLoadingResult(false);
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

    const getUserStats = () => {
        if (status !== 'authenticated') return;
        const user: any = session?.user;
        axios
            .get(`/api/getUserStats?email=${user.email}`)
            .then((res) => {
                console.log(res.data);
                // TODO: add user stats to page
            })
            .catch((err) => {
                console.log(err);
            });
    }; // { rank: number, score: string, solved: string[] }

    getUserStats();
    const showAnswer = (bool: boolean) => {
        if (result === undefined) return;
        setModalBody(result?.prompt ?? '');
        setModalTitle('Answer');
        setShowModal(bool);
        setSawAnswer(true);
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
        <main className={`${mono.className} bg-[#F7F7F7]`}>
            <div className='absolute top-0 right-0 flex-col gap-3 m-4 md:flex-row justify-items-end '>
                <LoginMenu update={update} />
            </div>
            <div className='absolute top-0 left-0 m-4'>
                <Button className='bg-sky-500'>
                    <Link href='/'>
                        <Image
                            src='/favicon.ico'
                            alt='logo'
                            width='15'
                            height='15'
                        />
                    </Link>
                </Button>
            </div>
            {showModal && (
                <Modal
                    setShowModal={setShowModal}
                    title={modalTitle}
                    body={modalBody}
                />
            )}
            <div
                className={`${mono.className} flex flex-col-reverse h-screen w-screen bg-bg gap-3 pt-20 md:pt-0 md:flex-row`}
            >
                {/* column 1 */}
                <div className='flex flex-col w-full h-full md:justify-center md:w-1/2 md:place-items-end place-items-center'>
                    <div className='flex flex-col items-center justify-start w-3/4 h-full gap-3 sm:justify-center sm:h-4/5'>
                        {/* User inputted image */}
                        <Command className='z-10 flex justify-center w-full h-20 px-4 pt-2 border rounded-lg shadow-md outline-none bg-nearWhite border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800 sm:h-full'>
                            <h1 className='justify-center hidden p-2 text-2xl font-semibold text-gray-700 dark:text-gray-200 sm:flex'>
                                {result ? 'Your Guess' : 'Submit a Guess!'}
                            </h1>
                            <div className='relative hidden w-full h-full my-2 border border-gray-200 rounded-lg shadow bg-nearWhite max-w-4/5 dark:bg-gray-800 dark:border-gray-700 sm:flex sm:justify-center'>
                                {!loadingResult ? (
                                    <Image
                                        src={guessImg || '/question_mark.png'}
                                        alt='Generated Image'
                                        fill={true}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '0.5rem',
                                        }}
                                        priority={true}
                                    />
                                ) : (
                                    <div className='flex items-center justify-center h-full'>
                                        <Spinner />
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col justify-start pb-2 text-xs sm:text-sm '>
                                <div className='flex flex-col gap-3 mx-2 my-2 '>
                                    <span>
                                        Hint:{' '}
                                        {prompt &&
                                            prompt.hint_words.map(
                                                (word, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`inline-flex items-center px-2 py-1 mr-2 text-xs sm:text-sm font-medium bg-gray-100 rounded green-gray-800 dark:bg-gray-900 dark:green-gray-300 ${
                                                                showHint
                                                                    ? 'blur-none'
                                                                    : 'blur-sm'
                                                            }`}
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
                        <Command className='z-10 justify-center w-full p-3 border rounded-lg shadow-md outline-none bg-nearWhite border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800 sm:h-1/3 h-1/2'>
                            <div className=''>
                                <CommandInput
                                    placeholder='Guess the prompt and submit - press enter!'
                                    className={`${mono.className} sm:text-sm text-xs`}
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
                                                Similarity Score:
                                            </p>
                                            {score < 0.9 ? (
                                                <div className='inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300'>
                                                    {score * 100}%
                                                </div>
                                            ) : (
                                                <div className='inline-flex items-center px-2 py-1 mr-2 text-sm font-medium bg-green-100 rounded green-indigo-800 dark:bg-green-900 dark:green-indigo-300'>
                                                    {score * 100}%
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* <CommandSeparator /> */}
                                </CommandList>
                                <div className='flex flex-row justify-center gap-3 mx-5 mt-5'>
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
                <div className='flex flex-col justify-center w-full h-full md:w-1/2 md:place-items-start place-items-center'>
                    <div className='flex flex-col items-center justify-center w-3/4 h-full gap-3 sm:h-4/5'>
                        <Command className='z-10 flex justify-center w-full px-4 pb-4 border rounded-lg shadow-md outline-none bg-nearWhite border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800 '>
                            <h1 className='flex justify-center mb-3 text-2xl font-semibold text-gray-700 dark:text-gray-200'>
                                Given Image
                            </h1>
                            <div className='relative border border-gray-200 rounded-lg shadow bg-nearWhite max-w-4/5 dark:bg-gray-800 dark:border-gray-700 h-4/5'>
                                <div className='absolute inset-0 z-0 filter blur-sm'>
                                    {prompt ? (
                                        <Image
                                            src={prompt ? prompt.image : ''}
                                            alt='Prompt to guess :)'
                                            fill={true}
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            priority={true}
                                        />
                                    ) : null}
                                </div>
                                {prompt ? (
                                    <div className='border border-gray-300 rounded-full'>
                                        <Image
                                            src={prompt ? prompt.image : ''}
                                            alt='Prompt to guess :)'
                                            fill={true}
                                            style={{
                                                objectFit: 'contain',
                                            }}
                                            className='rounded-lg min-w-fit '
                                            priority={true}
                                        />
                                    </div>
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
                                    className='text-white bg-sky-500 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm pr-3 pl-4 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 flex 	'
                                    onClick={() => {
                                        setPrompt(undefined);
                                        setInputValue('');
                                        setScore(undefined);
                                        setGuessImg('');
                                        setShowHint(false);
                                        setResult(undefined);
                                        setSawAnswer(false);
                                        getPrompt()
                                            .then((res) => {
                                                setPrompt(res.data);
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                    }}
                                >
                                    <p className='font-semibold text-white '>
                                        {result && result.similarity >= 0.9
                                            ? 'Next'
                                            : 'Shuffle'}
                                        &nbsp;
                                    </p>
                                    {result && result.similarity >= 0.9 ? (
                                        <ArrowRightIcon />
                                    ) : (
                                        <ShuffleIcon />
                                    )}
                                </Button>
                            </div>
                        </Command>
                    </div>
                </div>
            </div>
        </main>
    );
}

// todo: fix responsive design (particularly modbile)

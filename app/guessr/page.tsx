'use client';
import Image from 'next/image';
import React from 'react';
import { JetBrains_Mono } from '@next/font/google';
import styles from './page.module.css';
import Rankings from '@/components/ui/rankings';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  const [inputValue, setInputValue] = useState('');
  return (
    <main className={`${mono.className} `}>
      <div className={`${mono.className} flex h-screen bg-[#F7F7F7]`}>
        {/* column 1 */}
        <div className="flex items-center justify-center w-1/2">
          <div className="flex flex-col items-center justify-center w-3/4 gap-2 h-4/5">
            {/* User inputted image */}
            <Command className="z-50 flex justify-center w-full px-4 bg-white border rounded-lg shadow-md outline-none border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800">
              <h1 className="flex justify-center p-2 text-2xl font-semibold text-gray-700 dark:text-gray-200 ">
                Generated Image
              </h1>
              <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow max-w-4/5 dark:bg-gray-800 dark:border-gray-700"></div>
              <div className="flex flex-row justify-center mt-5"></div>
              <div className="flex flex-col justify-start gap-2 pb-2">
                <span>Hint:</span>
                <span># Words: </span>
              </div>
            </Command>

            {/* Typing prompt Dialog */}
            <Command className="z-50 justify-center w-full p-3 bg-white border rounded-lg shadow-md outline-none border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800 h-1/3">
              <div className="">
                <CommandInput
                  placeholder="Type prompt and press enter"
                  className={mono.className}
                  value={inputValue}
                  onInput={(event) =>
                    setInputValue((event.target as HTMLInputElement).value)
                  }
                  onEnter={(value) => {
                    // setTags([...tags, value]);
                    // setInputValue('');
                  }}
                />
                <CommandList>
                  {/* <CommandEmpty>
                  Type the prompt to generate and match the image on the right
                </CommandEmpty> */}
                  <div className="relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm font-medium outline-none aria-selected:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-700"></div>
                  {/* <CommandSeparator /> */}
                </CommandList>
                <div className="flex flex-row justify-center mx-5 mt-5">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button
                        variant="default"
                        className="text-white bg-orange-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-25  "
                      >
                        <p className="font-semibold text-white">See answer</p>
                        <HoverCardContent>
                          <text className="font-semibold text-black">
                            Click on this to reveal the answer to the prompt
                          </text>
                        </HoverCardContent>
                      </Button>
                    </HoverCardTrigger>
                  </HoverCard>
                  {/* <Button
                  variant="default"
                  className="text-white bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-20 "
                >
                  <p className="font-semibold text-white">Submit</p>
                </Button> */}
                </div>
              </div>
            </Command>
          </div>
        </div>

        {/* column 2 */}
        <div className="flex items-center justify-center w-1/2 ">
          <div className="w-3/4 h-4/5">
            <Command className="z-50 flex justify-center w-full px-4 bg-white border rounded-lg shadow-md outline-none border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800">
              <h1 className="flex justify-center p-2 text-2xl font-semibold text-gray-700 dark:text-gray-200 ">
                Given Image
              </h1>
              <div className="w-full bg-white border border-gray-200 rounded-lg shadow max-w-4/5 dark:bg-gray-800 dark:border-gray-700 h-4/5"></div>
              <div className="flex flex-row justify-center mt-5">
                <Button
                  variant="default"
                  className="text-white bg-sky-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-24"
                >
                  <p className="font-semibold text-white">Next&nbsp;</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 16 16 12 12 8"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
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

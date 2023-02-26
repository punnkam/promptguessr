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
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [shortcutPressed, setShortcutPressed] = useState(false);

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className={`${mono.className} flex h-screen bg-[#F7F7F7]`}>
      <div className="flex items-center justify-center w-1/2 ">
        <Command className="z-50 justify-center w-full p-4 m-4 bg-white border rounded-lg shadow-md outline-none h-2/5 border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800">
          <CommandInput
            placeholder="Type the prompt and press enter to add tags!"
            className={mono.className}
            value={inputValue}
            onInput={(event) =>
              setInputValue((event.target as HTMLInputElement).value)
            }
            onEnter={(value) => {
              setTags([...tags, value]);
              setInputValue('');
            }}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm font-medium outline-none aria-selected:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-700">
              <p className="mx-2 text-gray-500">Tags:</p>
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300"
                >
                  {tag}

                  <button
                    type="button"
                    className="inline-flex items-center p-0.5 ml-2 text-sm text-indigo-400 bg-transparent rounded-sm hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-300 "
                    data-dismiss-target="#badge-dismiss-indigo"
                    onClick={() => {
                      const newTags = [...tags];
                      newTags.splice(index, 1);
                      setTags(newTags);
                    }}
                    aria-label="Remove"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-3.5 h-3.5"
                      // aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Remove badge</span>
                  </button>
                </div>
              ))}
            </div>
            {/* <CommandItem>Remove all tags</CommandItem> */}
            <CommandGroup heading="Suggestions">
              <CommandItem>
                {/* <Calendar className="w-4 h-4 mr-2" /> */}
                <span>Hint: It describes a specific planet</span>
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
          <div className="flex flex-row justify-end mx-5 mt-5">
            <Button
              variant="default"
              className="text-white bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-20 "
            >
              <p className="font-semibold text-white">Submit</p>
            </Button>
          </div>
        </Command>
      </div>
      {/* column 2 */}
      <div className="flex items-center justify-center w-1/2 ">
        <Command className="z-50 justify-center w-full px-4 mx-4 bg-white border rounded-lg shadow-md outline-none h-4/5 border-slate-100 animate-in zoom-in-90 dark:border-slate-800 dark:bg-slate-800">
          <div className="w-full gap-2 bg-white border border-gray-200 rounded-lg shadow max-w-4/5 dark:bg-gray-800 dark:border-gray-700 h-4/5"></div>
          <div className="flex flex-row justify-center gap-2 mt-5">
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 8 8 12 12 16"></polyline>
                <line x1="16" y1="12" x2="8" y2="12"></line>
              </svg>
              <p className="font-semibold text-white">&nbsp;Prev</p>
            </Button> */}
            <Button
              variant="default"
              className="text-white bg-sky-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2.5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex w-24	"
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
  );
}

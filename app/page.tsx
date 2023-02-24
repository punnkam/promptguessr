'use client';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';

import React, { useState } from 'react';
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

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [shortcutPressed, setShortcutPressed] = useState(false);

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open);
        setShortcutPressed(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <main className={inter.className}>
      <div className="bg-white py-24 px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Achieve the AI skill you need
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Prompt Guessr{' '}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Want to learn, practice, and sharpen your prompt engineering skills?
          </p>{' '}
          <p className="text-lg leading-8 text-gray-600">
            Prompt Guessr is a tool that allows you to practice prompt
            engineering by guessing the prompt that a given text is a response
            to.
          </p>
        </div>
      </div>

      <div className="w-1/3 content-center mx-auto mt-auto ">
        <div className="">
          {shortcutPressed ? (
            <div>
              <p></p>
              <CommandDialog open={open} onOpenChange={setOpen}>
                {/* rest of the dialog content */}
              </CommandDialog>
            </div>
          ) : (
            <p className="text-xl text-slate-500 dark:text-slate-400 flex justify-center">
              Press{' '}
              <CommandShortcut className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-100 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-600 opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 mx-2 mt-1">
                <span className="text-xl">⌘</span>
                <span className="text-lg">k</span>
              </CommandShortcut>
              to start
            </p>
          )}

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              placeholder="Type the prompt and press enter to add tags!"
              className={inter.className}
              value={inputValue}
              onInput={(event) =>
                setInputValue((event.target as HTMLInputElement).value)
              }
              onEnter={(value) => {
                setTags([...tags, value]);
                setInputValue('');
              }}
            />

            <CommandList className={inter.className}>
              <CommandEmpty>No results found.</CommandEmpty>
              <div className="relative flex cursor-default select-none items-center rounded-md py-1.5 px-2 text-sm font-medium outline-none aria-selected:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-700">
                <p className="text-gray-500 mx-2">Tags:</p>
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded dark:bg-indigo-900 dark:text-indigo-300"
                  >
                    {tag}

                    <button
                      type="button"
                      className="inline-flex items-center p-0.5 ml-2 text-sm text-indigo-400 bg-transparent rounded-sm hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-300"
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
                <CommandItem>Hint: It describes a specific planet</CommandItem>
                <CommandItem># of words:</CommandItem>
                <CommandItem>I give up, gimme da answer</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </div>
    </main>
  );
}

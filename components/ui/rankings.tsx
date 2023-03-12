import * as React from 'react';

interface User {
    name: string;
    image?: string;
    email: string;
    solved: string[];
    totalScore: number;
}

export default function Rankings({ leaderboard }: any) {
    return (
        <div className='w-4/5 p-2 pr-4 mx-auto my-auto mt-8 bg-white border border-gray-200 rounded-lg shadowmd:mx-auto lg:mx-auto sm:p-8 dark:bg-gray-800 dark:border-gray-700'>
            <div className='flex items-center justify-between p-5 mb-4'>
                <h5 className='text-2xl font-bold leading-none text-gray-900 dark:text-white'>
                    Top Ranks
                </h5>
                <a
                    href='#'
                    className='font-medium text-blue-600 text-md hover:underline dark:text-blue-500'
                >
                    {/* View all */}
                </a>
            </div>
            <div className='overflow-scroll max-h-72'>
                <ul
                    role='list'
                    className='divide-y divide-gray-200 dark:divide-gray-700'
                >
                    {leaderboard.userList &&
                        leaderboard.userList.map(
                            (user: User, index: number) => (
                                <li className='py-3 sm:py-4' key={index}>
                                    <div className='flex items-center space-x-4'>
                                        <div className='flex-shrink-0'>
                                            {/* <img
                  className="w-8 h-8 rounded-full"
                  src="/docs/images/people/profile-picture-1.jpg"
                  alt="Neil image"
                /> */}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-medium text-gray-900 truncate text-md dark:text-white'>
                                                <span className='font-semibold'>
                                                    {index + 1}.{' '}
                                                </span>
                                                {user.name.split(' ')[0]}
                                            </p>
                                            <p className='text-gray-500 truncate text-md dark:text-gray-400'>
                                                {/* email@windster.com */}
                                            </p>
                                        </div>
                                        <div className='inline-flex items-center font-semibold text-gray-900 text-md dark:text-white'>
                                            {user.totalScore}
                                        </div>
                                    </div>
                                </li>
                            )
                        )}
                </ul>
            </div>
        </div>
    );
}

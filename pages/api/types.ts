export type Prompt = {
    pid: string;
    image: string;
    length: number;
    hint_words: string[];
};

export type SubmitResponse = {
    pid: string;
    prompt?: string;
    similarity: number;
    won: boolean;
};

export type Error = {
    message: string;
};

export type User = {
    name: string;
    image?: string;
    email: string;
    solved: string[];
    totalScore: number;
};

// type that returns no user found
export type NoUserFound = {
    success: boolean;
    message: string;
    user: null;
    name: string;
};

export type Leaderboard = {
    timestamp: number;
    userList: User[];
};

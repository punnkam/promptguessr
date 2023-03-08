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
  uid: string;
  name: string;
  email: string;
  solved: Prompt[];
  totalScore: number;
  message: string;
};

// type that returns no user found
export type NoUserFound = {
  success: boolean;
  message: string;
    user: null;
  name: string;
};

export type Leaderboard = {
  timeStart: string;
  timeEnd: string;
  order: string;
  userList: User[];
};

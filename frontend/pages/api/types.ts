export type Prompt = {
    pid: string;
    prompt: string;
    image: string;
    length: number;
    hint_words: string[];
};

export type Error = {
    message: string;
};

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prompt, Error } from './types';

import { LexicaAPI, Image } from 'lexica-api';

const lexica = new LexicaAPI();

// Get a random prompt from the firebase store
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Image | Error>
) {
    try {
        // get the search query
        const { guess } = req.body;
        const results = await lexica.search(guess);

        if (results.images.length === 0) {
            throw new Error('No images found!');
        }

        // send result
        res.status(200).json(results.images[0]);
    } catch (e: any) {
        res.status(400).json({ message: e });
    }
}

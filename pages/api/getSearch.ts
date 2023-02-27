// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Error } from './types';

import { LexicaAPI, Image } from 'lexica-api';

import applyRateLimit from '../../utils/rateLimiter'; // https://kittygiraudel.com/2022/05/16/rate-limit-nextjs-api-routes/

const lexica = new LexicaAPI();

// Get a random prompt from the firebase store
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Image[] | Error>
) {
    try {
        await applyRateLimit(req, res);
    } catch {
        res.status(429).json({ message: 'Too many requests!' });
        return;
    }

    try {
        // get the search query
        const { guess } = req.body;
        const results = await lexica.search(guess);

        if (results.images.length === 0) {
            throw new Error('No images found!');
        }

        // send result
        res.status(200).json(results.images.slice(0, 5));
    } catch (e: any) {
        res.status(400).json({ message: e });
    }
}

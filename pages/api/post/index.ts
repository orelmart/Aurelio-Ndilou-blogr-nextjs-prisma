// pages/api/post/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required body fields: title
// Optional body fields: content
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // 1. Allow only POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { title, content } = req.body;

    try {
        // 2. Authenticate
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        // 3. Create the post
        const result = await prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { email: session.user!.email! } },
            },
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('[api/post] create error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

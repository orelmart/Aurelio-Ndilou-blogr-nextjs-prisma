// pages/api/post/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';   // ← path relative to this file
import prisma from '../../../lib/prisma';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log('[api/post] cookie header =', req.headers.cookie);

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const session = await getServerSession(req, res, authOptions);
    const { title, content } = req.body;

    if (!session || !session.user?.email) {
        return res
            .status(401)
            .json({ message: 'Unauthenticated or missing email' });
    }

    try {
        const result = await prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { email: session.user.email } },
            },
        });
        return res.status(200).json(result);
    } catch (error) {
        console.error('[api/post] create error:', error);
        return res.status(500).json({ message: 'Unable to create post' });
    }
}

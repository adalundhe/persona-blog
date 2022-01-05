import { corsMiddleware, devTo } from 'server/services'
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import getUuid from 'uuid-by-string'

export const config = {
  api: {
    bodyParser: true,
  },
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    await corsMiddleware.executeCors(req, res, corsMiddleware.settings);

    const prisma = new PrismaClient()
    const DevToClient = new devTo.Client();

    const { devToId } = <{devToId: string}>req.query;

    const article = await DevToClient.posts.fetchArticle({ 
        articleId: devToId
    });

    if (article.error){
        return await res.status(article.status).json(article);
    }

    if (article.data){
        const articleUUID: string = getUuid(article.data.id, 5);
        const post = await prisma.blogPost.upsert({
            create: {
                id: articleUUID,
                devToId: article.data.id,
                title: article.data.title,
                content: article.data.content,
                tags: article.data.tags,
                likes: article.data.likes,
                createdAt: article.data.createdAt,
                updatedAt: article.data.updatedAt,
                published: article.data.published,
                publish_date: article.data.publish_date,
                author: article.data.author
            },
            update: {
                title: article.data.title,
                content: article.data.content,
                tags: article.data.tags,
                likes: article.data.likes,
                updatedAt: article.data.updatedAt,
                author: article.data.author
            },
            where: {
                id: articleUUID
            }
        });

        return await res.status(200).json({
            message: 'OK',
            error: false,
            data: [
                post
            ]
        });

    }
    else {
        return await res.status(500).json({
            message: 'Error: Dev.To article contained no data.',
            error: true,
            data: []
        })
    }

}
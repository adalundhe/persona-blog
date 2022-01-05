import { corsMiddleware, devTo } from 'server/services'
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, BlogPost } from '@prisma/client';
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

    const { count } = <{count: string}>req.query;

    const articleIds = await DevToClient.posts.fetchLatest({
      count: count ? count : "5"
    });

    if (articleIds.error){
      return await res.status(articleIds.status).json(articleIds)
    }

    let posts: BlogPost[] = [];

    for (const articleId of articleIds.data){

      const article = await DevToClient.posts.fetchArticle({ 
        articleId: articleId
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

        posts = [...posts, post]
  
      }
      else {
        return await res.status(500).json({
            message: 'Error: Dev.To article contained no data.',
            error: true,
            data: []
        })
      }

    }

    return await res.status(200).json({
      message: 'OK',
      error: false,
      data: posts
    });

}
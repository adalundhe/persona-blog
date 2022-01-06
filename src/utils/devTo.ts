import { devTo } from 'server/services'
import { PrismaClient, BlogPost } from '@prisma/client';
import getUuid from 'uuid-by-string';

interface LatestPostsRequest {
    count: string;
}


const getLatestPosts = async ({ count }: LatestPostsRequest) => {
    const prisma = new PrismaClient()
  const DevToClient = new devTo.Client();

  const articleIds = await DevToClient.posts.fetchLatest({
    count: count

  });

  if (articleIds.error){
    return {
      props: {
        ...articleIds
      }
    }
  }

  let posts: BlogPost[] = [];

  for (const articleId of articleIds.data){

    const article = await DevToClient.posts.fetchArticle({ 
      articleId: articleId
    });

    if (article.error){
      return {
        props: {
          ...article
        }
      }
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
      return {
        props: {
          message: 'Error: Dev.To article contained no data.',
          error: true,
          data: []
        }
      }
    }

  }

  return {
    props: {
      message: 'OK',
      error: false,
      data: posts.map((post: BlogPost) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }))
    }
  }
}

export {
    getLatestPosts
}
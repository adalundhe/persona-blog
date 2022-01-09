import { devTo, hashnode } from 'server/services'
import { PrismaClient, BlogPost } from '@prisma/client';
import getUuid from 'uuid-by-string';
import { CreatePostRequest } from 'types/server/services/types';
import { FetchRequest } from 'types/server/services/types';
import { AxiosError } from 'axios';


const getLatestHashnodePosts = async ({ count }: FetchRequest) => {
  const prisma = new PrismaClient();
  const HashnodeClient = new hashnode.Client();

  const hashnodePosts = await HashnodeClient.posts.fetchLatest({
    count: count
  })

  if (hashnodePosts.error){
    return {
      props: {
        ...hashnodePosts
      }
    }
  }

  let posts: BlogPost[] = [];

  for (const hashnodePost of hashnodePosts.data) {

    const postUUID: string = getUuid(hashnodePost.id, 5);
    
    const post = await prisma.blogPost.upsert({
      create: {
        id: postUUID,
        devToId: null,
        hashnodeId: hashnodePost.id,
        title: hashnodePost.title,
        content: hashnodePost.content,
        tags: hashnodePost.tags,
        likes: hashnodePost.likes,
        createdAt: hashnodePost.createdAt,
        updatedAt: hashnodePost.updatedAt,
        published: hashnodePost.published,
        publishedDate: hashnodePost.publish_date,
        author: hashnodePost.author

      },
      update: {
        title: hashnodePost.title,
        content: hashnodePost.content,
        tags: hashnodePost.tags,
        likes: hashnodePost.likes,
        updatedAt: hashnodePost.updatedAt,
        author: hashnodePost.author

      },
      where: {
        id: postUUID
      }
    });

    posts = [...posts, post];
    
  }
  
  return {
    props: {
      message: 'OK',
      error: false,
      data: posts
    }
  }
}

const createNewHashnodePost = async ({ blogPost, update }: CreatePostRequest) => {
  const prisma = new PrismaClient();
  const HashnodeClient = new hashnode.Client();

  try {
    const hashnodePost = await HashnodeClient.posts.createOrUpdate({
      blogPost,
      update
    })
  
    if (hashnodePost.error){
      return {
        props: {
          ...hashnodePost
        }
      }
    }
  
    const post = await prisma.blogPost.upsert({
      create: blogPost,
      update: {
        hashnodeId: hashnodePost.data?.id ?? null,
        createdAt: hashnodePost.data?.createdAt as Date,
        updatedAt: hashnodePost.data?.updatedAt as Date,
        publishedDate: hashnodePost.data?.publish_date as string
      },
      where: {
        id: blogPost.id
      }
    });
  
    return {
      props: {
        message: 'OK',
        error: false,
        data: post
      }
    }
    
  } catch (requestError) {

    return {
      props: {
        error: true,
        message: requestError as string,
        status: 400
      }
    }
    
  }

}


const getLatestDevToPosts = async ({ count }: FetchRequest) => {
  const prisma = new PrismaClient();
  const DevToClient = new devTo.Client();

  const articleIds = await DevToClient.posts.fetchLatest({
    count
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
          hashnodeId: null,
          title: article.data.title,
          content: article.data.content,
          tags: article.data.tags,
          likes: article.data.likes,
          createdAt: article.data.createdAt,
          updatedAt: article.data.updatedAt,
          published: article.data.published,
          publishedDate: article.data.publish_date,
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
      data: posts
    }
  }
}

const createNewDevToPost = async ({ blogPost, update }: CreatePostRequest) => {
  const prisma = new PrismaClient();
  const DevToClient = new devTo.Client();

  try {

    const devToPost = await DevToClient.posts.createOrUpdate({
      blogPost,
      update
    })
  
    if (devToPost.error){
      return {
        props: {
          ...devToPost
        }
      }
    }

    const post = await prisma.blogPost.upsert({
      create: blogPost,
      update: {
        devToId: devToPost.data?.id ?? null,
        createdAt: devToPost.data?.createdAt as Date,
        updatedAt: devToPost.data?.updatedAt as Date,
        publishedDate: devToPost.data?.publish_date as string
      },
      where: {
        id: blogPost.id
      }
    });
  
    return {
      props: {
        message: 'OK',
        error: false,
        data: post
      }
    }

  } catch (requestError) {

    const axiosError = requestError as AxiosError;

    return {
      props: {
        error: true,
        message: axiosError.message,
        status: axiosError.code ?? axiosError.response?.status,
        data: null
      }
    }
    
  }
}


export {
  getLatestDevToPosts,
  getLatestHashnodePosts,
  createNewHashnodePost,
  createNewDevToPost
}
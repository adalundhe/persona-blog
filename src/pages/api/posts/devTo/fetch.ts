import { corsMiddleware } from 'server/services';
import { NextApiRequest, NextApiResponse } from "next";
import utils from 'utils';
import { BlogPost } from '@prisma/client';



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

    const postsReponse = await utils.blogs.getLatestDevToPosts({
      count: (req.query.count as string || "1")
    });

    let blogPosts = postsReponse.props.data as Array<BlogPost>;

    if (postsReponse.props.error){
      return await res.status(500).json(postsReponse);
    }

    const isUpdate = req.query.update === "true";

    for (const idx in blogPosts){

      const blogPost = blogPosts[idx] as BlogPost;

      if (blogPost.hashnodeId === null || isUpdate){
        const newBlogPost = await utils.blogs.createNewHashnodePost({
          blogPost,
          update: isUpdate
        });

        if (newBlogPost.props.error){
          return await res.status(400).json(newBlogPost.props)
        }

        blogPosts[idx] = newBlogPost.props.data as BlogPost;

      }

    }

    postsReponse.props.data = blogPosts;

    return await res.status(200).json(postsReponse)

}
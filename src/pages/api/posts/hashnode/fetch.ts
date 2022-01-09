import { corsMiddleware } from 'server/services';
import { NextApiRequest, NextApiResponse } from "next";
import utils from 'utils';
import { SerializableBlogPost } from 'types/utils/blogs';

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

    const postsReponse = await utils.blogs.getLatestHashnodePosts({
      count: (req.query.count as string || "1")
    });

    if (postsReponse.props.error){
      return await res.status(500).json(postsReponse);
    }

    let blogPosts = postsReponse.props.data as Array<SerializableBlogPost>;

    for (const idx in blogPosts){

      const blogPost = blogPosts[idx] as SerializableBlogPost;

      if (blogPost.devToId === null){
        const newBlogPost = await utils.blogs.createNewDevToPost({
          blogPost: blogPost
        });

        blogPosts[idx] = newBlogPost.props.data as SerializableBlogPost;

      }
      
    }

    postsReponse.props.data = blogPosts;

    return await res.status(200).json(postsReponse)

}
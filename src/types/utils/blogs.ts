import { BlogPost } from "@prisma/client";

export interface LatestPostsRequest {
    count: string;
}

export interface SerializableBlogPost extends Omit<BlogPost, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}


export interface NewPostRequest {
  blogPost: SerializableBlogPost;
}


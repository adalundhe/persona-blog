import { SerializableBlogPost } from "types/utils/blogs";


export interface DevToEnv {
    DEVTO_USERNAME: string;
    DEVTO_API_KEY: string;
    DEVTO_URL: string;
}

export interface HashnodeEnv {
    HASHNODE_USERNAME: string;
    HASHNODE_API_KEY: string;
    HASHNODE_URL: string;
    HASHNODE_PUBLICATION_ID: string;
}

export interface ArticleLinkFetchRequest {
     count: string | number;
     env?: DevToEnv | HashnodeEnv;
}

export interface ArticleFetchRequest {
    articleId: string;
    env?: DevToEnv;
}

export interface ArticlePostRequest {
    blogPost: SerializableBlogPost;
    env?: DevToEnv | HashnodeEnv;
}



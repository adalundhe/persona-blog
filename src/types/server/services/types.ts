import { SerializableBlogPost } from "types/utils/blogs";


export interface DevToEnv {
    DEVTO_USERNAME: string;
    DEVTO_API_KEY: string;
    DEVTO_URL: string;
}

export interface DevToData {
    id: number;
    title: string;
    body_markdown: string;
    tags: Array<string>;
    positive_reactions_count: number;
    created_at: string;
    edited_at: string;
    readable_publish_date: string;
    user: {
        name: string
    }
}

export interface HashnodeData {
    code: number;
    success: boolean;
    message: string;
    post: {
        _id: string;
        dateAdded: string;
        dateUpdated: string;
    }
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
    update?: boolean;
    env?: DevToEnv | HashnodeEnv;
}



import axios, { AxiosResponse } from 'axios';
import getConfig from "next/config";
import Case from 'case';
import { ArticleFetchRequest, ArticleLinkFetchRequest, ArticlePostRequest, DevToEnv } from 'types/server/services/types';




const sanitizeDevToMarkdown = async (markdown: string) => {
    let correctedMarkdown = '';

    // Dev.to sometimes turns "# header" into "#&nbsp;header"
    const replaceSpaceCharRegex = new RegExp(String.fromCharCode(160), "g");
    correctedMarkdown = markdown.replace(replaceSpaceCharRegex, " ");

    // Dev.to allows headers with no space after the hashtag (I don't use # on Dev.to due to the title)
    const addSpaceAfterHeaderHashtagRegex = /##(?=[a-z|A-Z])/g;
    return correctedMarkdown.replace(addSpaceAfterHeaderHashtagRegex, '$& ');
}



class Client {


    posts = {
        fetchLatest: async function({
            count,
            env
        }: ArticleLinkFetchRequest){

            let devToEnv = env as DevToEnv;

            if (devToEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                devToEnv = publicRuntimeConfig;
            }

            const { 
                DEVTO_API_KEY,
                DEVTO_URL,
                DEVTO_USERNAME
             } = <{ DEVTO_USERNAME: string, DEVTO_API_KEY: string, DEVTO_URL: string }>devToEnv;
            
            
            const params = { 
                username: DEVTO_USERNAME, 
                count: count 
            };
            const headers = { 'api-key': DEVTO_API_KEY };
            const { data, status }: AxiosResponse = await axios.get(`${DEVTO_URL}/articles/latest`, { params, headers });

            const articles: typeof data = data;

            if (status < 200 || status >= 300) return {
                error: true,
                message: 'Failed to fetch articles from DevTo.',
                data: [],
                status
            }

            return {
                error: false,
                message: 'OK',
                data: articles.map((article: typeof articles[0]) => article.id),
                status
            };
        },
        fetchArticle: async function ({ 
            articleId, 
            env 
        }: ArticleFetchRequest) {

            let devToEnv = env as DevToEnv;

            if (devToEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                devToEnv = publicRuntimeConfig;
            }

            const { 
                DEVTO_API_KEY,
                DEVTO_URL
             } = <{ DEVTO_USERNAME: string, DEVTO_API_KEY: string, DEVTO_URL: string }>devToEnv;

            const headers = { 'api-key': DEVTO_API_KEY };
            const { data, status }: AxiosResponse = await axios.get(`${DEVTO_URL}/articles/${articleId}`, { headers });
            const article: typeof data = await sanitizeDevToMarkdown(data.body_markdown as string);

            if (status < 200 || status >= 300 || data.length < 1) return {
                error: true,
                message: 'Failed to fetch articles from DevTo.',
                data: null,
                status
            }

            return {
                error: false,
                message: 'OK',
                data: {
                    id: articleId.toString(),
                    title: data.title,
                    content: article,
                    tags: data.tags,
                    likes: data.positive_reactions_count,
                    createdAt: new Date(data.created_at),
                    updatedAt: new Date(data.edited_at ?? data.created_at),
                    published: true,
                    publish_date: data.readable_publish_date,
                    author: data.user.name
                },
                status
            };
            
        },
        createNew: async function({ 
            blogPost, 
            env 
        }: ArticlePostRequest){
            let devToEnv = env as DevToEnv;

            if (devToEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                devToEnv = publicRuntimeConfig;
            }

            const { 
                DEVTO_API_KEY,
                DEVTO_URL
             } = <{ DEVTO_USERNAME: string, DEVTO_API_KEY: string, DEVTO_URL: string }>devToEnv;

            const headers = { 'api-key': DEVTO_API_KEY };
            const tags = blogPost.tags.length > 0 ? blogPost.tags : [
                Case.camel(blogPost.title)
            ]

            const { data, status }: AxiosResponse = await axios.post(
                `${DEVTO_URL}/articles`, 
                { 
                    headers,
                    data: {
                        title: blogPost.title,
                        published: true,
                        body_markdown: blogPost.content,
                        tags: tags
                    } 
                }
            );

            if (status < 200 || status >= 300 || data.length < 1) return {
                error: true,
                message: 'Failed to fetch articles from DevTo.',
                data: null,
                status
            }

            return {
                error: false,
                message: 'OK',
                data: {
                    id: data.id,
                    title: data.title,
                    content: await sanitizeDevToMarkdown(data.body_markdown),
                    tags: data.tags,
                    likes: data.positive_reactions_count,
                    createdAt: new Date(data.created_at),
                    updatedAt: new Date(data.edited_at ?? data.created_at),
                    published: true,
                    publish_date: data.readable_publish_date,
                    author: data.user.name
                },
                status
            };
        }
    }
}

export const devTo = {
    Client
}
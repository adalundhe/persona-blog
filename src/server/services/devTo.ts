import axios, { AxiosResponse } from 'axios';
import getConfig from "next/config";
import Case from 'case';
import { ArticleFetchRequest, FetchRequest, CreatePostRequest, DevToData, DevToEnv } from 'types/server/services/types';



const { publicRuntimeConfig } = getConfig();
const devToEnv = publicRuntimeConfig as DevToEnv;


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
            count
        }: FetchRequest){

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
                data: articles.map((article: typeof articles[0]) => article.id).slice(0, parseInt(count as string)),
                status
            };
        },
        fetchArticle: async function ({ 
            articleId
        }: ArticleFetchRequest) {

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
        createOrUpdate: async function({ 
            blogPost, 
            update 
        }: CreatePostRequest){

            const { 
                DEVTO_API_KEY,
                DEVTO_URL
             } = <{ DEVTO_USERNAME: string, DEVTO_API_KEY: string, DEVTO_URL: string }>devToEnv;

            const headers = { 
                'api-key': `${DEVTO_API_KEY}`,             
                "Content-Type": "application/json" 
            };

            const tags = blogPost.tags.length > 0 ? blogPost.tags.map(
                (tag: string) => Case.kebab(tag)
            ) : [
                Case.kebab(blogPost.title)
            ]

            let parsedTags: string[] = [];
            for (const tag in tags){
                const splitTag = tag.split('-');
                parsedTags = [
                    ...parsedTags,
                    ...splitTag
                ];
            }

            let devToRequestData: DevToData;
            let devToRequestStatus: number;
            
            if (update){

                const { data, status }: AxiosResponse = await axios.put(
                    `${DEVTO_URL}/articles/${blogPost.devToId}`, 
                    {
                        article: {
                            title: blogPost.title,
                            published: true,
                            body_markdown: blogPost.content,
                            tags: parsedTags
                        }
                    },
                    {
                        headers
                    }
                );

                devToRequestData = data;
                devToRequestStatus = status;

            }
            else {
                const { data, status }: AxiosResponse = await axios.post(
                    `${DEVTO_URL}/articles`, 
                    {
                        article: {
                            title: blogPost.title,
                            published: true,
                            body_markdown: blogPost.content,
                            tags: parsedTags
                        }
                    },
                    {
                        headers
                    }
                );

                devToRequestData = data;
                devToRequestStatus = status;
            }

            if (devToRequestStatus < 200 || devToRequestStatus >= 300) return {
                error: true,
                message: 'Failed to fetch articles from DevTo.',
                data: null,
                status: devToRequestStatus
            }

            return {
                error: false,
                message: 'OK',
                data: {
                    id: devToRequestData.id.toString(),
                    title: devToRequestData.title,
                    content: await sanitizeDevToMarkdown(
                        devToRequestData.body_markdown
                    ),
                    tags: devToRequestData.tags,
                    likes: devToRequestData.positive_reactions_count,
                    createdAt: new Date(devToRequestData.created_at),
                    updatedAt: new Date(
                        devToRequestData.edited_at ?? devToRequestData.created_at
                    ),
                    published: true,
                    publish_date: devToRequestData.readable_publish_date,
                    author: devToRequestData.user.name
                },
                status: devToRequestStatus
            };
        }
    }
}

export const devTo = {
    Client
}
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import getConfig from "next/config";
import Case from 'case';
import getUuid from 'uuid-by-string';
import { ArticleLinkFetchRequest, ArticlePostRequest, HashnodeData, HashnodeEnv } from 'types/server/services/types';


class Client {

    posts = {
        fetchLatest: async function ({ count, env }: ArticleLinkFetchRequest) {

            let hashnodeEnv = env as HashnodeEnv;

            if (hashnodeEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                hashnodeEnv = publicRuntimeConfig;
            }

            const client = new ApolloClient({
                uri: hashnodeEnv?.HASHNODE_URL,
                cache: new InMemoryCache(),
            });

            const { data, error } = await client.query({
                query: gql`
                    query GetPosts($user: String!, $pageNumber: Int!) {
                        user(username: $user) {
                            publication {
                                posts(page: $pageNumber){
                                    _id
                                    title
                                    contentMarkdown
                                    author {
                                        username
                                    }
                                    totalReactions
                                    dateAdded
                                    dateUpdated
                                }
                            }
                        }
                    }
            `,
            variables: {
                user: hashnodeEnv?.HASHNODE_USERNAME as string,
                pageNumber: 0
            }
            });

            if (error){
                return {
                    error: true,
                    message: error.message,
                    data: null,
                    status: 400
                }
            }

            const hashnodePosts = data.user.publication.posts ?? []
            const postData = hashnodePosts.map((post: typeof hashnodePosts[0]) => ({
                id: post._id,
                title: post.title,
                content: post.contentMarkdown,
                tags: [], // Tags are currently broken on Hashnode.
                likes: post.totalReactions,
                createdAt: new Date(post.dateAdded),
                updatedAt: new Date(post.dateUpdated ?? post.dateAdded),
                published: true,
                publish_date: post.dateUpdated ?? post.dateAdded,
                author: post.author.username
            }));
            


            return {
                error: false,
                message: 'OK',
                data: postData.length > count ? postData.slice(0, count) : postData,
                status: 200
            };
            
        },
        createOrUpdate: async function({ 
            blogPost, 
            env,
            update 
        }: ArticlePostRequest){

            let hashnodeEnv = env as HashnodeEnv;

            if (hashnodeEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                hashnodeEnv = publicRuntimeConfig;
            }

            const client = new ApolloClient({
                uri: hashnodeEnv?.HASHNODE_URL,
                cache: new InMemoryCache(),
                headers: {
                    Authorization: hashnodeEnv.HASHNODE_API_KEY 
                }
            });

            const blogPostTags = blogPost.tags.length > 0 ? blogPost.tags.map(
                (tag: string) => ({
                    _id: getUuid(blogPost.title).split('-').pop(),
                    slug: tag,
                    name: tag

                })
            ) : [
                {
                    _id: getUuid(blogPost.title).split('-').pop(),
                    slug: Case.camel(blogPost.title),
                    name: Case.camel(blogPost.title)
                }
            ]

            const serializedPost = {
                title: blogPost.title,
                slug: Case.kebab(blogPost.title),
                contentMarkdown: blogPost.content,
                tags: blogPostTags
            };

            let hashnodeData: HashnodeData;

            if (update) {
                const { data } = await client.mutate({
                    mutation: gql`
                        mutation updateStory($input: CreateStoryInput!, $postId: String!) {
                            updateStory(input: $input, postId: $postId) {
                                code
                                success
                                message
                                post {
                                    _id
                                    dateAdded
                                    dateUpdated
                                }
                            }
                        }
                    `,
                    variables: {
                        input: serializedPost,
                        publicationId: hashnodeEnv?.HASHNODE_PUBLICATION_ID as string
                    }
                });

                hashnodeData = data.createPublicationStory;
            }
            else {
                const { data } = await client.mutate({
                    mutation: gql`
                        mutation createStory($input: CreateStoryInput!, $publicationId: String!) {
                            createPublicationStory(input: $input, publicationId: $publicationId) {
                                code
                                success
                                message
                                post {
                                    _id
                                    dateAdded
                                    dateUpdated
                                }
                            }
                        }
    
                    `,
                    variables: {
                        input: serializedPost,
                        publicationId: hashnodeEnv?.HASHNODE_PUBLICATION_ID as string
                    }
                });

                hashnodeData = data.createPublicationStory;
    
            }


            const error = hashnodeData.success === false;

            if (error){
                return {
                    error: error,
                    message: hashnodeData.message,
                    data: null,
                    status: hashnodeData.code
                }
            }

            const post = hashnodeData.post;

            return {
                error: error,
                message: 'OK',
                data: {
                    id: post._id as string,
                    createdAt: blogPost.createdAt ? blogPost.createdAt : new Date(post.dateAdded),
                    updatedAt: new Date(post.dateUpdated ?? post.dateAdded),
                    published: true,
                    publish_date: post.dateUpdated ?? post.dateAdded,
                },
                status: hashnodeData.code
            };

        },
        updateExisting: async function({ blogPost, env }: ArticlePostRequest){

            let hashnodeEnv = env as HashnodeEnv;

            if (hashnodeEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                hashnodeEnv = publicRuntimeConfig;
            }

            const client = new ApolloClient({
                uri: hashnodeEnv?.HASHNODE_URL,
                cache: new InMemoryCache(),
                headers: {
                    Authorization: hashnodeEnv.HASHNODE_API_KEY 
                }
            });

            const blogPostTags = blogPost.tags.length > 0 ? blogPost.tags.map(
                (tag: string) => ({
                    _id: getUuid(blogPost.title).split('-').pop(),
                    slug: tag,
                    name: tag

                })
            ) : [
                {
                    _id: getUuid(blogPost.title).split('-').pop(),
                    slug: Case.camel(blogPost.title),
                    name: Case.camel(blogPost.title)
                }
            ]

            const serializedPost = {
                title: blogPost.title,
                slug: Case.kebab(blogPost.title),
                contentMarkdown: blogPost.content,
                tags: blogPostTags
            };

            const { data } = await client.mutate({
                mutation: gql`
                    mutation updateStory($input: CreateStoryInput!, $postId: String!) {
                        updateStory(input: $input, postId: $postId) {
                            code
                            success
                            message
                            post {
                                _id
                                dateAdded
                                dateUpdated
                            }
                        }
                    }
                `,
                variables: {
                    input: serializedPost,
                    publicationId: hashnodeEnv?.HASHNODE_PUBLICATION_ID as string
                }
            });

            const error = data.createPublicationStory.success === false;

            if (error){
                return {
                    error: error,
                    message: data.createPublicationStory.message,
                    data: null,
                    status: data.createPublicationStory.code
                }
            }

            const post = data.createPublicationStory.post;

            return {
                error: error,
                message: 'OK',
                data: {
                    id: post._id as string,
                    createdAt: blogPost.createdAt ? blogPost.createdAt : new Date(post.dateAdded),
                    updatedAt: new Date(post.dateUpdated ?? post.dateAdded),
                    published: true,
                    publish_date: post.dateUpdated ?? post.dateAdded,
                },
                status: data.createPublicationStory.code
            };

        }
    }

}

export const hashnode = {
    Client
}
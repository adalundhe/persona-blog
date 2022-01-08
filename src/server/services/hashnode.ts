import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import getConfig from "next/config";
import Case from 'case';
import { GRAPHQL_MAX_INT, GRAPHQL_MIN_INT } from 'graphql';
import { ArticleLinkFetchRequest, ArticlePostRequest, HashnodeEnv } from 'types/server/services/types';



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
        createNew: async function({ blogPost, env }: ArticlePostRequest){

            let hashnodeEnv = env as HashnodeEnv;

            if (hashnodeEnv === undefined){
                const { publicRuntimeConfig } = getConfig();
                hashnodeEnv = publicRuntimeConfig;
            }

            const client = new ApolloClient({
                uri: hashnodeEnv?.HASHNODE_URL,
                cache: new InMemoryCache(),
            });

            const blogPostTags = blogPost.tags.length > 0 ? blogPost.tags : [
                {
                    _id: `${Math.random() * (GRAPHQL_MAX_INT - GRAPHQL_MIN_INT)}`,
                    slug: Case.camel(blogPost.title),
                    name: Case.camel(blogPost.title)
                }
            ]


            const { data, error } = await client.query({
                query: gql`
                    mutation createStory($input: CreateStoryInput!, $publicationId: String!) {
                        createPublicationStory(input: $input, publicationId: $publicationId) {
                            code
                            success
                            message
                            post {
                                _id
                                dateAdded
                                dateUpdated,

                            }
                        }
                    }

                `,
                variables: {
                    input: {
                        title: blogPost.title,
                        slug: Case.kebab(blogPost.title),
                        contentMarkdown: blogPost.content,
                        tags: blogPostTags
                    },
                    publicationId: hashnodeEnv?.HASHNODE_PUBLICATION_ID as string
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

            const post = data.post;

            return {
                error: data.success,
                message: 'OK',
                data: {
                    id: post.id as string,
                    createdAt: blogPost.createdAt ? blogPost.createdAt : new Date(post.dateAdded),
                    updatedAt: new Date(post.dateUpdated ?? post.dateAdded),
                    published: true,
                    publish_date: post.dateUpdated ?? post.dateAdded,
                },
                status: data.code
            };

        }
    }

}

export const hashnode = {
    Client
}
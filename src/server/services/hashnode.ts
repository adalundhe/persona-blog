import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import getConfig from "next/config";
import Case from 'case';
import getUuid from 'uuid-by-string';
import { FetchRequest, CreatePostRequest, HashnodeData, HashnodeEnv } from 'types/server/services/types';


const { publicRuntimeConfig } = getConfig();
const hashnodeEnv = publicRuntimeConfig as HashnodeEnv;


class Client {

    posts = {
        fetchLatest: async function ({ count }: FetchRequest) {


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
            update 
        }: CreatePostRequest){

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
                isPartOfPublication: {
                    publicationId: hashnodeEnv.HASHNODE_PUBLICATION_ID
                },
                tags: blogPostTags
            };

            let hashnodeData: HashnodeData;

            if (update) {
                const { data } = await client.mutate({
                    mutation: gql`
                        mutation updateStory($input: UpdateStoryInput!, $postId: String!) {
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
                        postId: blogPost.hashnodeId as string
                    }
                });

                hashnodeData = data.updateStory;
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

        }
    }

}

export const hashnode = {
    Client
}
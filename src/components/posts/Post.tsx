import { BlogPost } from "@prisma/client"
import { PostHeader } from "./header"
import { PostContent } from "./content"

export const Post = ({ ...post }: BlogPost) => {

    return (
        <div>
            <PostHeader 
                createdDate={post.createdAt}
                title={post.title}
            />
            <PostContent
                content={post.content}
            />
        </div>
    )
}
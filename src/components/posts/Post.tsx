import { BlogPost } from "@prisma/client"
import { PostHeader } from "./header"
import { PostContent } from "./content"

export const Post = ({ 
    post, 
    showPost,
    idx,
    displayed,
    updateDisplayed 
}: {
    post: BlogPost, 
    showPost: boolean,
    idx: number, 
    displayed: boolean[], 
    updateDisplayed: React.Dispatch<React.SetStateAction<boolean[]>>
}) => {

    return (
        <div className="w-full lg:w-1/2 bg-zinc-200 bg-opacity-25 pb-2 px-4 pt-2">
            <PostHeader 
                createdDate={post.createdAt}
                title={post.title}
                idx={idx}
                displayed={displayed}
                updateDisplayed={updateDisplayed}
            />
            {
                showPost ? <PostContent content={post.content}/> : undefined
            }
        </div>
    )
}
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
        <div className="w-full lg:w-3/4 bg-stone-100 pb-2 px-4 pt-2 shrink border border-slate-700/80">
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
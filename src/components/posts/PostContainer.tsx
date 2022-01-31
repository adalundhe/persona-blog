import { BlogPost } from "@prisma/client"
import { Post } from "./Post"

export const PostContainer = ({ 
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
        <Post
            post={post}
            showPost={showPost}
            idx={idx}
            displayed={displayed}
            updateDisplayed={updateDisplayed}
        />
    )

}

import { PostContainer } from "./PostContainer";
import { GetNextPageButton } from "./buttons";
import { BlogPost } from "@prisma/client";
import React from "react";


export const PostList = ({ 
    posts, 
    fetchNext,
    showFetchNext
}: {
    posts: BlogPost[], 
    fetchNext: () => void,
    showFetchNext: boolean
}) => {

    const [displayed, updateDisplayed] = React.useState(posts.map((_: BlogPost) => false));
    
    return (
        <div className="flex flex-col justify-center items-center px-8 mb-6">
        {
            posts.map((post: BlogPost, idx: number) => 
                <div id={`post-${idx}`} key={`blog-post${idx}`} className="w-screen lg:flex lg:flex-row lg:justify-center px-6 mt-6 py-2">
                    <PostContainer 
                        post={post} 
                        showPost={displayed[idx] as boolean}
                        idx={idx}
                        displayed={displayed}
                        updateDisplayed={updateDisplayed}
                    />
                </div>
            )
        }
        {
            showFetchNext ?
            <GetNextPageButton fetchNext={fetchNext} /> : undefined
        }
        </div>
    )
}
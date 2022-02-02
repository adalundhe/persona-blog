import { PostContainer } from "./PostContainer";
import { GetNextPageButton } from "./buttons";
import { BlogPost } from "@prisma/client";
import React from "react";
import { WeatherTypeContext } from "pages";


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
    const weatherContext = React.useContext(WeatherTypeContext);
    
    return (
        <div className="flex flex-col justify-start items-center px-8 py-8 ">
            <div className={`${weatherContext.style} flex flex-col justify-start items-center w-[95%] shadow pb-8`}>
            {
                posts.map((post: BlogPost, idx: number) => 
                    <div id={`post-${idx}`} key={`blog-post${idx}`} className={`w-full lg:flex lg:flex-row lg:justify-center shrink mt-6 py-2`}>
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
        </div>
    )
}
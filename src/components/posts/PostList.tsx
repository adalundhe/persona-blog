import { PostContainer } from "./PostContainer";
import { GetNextPageButton } from "./buttons";
import { BlogPost } from "@prisma/client";
import React from "react";


export const PostList = ({ 
    posts, 
    fetchNext,
    showFetchNext,
    WeatherContext
}: {
    posts: BlogPost[], 
    fetchNext: () => void,
    showFetchNext: boolean
    WeatherContext: React.Context<string> | null
}) => {

    const [displayed, updateDisplayed] = React.useState(posts.map((_: BlogPost) => false));
    const weatherStyle = WeatherContext ? React.useContext(WeatherContext) : '';
    
    return (
        <div className="flex flex-col justify-start items-center px-8 py-8">
            <div className={`${weatherStyle} flex flex-col justify-start items-center w-[95%] py-6`}>
            {
                posts.map((post: BlogPost, idx: number) => 
                    <div id={`post-${idx}`} key={`blog-post${idx}`} className={`w-full lg:flex lg:flex-row lg:justify-center shrink ${idx > 0 ? 'mt-6' : ''} py-2`}>
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
            <GetNextPageButton fetchNext={fetchNext} />
            </div>
        </div>
    )
}
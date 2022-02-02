import React from "react"
import { BlogPost } from "@prisma/client"
import { PostHeader } from "./header"
import { PostContent } from "./content"
import { WeatherTypeContext } from "pages"
import { TimeOptions, WeatherOptions } from "types/components/weather/types"

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

    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const backgroundStyle = weatherStyles.backgroundStyles[currentTime][currentWeather];
    const borderStyle = weatherStyles.borderStyles[currentTime][currentWeather];

    return (
        <div className={`w-full lg:w-3/4 ${backgroundStyle} pb-2 px-4 pt-2 shrink border ${borderStyle} shadow-md`}>
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
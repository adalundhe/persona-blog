import { getLatestDevToPosts, getLatestHashnodePosts, createNewDevToPost, createNewHashnodePost } from "./blogs";
import { getLatestCommits, getLocationWeather, streamTweets, getTwitterProfileStats } from "./content";

export default {
    blogs: {
        getLatestHashnodePosts,
        getLatestDevToPosts,
        createNewDevToPost,
        createNewHashnodePost
    },
    content: {
        getLatestCommits,
        getLocationWeather,
        streamTweets,
        getTwitterProfileStats
    }
}
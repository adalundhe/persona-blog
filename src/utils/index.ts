import { getLatestDevToPosts, getLatestHashnodePosts, createNewDevToPost, createNewHashnodePost } from "./blogs";
import { getLatestCommits, getLocationWeather, streamTweets, getTwitterProfileStats } from "./content";
import { weatherStyles, borderWeatherStyles, textWeatherStyles, backgroundWeatherStyles } from './weather'


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
    },
    weather: {
        weatherStyles,
        borderWeatherStyles,
        textWeatherStyles,
        backgroundWeatherStyles
    }
}
import { github, openWeather, twitter} from "server/services";
import { LatestCommitsRequest } from "types/utils/content";
import { LocationWeatherRequest } from "types/utils/content";

export const getLatestCommits = async ({ count }: LatestCommitsRequest) => {
    const GithubClient = new github.Client();

    return await GithubClient.commits.fetchLatestCommits({ 
        count
    });

}


export const getLocationWeather = async ({ latitude, longitude }: LocationWeatherRequest) => {
    const OpenWeatherClient = new openWeather.Client();

    return await OpenWeatherClient.weather.currentByLocation({
        latitude,
        longitude
    });

}


export const streamTweets = async () => {
    const TwitterClient = new twitter.Client();

    return await TwitterClient.tweets.getLatest()
}


export const getTwitterProfileStats = async () => {
    const TwitterClient = new twitter.Client();

    return await TwitterClient.profile.getStats();
}
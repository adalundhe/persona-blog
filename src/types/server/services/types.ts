import { BlogPost } from '@prisma/client'; 


export interface GithubEnv {
    GITHUB_USERNAME: string;
    GITHUB_PERSONAL_ACCESS_TOKEN: string;
}

export interface OpenWeatherEnv {
    OPEN_WEATHER_URL: string;
    OPEN_WEATHER_ICON_URL: string;
    OPEN_WEATHER_API_KEY: string;
}

export interface DevToEnv {
    DEVTO_USERNAME: string;
    DEVTO_API_KEY: string;
    DEVTO_URL: string;
}

export interface HashnodeEnv {
    HASHNODE_USERNAME: string;
    HASHNODE_API_KEY: string;
    HASHNODE_URL: string;
    HASHNODE_PUBLICATION_ID: string;
}

export interface TwitterEnv {
    TWITTER_API_KEY: string;
    TWITTER_API_KEY_SECRET: string;
    TWITTER_BEARER_TOKEN: string
    TWITTER_APP_ID: string;
    TWITTER_USERNAME: string;
    
}

export interface DevToData {
    id: number;
    title: string;
    body_markdown: string;
    tags: Array<string>;
    positive_reactions_count: number;
    created_at: string;
    edited_at: string;
    readable_publish_date: string;
    user: {
        name: string
    }
}

export interface HashnodeData {
    code: number;
    success: boolean;
    message: string;
    post: {
        _id: string;
        dateAdded: string;
        dateUpdated: string;
    }
}

export interface FetchRequest {
     count: string | number;
}

export interface ArticleFetchRequest {
    articleId: string;
    env?: DevToEnv;
}

export interface CreatePostRequest {
    blogPost: BlogPost;
    update?: boolean;
}

export interface Commit {
    sha: string,
    message: string,
    url: string
}

export interface CommitPayload {
    commits: Array<Commit>,
    head: string
}

export interface LocationWeather {
    id: number;
    main: string;
    description: string;
    icon: string;
}


export interface WeatherStats {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number
}

export interface WindStats {
    speed: number;
    deg: number;
    gust: number
}

export interface WeatherMetadata {
    type: number;
    id: number;
    country: string;
    sunrinse: number;
    sunset: number;
}

export interface WeatherPayload {
    coord: {
        lon: number;
        lat: number;
    },
    weather: Array<LocationWeather>;
    base: string;
    main: WeatherStats,
    visibility: number;
    wind: WindStats,
    sys: WeatherMetadata;
    timezone: number;
    id: number;
    name: string;
    cod: number
}


export interface Tweet {
    name: string;
    username: string;
    profileImage: string;
    tweet: string;
    likes: number;
    retweets: number;
}


export interface WeatherResponse {
    error: boolean,
    message: string,
    weather: {
        type: string,
        icon: string;
        description: string,
        currentTemp: number,
        currentTempFeel: number,
        dailyTempHigh: number,
        dailyTempLow: number,
        humidity: number,
        windSpeed: number,
        sunrise: number,
        sunset: number,
        locationName: string,
        country: string,
        timezone: number
    },
    status: number
}

export interface WeatherIconResponse {
    error: boolean;
    message: string;
    icon: any;
    status: number;
}
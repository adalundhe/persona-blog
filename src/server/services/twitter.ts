import TwitterApi, { ApiResponseError } from 'twitter-api-v2';
import getConfig from "next/config";
import { Tweet, TwitterEnv } from 'types/server/services/types';


const { publicRuntimeConfig } = getConfig();
const twitterEnv = publicRuntimeConfig as TwitterEnv;


class Client {
    profile = {
        getStats: async function(){
            const { TWITTER_API_KEY, TWITTER_API_KEY_SECRET, TWITTER_USERNAME } = twitterEnv;

            const { readOnly } = new TwitterApi({
                appKey: TWITTER_API_KEY,
                appSecret: TWITTER_API_KEY_SECRET,

            });

            const readClient = await readOnly.appLogin();

            const userData = await readClient.v2.userByUsername(TWITTER_USERNAME);
            const profileData = await readClient.v1.user({
                user_id: userData.data.id
            })

            return {
                error: false,
                message: 'OK',
                stats: {
                    name: userData.data.name,
                    username: `@${userData.data.username}`,
                    followers: profileData.followers_count,
                    tweets: profileData.statuses_count
                }
            }

        }
    }

    tweets = {
        getLatest: async function(){

            const { TWITTER_API_KEY, TWITTER_API_KEY_SECRET, TWITTER_USERNAME } = twitterEnv;

            const { readOnly } = new TwitterApi({
                appKey: TWITTER_API_KEY,
                appSecret: TWITTER_API_KEY_SECRET,

            });

            const readClient = await readOnly.appLogin();

            const userData = await readClient.v2.userByUsername(TWITTER_USERNAME);
            const profileData = await readClient.v1.user({
                user_id: userData.data.id
            })

            try {
                const latestTweets = await readClient.v2.search(`from:${TWITTER_USERNAME}`);
                let tweets: Array<Tweet> = []

                for (const tweet of latestTweets.data.data){

                    const tweetLikes = await readClient.v2.tweetLikedBy(tweet.id);
                    const tweetRetweets = await readClient.v2.tweetRetweetedBy(tweet.id);

                    tweets = [
                        ...tweets,
                        {
                            name: userData.data.name,
                            username: `@${userData.data.username}`,
                            profileImage: profileData.profile_image_url_https,
                            tweet: tweet.text,
                            likes: tweetLikes.data?.length ?? 0,
                            retweets: tweetRetweets?.data?.length ??0
                        }
                    ]

                }

                return {
                    error: false,
                    message: 'OK',
                    tweets: tweets,
                    status: 200
                }
                
            } catch (error) {

                const twitterError = error as ApiResponseError;
                return {
                    error: true,
                    message: twitterError.message,
                    data: null,
                    status: 400
                }
    
                
            }

        }
    }
}


export const twitter = {
    Client
}
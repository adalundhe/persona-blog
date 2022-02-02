import React from 'react';
import superjson from 'superjson';
import { trpc } from 'utils/trpc';
import { createTRPCClient } from '@trpc/client';
import { Posts } from 'components/'
import { BlogPost } from '@prisma/client';
import { AppRouter } from 'server/routers/_app';
import { WeatherCanvas } from 'components/weather';
import { NavBar } from 'components/navigation';
import axios, { AxiosResponse } from 'axios';
import getConfig from "next/config";
import { WeatherResponse } from 'types/server/services/types';
import { backgroundWeatherStyles, textWeatherStyles, borderWeatherStyles, weatherStyles } from 'utils/weather';


const { publicRuntimeConfig } = getConfig();


export const WeatherTypeContext = React.createContext({
  weather: "clear",
  time: "day",
  style: "bg-gradient-to-r from-slate-300 to-sky-200",
  textStyles: textWeatherStyles,
  backgroundStyles: backgroundWeatherStyles,
  borderStyles: borderWeatherStyles
});


const IndexPage = () => {

  const paginationLimit = 5;
  const client = createTRPCClient<AppRouter>({
    url: 'http://localhost:3000/api/trpc',
    transformer: superjson
  });

  const postData = trpc.useQuery([
    "post.paginated", 
    {
      limit: paginationLimit, 
      cursor: null
    }
  ]); 

  const [localWeather, updateLocalWeather] = React.useState<WeatherResponse>();
  const [blogPosts, updateBlogPosts] = React.useState(postData.data?.items as BlogPost[]);
  const [cursor, updateCursor] = React.useState(postData.data?.nextCursor as string);
  const [showFetchNext, updateShowFetchNext] = React.useState(postData.data?.items.length === paginationLimit);


  const fetchNext = async () => {

    const posts =  await client.query(
      'post.paginated', 
      {
        limit: 5, 
        cursor: cursor
      }
    )
    
    if(posts.items.length > 0){
      updateBlogPosts(posts.items as BlogPost[]);
      updateCursor(posts.nextCursor as string);
    }
    else {
      updateShowFetchNext(false)
    }

  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {

      const getWeather = async () => {
        const localWeather: AxiosResponse<WeatherResponse> = await axios.get(
          `${publicRuntimeConfig.API_URL}/content/weather/current`,
          {
            params: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }
        );

        updateLocalWeather(localWeather.data)
      }
  
      getWeather()
    });
    


  }, [])


  const weatherData = localWeather?.weather;

  let weatherStyle: string | null = null;
  let weatherType: "clear" | "partially_cloudy" | "overcast" | "rain" | "snow" | null = null;
  let dayOrNightOption: "day" | "night" | null = null;
  let background: string | null = null;

  if (weatherData){
    const currentDate = new Date()
    const currentUnixTime = parseInt((currentDate.getTime() / 1000).toFixed(0));
    const hours = currentDate.getHours();

    if (hours < 12){
      dayOrNightOption = currentUnixTime > weatherData.sunrise ? "day" : "night"
    }
    else {
      dayOrNightOption = currentUnixTime < weatherData.sunset ? "day" : "night"
    }

    weatherType = weatherData.type as "clear" | "partially_cloudy" | "overcast" | "rain" | "snow";

    weatherStyle = weatherStyles[dayOrNightOption][weatherType] as string;
    background = backgroundWeatherStyles[dayOrNightOption][weatherType] as string;

  }

  return (
    <WeatherTypeContext.Provider value={{
      weather: weatherType as string,
      time: dayOrNightOption as string,
      style: weatherStyle as string,
      textStyles: textWeatherStyles,
      backgroundStyles: backgroundWeatherStyles,
      borderStyles: borderWeatherStyles
    }}>
      {
        weatherType ? 
        <div className={`h-screen scroll-smooth ${background} overflow-x-hidden`}>
      {
        localWeather && blogPosts ? 
        <div className='h-full'>
            <div className='h-1/8'>
              <NavBar />
            </div>
            <WeatherCanvas
              localWeather={localWeather} 
            /> 
            <Posts.PostList 
                posts={blogPosts} 
                fetchNext={fetchNext}
                showFetchNext={showFetchNext}
              />
        </div> : <div>Loading...</div>
      }
      </div> : undefined
      }
  </WeatherTypeContext.Provider>
  );
};

export default IndexPage;
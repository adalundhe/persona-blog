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
import { WeatherStyles } from 'types/components/weather/types';
const { publicRuntimeConfig } = getConfig();


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



  const weatherStyles: {
      day: WeatherStyles,
      night: WeatherStyles
  } = {
      "day": {
          "clear": "bg-gradient-to-r from-slate-300 to-sky-200",
          "partially_cloudy": "bg-gradient-to-r from-slate-400 to-sky-200",
          "overcast": "bg-gradient-to-r from-zinc-500 to-zinc-600 ",
          "rain": "bg-gradient-to-r from-slate-600 to-slate-700",
          "snow": "bg-gradient-to-r from-gray-500 to-gray-600"
      },
      "night": {
          "clear": "bg-gradient-to-r from-slate-900 to-neutral-900",
          "partially_cloudy": "bg-gradient-to-r from-slate-900 to-neutral-900",
          "overcast": "bg-gradient-to-r from-stone-800 to-zinc-900 ",
          "rain": "bg-gradient-to-r from-slate-900 to-stone-900",
          "snow": "bg-gradient-to-r from-slate-900 to-gray-900"
      }
  };


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

  let WeatherContext: React.Context<string> | null = null;
  let WeatherTypeContext: React.Context<"clear" | "partially_cloudy" | "overcast" | "rain" | "snow"> | null = null;
  let DayNightContext: React.Context<"day" | "night"> | null = null;

  if (weatherData){
    const currentUnixTime = parseInt((new Date().getTime() / 1000).toFixed(0));
    const dayTimeString = currentUnixTime < weatherData.sunset || currentUnixTime > weatherData.sunrise  ? "day" : "night";
    console.log(currentUnixTime < weatherData.sunset, currentUnixTime < weatherData.sunrise)

    const localWeatherType = weatherData.type as "clear" | "partially_cloudy" | "overcast" | "rain" | "snow";

    const weatherStyle = weatherStyles[dayTimeString][localWeatherType];


    WeatherContext = React.createContext(weatherStyle);
    WeatherTypeContext = React.createContext(localWeatherType);
    DayNightContext = React.createContext(dayTimeString);

  }

  return (
   <div className='h-full bg-stone-100 overflow-x-hidden'>
     {
       localWeather && blogPosts ? 
       <div>
          <div className='h-1/8'>
            <NavBar />
          </div>
          <WeatherCanvas
            WeatherContext={WeatherContext} 
            DayNightContext={DayNightContext}
            localWeather={localWeather} 
          /> 
          <Posts.PostList 
              WeatherContext={WeatherContext} 
              posts={blogPosts} 
              fetchNext={fetchNext}
              showFetchNext={showFetchNext}
            />
       </div> : <div>Loading...</div>
     }
   </div>
  );
};

export default IndexPage;
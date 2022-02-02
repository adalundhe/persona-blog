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

const weatherStyles: {
  day: WeatherStyles,
  night: WeatherStyles
} = {
  day: {
    clear: "bg-gradient-to-r from-slate-300 to-sky-200",
    partially_cloudy: "bg-gradient-to-r from-slate-400 to-sky-200",
    overcast: "bg-gradient-to-r from-zinc-600 to-zinc-700/95",
    rain: "bg-gradient-to-r from-slate-600 to-slate-700",
    snow: "bg-gradient-to-r from-gray-500 to-gray-600"
  },
  night: {
    clear: "bg-gradient-to-r from-slate-900 to-neutral-900",
    partially_cloudy: "bg-gradient-to-r from-slate-900 to-neutral-900",
    overcast: "bg-gradient-to-r from-zinc-900/80 to-neutral-900/80",
    rain: "bg-gradient-to-r from-slate-900 to-stone-900",
    snow: "bg-gradient-to-r from-slate-900 to-gray-900"
  }
};

const borderWeatherStyles: {
    day: WeatherStyles,
    night: WeatherStyles
  } = {
  day: {
    clear: "border-slate-700/80",
    partially_cloudy: "border-slate-700/80",
    overcast: "border-neutral-400/90",
    rain: "border-zinc-300/50",
    snow: "border-zinc-300/50"
  },
  night: {
    clear: "border-slate-800/80",
    partially_cloudy: "border-slate-700/80",
    overcast: "border-slate-300/80",
    rain: "border-slate-200/50",
    snow: "border-slate-300/50"
  }
}

const textWeatherStyles: {
  day: WeatherStyles,
  night: WeatherStyles
} = {
day: {
  clear: {
    text: "text-gray-800/70",
    header: "text-gray-900/80",
    date: "text-neutral-500",
    get_more: "text-slate-800/90",
    get_more_hover: "hover:text-sky-800/90",
    read_more: "text-slate-700",
    highlight: "hover:text-sky-700/90"
  },
  partially_cloudy: {
    text: "text-gray-800/70",
    header: "text-gray-900/80",
    date: "text-neutral-500",
    get_more: "text-slate-800/90",
    get_more_hover: "hover:text-sky-800/90",
    read_more: "text-slate-700",
    highlight: "hover:text-sky-700/90"
  },
  overcast: {
    text: "text-gray-100/80",
    header: "text-neutral-200/90",
    date: "text-slate-400",
    get_more: "text-neutral-300/90",
    get_more_hover: "hover:text-zinc-100/90",
    read_more: "text-neutral-200/70",
    highlight: "hover:text-zinc-100/90"
  },
  rain: {
    text: "text-gray-100/80",
    header: "text-gray-100/80",
    date: "text-slate-400",
    get_more: "text-neutral-300/90",
    get_more_hover: "hover:text-zinc-100/90",
    read_more: "text-neutral-200/70",
    highlight: "hover:text-zinc-100/90"
  },
  snow: {
    text: "text-gray-100/80",
    header: "text-neutral-100/70",
    date: "text-slate-400",
    get_more: "text-neutral-300/90",
    get_more_hover: "hover:text-zinc-100/90",
    read_more: "text-neutral-200/70",
    highlight: "hover:text-zinc-100/90"
  }
},
night: {
    clear: {
      text: "text-gray-100/80",
      header: "text-neutral-100/70",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-zinc-100/90"
    },
    partially_cloudy: {
      text: "text-gray-100/80",
      header: "text-neutral-100/70",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-zinc-100/90"
    },
    overcast: {
      text: "text-gray-100/80",
      header: "text-gray-100/80",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-stone-100/90"
    },
    rain: {
      text: "text-gray-100/80",
      header: "text-gray-100/80",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-stone-100/90"
    },
    snow: {
      text: "text-gray-100/80",
      header: "text-neutral-100/70",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-zinc-100/90"
    }
  }
}

const backgroundWeatherStyles: {
    day: WeatherStyles,
    night: WeatherStyles
  } = {
  day: {
    clear: "bg-neutral-100",
    partially_cloudy: "bg-neutral-100",
    overcast: "bg-gradient-to-r from-[#4c4c4c] to-[#424d5b]",
    rain: "bg-slate-700",
    snow: "bg-gray-700/95"
  },
  night: {
    clear: "bg-gradient-to-r from-[#000011]/90 to-[#161d29]/95",
    partially_cloudy: "bg-gradient-to-r from-gray-900/95 to-[#161d29]",
    overcast: "bg-gray-800",
    rain: "bg-slate-800",
    snow: "bg-gray-900/95"
  }
}


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
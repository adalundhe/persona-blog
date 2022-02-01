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

  const weather = "sunny";

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




  return (
   localWeather && blogPosts ? 
   <div>
      <div className='h-1/5'>
        <NavBar />
      </div>
      <WeatherCanvas 
        localWeather={localWeather} 
      /> 
      <div className={`bg-stone-150" h-full`}>
        <Posts.PostList 
          posts={blogPosts} 
          fetchNext={fetchNext}
          showFetchNext={showFetchNext}
        />
      </div>
   </div> : <div>Loading...</div>
  );
};

export default IndexPage;
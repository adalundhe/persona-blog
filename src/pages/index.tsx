import React from 'react';
import superjson from 'superjson';
import { trpc } from 'utils/trpc';
import { createTRPCClient } from '@trpc/client';
import { Posts } from 'components/'
import { BlogPost } from '@prisma/client';
import { AppRouter } from 'server/routers/_app';
import { RainCanvas } from 'components/weather';
import { NavBar } from 'components/navigation';

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

  const [blogPosts, updateBlogPosts] = React.useState(postData.data?.items as BlogPost[]);
  const [cursor, updateCursor] = React.useState(postData.data?.nextCursor as string);
  const [showFetchNext, updateShowFetchNext] = React.useState(postData.data?.items.length === paginationLimit);

  const weather = "sunny";

  const weatherStyles = {
    "sunny": "bg-stone-150"
  }

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


  return (
   <div>
     <div className='h-1/5'>
       <NavBar />
     </div>
     <div className='h-2/5'>
      <RainCanvas />
     </div>
     {
        blogPosts ? 
        <div className={`${weatherStyles[weather]} h-full`}>
          <Posts.PostList 
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
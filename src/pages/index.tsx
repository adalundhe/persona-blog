import { trpc } from 'utils/trpc';
import { Posts } from 'components/'


const IndexPage = () => {

  const posts = trpc.useQuery([
    "post.paginated", 
    {
      limit: 5, 
      cursor: null
    }
  ]); 

  return (
    posts.data ? 
    <div>
      <Posts.PostList 
        posts={posts.data.items}  
      />
    </div> : <div>Loading...</div>
  );
};

export default IndexPage;
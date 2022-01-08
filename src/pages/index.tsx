import { trpc } from '../utils/trpc';
import utils from 'utils';
import { SerializableBlogPost } from 'types/utils/blogs';


export async function getStaticProps() {

  let posts: Array<SerializableBlogPost> = [];

  const devToPosts = await utils.blogs.getLatestDevToPosts({
    count: "1"
  });

  posts = devToPosts.props.data as Array<SerializableBlogPost>;

  for (const idx in posts){

    const blogPost = posts[idx] as SerializableBlogPost;

    if (blogPost.hashnodeId === null){
      const newHashNodePost = await utils.blogs.createNewHashnodePost({
        blogPost
      });

      posts[idx] = newHashNodePost.props.data as SerializableBlogPost;
    }

  }

  const hashnodePosts = await utils.blogs.getLatestHashnodePosts({
    count: "1"
  })

  for (const idx in hashnodePosts.props.data as Array<SerializableBlogPost>){

    const blogPost = hashnodePosts.props.data[idx] as SerializableBlogPost;

    if (blogPost.devToId === null){
      const newDevToPost = await utils.blogs.createNewDevToPost({
        blogPost
      });

      posts[idx] = newDevToPost.props.data as SerializableBlogPost;
    }

  }

  return {
    props: {
      error: false,
      message: 'OK',
      data: posts,
      status: 200
    }
  }

}

const IndexPage = () => {
  const posts = trpc.useQuery(["post.all"])
  console.log(posts.data)

  if (!posts.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>Hi!</p>
    </div>
  );
};

export default IndexPage;
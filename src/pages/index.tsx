import { trpc } from '../utils/trpc';
import utils from 'utils';
import { SerializableBlogPost } from 'types/utils/blogs';


export async function getStaticProps() {

  const devToPosts = await utils.blogs.getLatestDevToPosts({
    count: "1"
  });

  for (const idx in devToPosts.props.data){

    const blogPost = devToPosts.props.data[idx] as SerializableBlogPost;

    if (blogPost.hashnodeId === null){
      const newHashNodePost = await utils.blogs.createNewHashnodePost({
        blogPost
      });

      devToPosts.props.data[idx] = newHashNodePost.props.data as SerializableBlogPost;
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

      hashnodePosts.props.data[idx] = newDevToPost.props.data as SerializableBlogPost;
    }

  }

  return {
    props: {
      error: devToPosts.props.error || hashnodePosts.props.error,
      message: devToPosts.props.error ? devToPosts.props.message : hashnodePosts.props.error ? hashnodePosts.props.message : 'OK',
      data: [
        ...devToPosts.props.data,
        ...hashnodePosts.props.data
      ],
      status: (devToPosts.props.error || hashnodePosts.props.error) ? 400 : 200
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
import { trpc } from '../utils/trpc';
import utils from 'utils';


export async function getStaticProps() {
  return await utils.devTo.getLatestPosts({
    count: "1"
  });

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
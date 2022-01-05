import { trpc } from '../utils/trpc';

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
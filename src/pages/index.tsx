import { trpc } from '../utils/trpc';
import { InferGetServerSidePropsType } from 'next';


export async function getServerSideProps() {
  
  return {
    props: {
    }
  }

}

const IndexPage = ({ }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const posts = trpc.useQuery(["post.paginated", {limit: 2, cursor: null}]); 

  return (
    posts.data ? 
    <div>
      <p>Hi!</p>
    </div> : <div>Loading...</div>
  );
};

export default IndexPage;
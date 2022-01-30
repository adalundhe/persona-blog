import { Post } from "./Post";
import { BlogPost } from "@prisma/client";


export const PostList = ({ posts }: {posts: BlogPost[]}) => <div>
    {
        posts.map((post: BlogPost, idx: number) => 
            <div key={`blog-post${idx}`}>
                <Post {...post} />
            </div>
        )
    }
</div>
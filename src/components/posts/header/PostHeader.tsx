import { PostDateDisplay } from "./PostDateDisplay";
import { PostTitle } from "./PostTitle";


export const PostHeader = ({ 
    createdDate, 
    title 
}: {
        createdDate: Date, 
        title: string
}) =>
    <div>
        <PostDateDisplay
            createdDate={createdDate}
        />
        <PostTitle 
            title={title}
        />
    </div>

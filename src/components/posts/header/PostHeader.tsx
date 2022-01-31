import { PostDateDisplay } from "./PostDateDisplay";
import { PostTitle } from "./PostTitle";
import { ShowPostButton } from "../buttons";


export const PostHeader = ({ 
    createdDate, 
    title,
    idx,
    displayed,
    updateDisplayed 
}: {
        createdDate: Date, 
        title: string,
        idx: number, 
        displayed: boolean[], 
        updateDisplayed: React.Dispatch<React.SetStateAction<boolean[]>>
}) =>
    <div className="w-full">
        <div className="w-full flex flex-row">
            <PostDateDisplay
                createdDate={createdDate}
            />
            <ShowPostButton
                postIdx={idx}
                displayed={displayed}
                updateDisplayed={updateDisplayed}
            />
        </div>
        <PostTitle 
            title={title}
        />
    </div>

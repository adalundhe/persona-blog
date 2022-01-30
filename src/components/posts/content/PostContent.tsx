import { Markdown } from './markdown';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import "highlight.js/styles/night-owl.css";

export const PostContent = ({ content }: {content: string}) => {
    return (
        <div>
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={Markdown}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
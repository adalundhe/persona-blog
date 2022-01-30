import { HTMLAttributes, ReactNode } from "react";
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react'


export const ContextText = ({ ...props}: ReactMarkdownProps & HTMLAttributes<HTMLParagraphElement>) => {

    const children = Array.isArray(props.children) ? props.children : [ props.children ];

    return (
        <p>{
            children.map((child: ReactNode, idx: number) => {
                
                if (typeof child === "string" && child.includes("%[")){
                    // We can't support Hashnode's embeds right now.
                    return <div key={`post-content-${idx}`}></div> 
                }

                child

                return (
                    <div key={`post-content-${idx}`}>
                        {child}
                    </div>
                )
            })
        }</p>
    )
}
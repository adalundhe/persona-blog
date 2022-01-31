import { PropsWithChildren } from "react";
import type { CodeProps } from 'react-markdown/lib/ast-to-react';


export const Code = (props: PropsWithChildren<CodeProps>) => {

    const codeProps = {
        ...props,
        inline: props.inline ? "true" : "false"
    }

    return (
        <code {...codeProps} className={`${codeProps.className ?? "text-zinc-500 tracking-tighter"} text-sm md:text-base my-4`} />
    )
}
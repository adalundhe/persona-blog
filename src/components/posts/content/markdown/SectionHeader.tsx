import { HeadingProps } from 'react-markdown/lib/ast-to-react'


export const SectionHeader = ({ ...props}: HeadingProps) => 
<h1 {...props} className={`${props.className ?? ""} text-lg mt-4 mb-2 tracing-wide leading-6 font-medium`}>
    {props.children}
</h1>
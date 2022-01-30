import { HeadingProps } from 'react-markdown/lib/ast-to-react'


export const SectionHeader = ({ ...props}: HeadingProps) => <h1 {...props}>{props.children}</h1>
import { ImgHTMLAttributes } from 'react'
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react'

export const CustomImage = ({ ...props }: ReactMarkdownProps & ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />
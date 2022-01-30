import { PropsWithChildren } from "react";
import type { CodeProps } from 'react-markdown/lib/ast-to-react';


export const Code = (props: PropsWithChildren<CodeProps>) => <code {...props} />
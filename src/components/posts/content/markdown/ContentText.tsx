import { WeatherTypeContext } from "pages";
import React, { HTMLAttributes, ReactNode } from "react";
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react'
import { TextStyles, TimeOptions, WeatherOptions } from "types/components/weather/types";


export const ContextText = ({ ...props}: ReactMarkdownProps & HTMLAttributes<HTMLParagraphElement>) => {

    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles;

    const children = Array.isArray(props.children) ? props.children : [ props.children ];

    return (
        <p className={`${props.className ?? ""} my-1 text-sm ${textStyles.text}`}>{
            children.map((child: ReactNode) => {
                
                if (typeof child === "string" && child.includes("%[")){
                    // We can't support Hashnode's embeds right now.
                    return undefined
                }

                return (

                    child
                )
            })
        }</p>
    )
}
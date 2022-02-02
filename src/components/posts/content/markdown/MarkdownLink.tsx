import { WeatherTypeContext } from "pages";
import React, { AnchorHTMLAttributes } from "react";
import { ReactMarkdownProps } from "react-markdown/lib/ast-to-react";
import { TextStyles, TimeOptions, WeatherOptions } from "types/components/weather/types";


export const MarkdownLink = ({...props}:  ReactMarkdownProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {

    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles;

    return (
        <a className={`${textStyles.date} ${textStyles.highlight}`} href={props.href}>{props.children}</a>
    )
}
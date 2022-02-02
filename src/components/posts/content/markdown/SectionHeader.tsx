import { WeatherTypeContext } from 'pages';
import React from 'react';
import { HeadingProps } from 'react-markdown/lib/ast-to-react'
import { TextStyles, TimeOptions, WeatherOptions } from 'types/components/weather/types';


export const SectionHeader = ({ ...props}: HeadingProps) => {


    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles;

    return (
        <h1 {...props} className={`${props.className ?? ""} text-lg mt-4 mb-2 tracing-wide leading-6 font-medium ${textStyles.get_more}`}>
            {props.children}
        </h1>
    )
}
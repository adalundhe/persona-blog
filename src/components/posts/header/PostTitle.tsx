import { WeatherTypeContext } from "pages"
import React from "react"
import { TextStyles, TimeOptions, WeatherOptions } from "types/components/weather/types";

export const PostTitle = ({ title }: {title: string}) => {

    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles

    return (
        <h3 className={`mt-2 mb-4 text-xl font-bold leading-10 ${textStyles.header}`}>
            {title}
        </h3>
    )
}
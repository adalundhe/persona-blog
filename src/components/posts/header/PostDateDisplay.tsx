import { WeatherTypeContext } from "pages";
import React from "react";
import { TextStyles, TimeOptions, WeatherOptions } from "types/components/weather/types";

export const PostDateDisplay = ({ createdDate }: {createdDate: Date }) => {

    const createdDateString = createdDate.toDateString();
    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles;

    return (
        <div className="w-full">
            <p className={`italic font-xs ${textStyles.date}`}>
                {createdDateString}
            </p>
        </div>
    )
}
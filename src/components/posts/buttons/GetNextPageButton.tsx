import React from "react";
import { ArrowCircleDownIcon } from "@heroicons/react/solid"
import { WeatherTypeContext } from "pages"
import { TextStyles, TimeOptions, WeatherOptions } from "types/components/weather/types";

export const GetNextPageButton = ({ fetchNext }: {fetchNext: () => void}) => {

    const weatherStyles = React.useContext(WeatherTypeContext)
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;

    const backgroundStyle = weatherStyles.backgroundStyles[currentTime][currentWeather];
    const borderStyle = weatherStyles.borderStyles[currentTime][currentWeather];
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles;

    return (
        <div className={`my-6 flex flex-row justify-center h-1/8 w-full lg:w-3/4 pt-2 w-full ${backgroundStyle} border ${borderStyle}`}>
            <button onClick={fetchNext} className={`flex flex-row items-center justify-center tracing-wide leading-6 font-medium ${textStyles.get_more} ${textStyles.get_more_hover} flex-wrap h-1/8 text-sm`}>
                <ArrowCircleDownIcon className="h-1/8 w-1/8 m-0 text-center" />
                <p>
                    Next
                </p>
            </button>
        </div>
    )
}
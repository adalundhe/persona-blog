import React from "react";
import Link from "next/link";
import { WeatherTypeContext } from "pages";
import { TextStyles, TimeOptions, WeatherOptions } from "types/components/weather/types";

export const ShowPostButton = ({postIdx, displayed, updateDisplayed}: {postIdx: number, displayed: boolean[], updateDisplayed: React.Dispatch<React.SetStateAction<boolean[]>>}) => {

    const weatherStyles = React.useContext(WeatherTypeContext);
    const currentTime = weatherStyles.time as TimeOptions;
    const currentWeather = weatherStyles.weather as WeatherOptions;
    const textStyles = weatherStyles.textStyles[currentTime][currentWeather] as TextStyles;

    const onClick = () => { 
        updateDisplayed(displayed.map(
            (_: boolean, idx: number) => postIdx === idx ? !displayed[postIdx] : false
        ))
    }

    return (
        <div className="justify-self-end whitespace-nowrap flex flex-row justify-end">
            <button onClick={onClick} className={`text-sm leading-3 h-full w-full ${textStyles.read_more} px-6 ${textStyles.highlight} font-medium`}>
                <Link href={displayed[postIdx] ? `/#nav-bar` : `/#post-${postIdx}`}>
                    {
                        displayed[postIdx] ? 
                        "All done!"
                        : 
                        "Read me!"
                    }
                </Link>
            </button>
        </div>
    )
}
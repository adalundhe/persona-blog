import { WeatherResponse } from "types/server/services/types";
import getConfig from "next/config";
import Case from "case";
const { publicRuntimeConfig } = getConfig();

export const WeatherInfoWidget= ({ localWeather }: {localWeather: WeatherResponse}) => {
    const temp = Math.floor((localWeather.weather.currentTemp - 273.15) * 9/5 + 32);

    const celciusTemp = Math.floor((temp - 32) * 5/9)
 
    return (
        <div className="h-3/5 w-3/5 lg:w-1/5 bg-gradient-to-r from-slate-700/50 to-slate-700/60 absolute flex flex-row justify-content text-gray-50/80 p-0">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/80 flex flex-row flex-wrap mx-4 my-4 justify-content w-full">
                <div className="w-full flex flex-wrap flex-row justify-center mx-2 px-4 h-1/3">
                    <h1 className="lg:text-[3vw] inline-block text-center align-middle">
                        <p className="h-1/2 inline-block text-center align-middle">
                        {`${temp}\u00B0F`}
                        </p>
                    <p className="w-full text-center text-xs mt-2">{
                        `${celciusTemp}\u00B0C`
                    }</p>
                    </h1>
                </div>
                <div className="w-full flex flex-wrap flex-row justify-center mx-2 px-4 h-1/2 justify-content">
                    <h1 className=" mt-2 w-full h-1/2 flex flex-row justify-center flex-wrap">
                        <img  className="h-full w-1/4 w-full" src={`${publicRuntimeConfig.OPEN_WEATHER_ICON_URL}10d@2x.png`} />
                        <p className="w-full text-center text-xs inline-block text-center align-middle">
                            {
                                `${Case.capital(localWeather.weather.description)} - Humidity is ${localWeather.weather.humidity}%`
                            }
                        </p>
                    </h1>
                </div>
            </div>
        </div>
    )
}
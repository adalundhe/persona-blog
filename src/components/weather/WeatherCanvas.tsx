import React from "react";
import { WeatherResponse } from "types/server/services/types";
import { RainProcessor, CloudProcessor, SnowProcessor } from "./processors";
import { WeatherInfoWidget } from "./WeatherInfoWidget";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}



export const WeatherCanvas = ({ localWeather }: {localWeather: WeatherResponse}) => {

    const [showWeatherWidget, updateShowWeaterWidget] = React.useState(false);

    type WeatherStyles = {
        sunny: string;
        partially_cloudy: string;
        overcast: string;
        rain: string;
        snow: string;
    }

    const weatherStyles: {
        day: WeatherStyles,
        night: WeatherStyles
    } = {
        "day": {
            "sunny": "animation bg-gradient-to-r from-indigo-200 to-sky-200 w-screen h-full",
            "partially_cloudy": "animation bg-gradient-to-r from-slate-400 to-sky-200 w-screen h-full",
            "overcast": "animation bg-gradient-to-r from-zinc-500 to-zinc-600  w-screen h-full",
            "rain": "animation bg-gradient-to-r from-slate-600 to-slate-700 w-screen h-full",
            "snow": "animation bg-gradient-to-r from-gray-500 to-gray-600 w-screen h-full"
        },
        "night": {
            "sunny": "animation bg-gradient-to-r from-slate-900 to-neutral-900 w-screen h-full",
            "partially_cloudy": "animation bg-gradient-to-r from-slate-900 to-neutral-900 w-screen h-full",
            "overcast": "animation bg-gradient-to-r from-stone-800 to-zinc-900  w-screen h-full",
            "rain": "animation bg-gradient-to-r from-slate-900 to-stone-900 w-screen h-full",
            "snow": "animation bg-gradient-to-r from-slate-900 to-gray-900 w-screen h-full"
        }
    };

    const currentUnixTime = parseInt((new Date().getTime() / 1000).toFixed(0));
    const dayTimeString = currentUnixTime < localWeather.weather.sunset && currentUnixTime > localWeather.weather.sunrise  ? "day" : "night";

    const localWeatherType = localWeather.weather.type as "sunny" | "partially_cloudy" | "overcast" | "rain" | "snow"

    const weatherStyle = weatherStyles[dayTimeString][localWeatherType];
    

    React.useEffect(() => {
        if (localWeather.weather.type === "partially_cloudy" || localWeather.weather.type === "overcast"){
            new CloudProcessor({
                count: localWeather.weather.type === "partially_cloudy" ? 6 : 18,
                canvasSelector: "weather-canvas"
            });
        }
        else if (localWeather.weather.type === "rain"){
            new RainProcessor({
                count: 30,
                canvasSelector: "weather-canvas"
            });
        }
        else if (localWeather.weather.type === "snow"){
            new SnowProcessor({
                count: 25,
                canvasSelector: "weather-canvas"
            });
        }
        else {
            new CloudProcessor({
                count: 3,
                canvasSelector: "weather-canvas"
            });
        }

        if (typeof window !== "undefined") {
            const { height, width } = getWindowDimensions();
            updateShowWeaterWidget(height < 1000 || width < 1000 ? false : true);

            window.addEventListener('resize', (_) => {
                const { height, width } = getWindowDimensions();
                updateShowWeaterWidget(height < 1000 || width < 1000 ? false : true);
            });
        }
 
    }, []);


    return (
        <div className="w-screen relative flex flex-row justify-center items-center" id="canvas-container">
            {
                showWeatherWidget ? 
                <WeatherInfoWidget localWeather={localWeather} /> : undefined
            }
            <canvas id="weather-canvas" className={`${weatherStyle} block`}>
            </canvas>
        </div>
    )
}
import { WeatherTypeContext } from "pages";
import React from "react";
import { WeatherResponse } from "types/server/services/types";
import { RainProcessor, CloudProcessor, SnowProcessor, NightSkyProcessor } from "./processors";
import { WeatherInfoWidget } from "./WeatherInfoWidget";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}



export const WeatherCanvas = ({ 
    localWeather 
}: {
    localWeather: WeatherResponse
}) => {

    const [showWeatherWidget, updateShowWeaterWidget] = React.useState(false);    
    const weatherContext = React.useContext(WeatherTypeContext);

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
            
            if (weatherContext.time === "day"){
                new CloudProcessor({
                    count: 3,
                    canvasSelector: "weather-canvas"
                });
            }
            else {
                new NightSkyProcessor({
                    spacing: 30,
                    canvasSelector: "weather-canvas"
                })
            }

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
        <div className="w-screen relative flex flex-row justify-center items-center shadow-md" id="canvas-container">
            {
                showWeatherWidget ? 
                <WeatherInfoWidget localWeather={localWeather} /> : undefined
            }
            <canvas id="weather-canvas" className={`animation ${weatherContext.style} w-screen h-full block`}>
            </canvas>
        </div>
    )
}
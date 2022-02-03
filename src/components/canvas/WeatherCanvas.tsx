import { WeatherTypeContext } from "pages";
import React from "react";
import { WeatherResponse } from "types/server/services/types";
import { RainProcessor, CloudProcessor, SnowProcessor, NightSkyProcessor } from "./processors";
import { ProfilePictureWidget } from "./ProfilePictureWidget";
import { WeatherInfoWidget } from "./WeatherInfoWidget";


export const WeatherCanvas = ({ 
    localWeather 
}: {
    localWeather: WeatherResponse
}) => {

    const weatherContext = React.useContext(WeatherTypeContext);
    const resizeThreshold = 100;

    const [dimensions, setDimensions] = React.useState({ 
        height: window.innerHeight,
        width: window.innerWidth
    });

    React.useEffect(() => {
        function handleResize() {
          if (dimensions.height - window.innerHeight > resizeThreshold || dimensions.width - window.innerWidth > resizeThreshold){
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
              });

          }
        
        }
    
        window.addEventListener('resize', handleResize)
    });

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
                });
            }

        }
 
    }, []);

    return (
        <div className="w-screen relative flex flex-row justify-center items-center shadow-md" id="canvas-container">
            <WeatherInfoWidget localWeather={localWeather} />
            <ProfilePictureWidget />
            <canvas id="weather-canvas" className={`animation ${weatherContext.style} w-screen h-full block`}>
            </canvas>
        </div>
    )
}
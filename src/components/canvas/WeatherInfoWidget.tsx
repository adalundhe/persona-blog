import { WeatherResponse } from "types/server/services/types";
import getConfig from "next/config";
import Case from "case";
import React from "react";
import { WeatherTypeContext } from "pages";
const { publicRuntimeConfig } = getConfig();

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export const WeatherInfoWidget= ({ localWeather }: {localWeather: WeatherResponse}) => {
    const temp = Math.floor((localWeather.weather.currentTemp - 273.15) * 9/5 + 32);

    const weatherStyles = React.useContext(WeatherTypeContext);
    const borderStyle = weatherStyles.time === "day" ? "border-slate-900/80" : "border-gray-400/50";
    const resizeThreshold = 100;

    const [showWeatherWidget, updateShowWeatherWidget] = React.useState(false);   

    const celciusTemp = Math.floor((temp - 32) * 5/9)


    const [dimensions, setDimensions] = React.useState({ 
        height: window.innerHeight,
        width: window.innerWidth
      })
      React.useEffect(() => {
        function handleResize() {
          if (dimensions.height - window.innerHeight > resizeThreshold || dimensions.width - window.innerWidth > resizeThreshold){
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
              })
          }
        
        }
    
        window.addEventListener('resize', handleResize)
    })

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const { height, width } = getWindowDimensions();
            updateShowWeatherWidget(height <= 600 || width <= 800 ? false : true);

            window.addEventListener('resize', (_) => {
                const { height, width } = getWindowDimensions();
                updateShowWeatherWidget(height <= 600 || width <= 800 ? false : true);
                
            });
        }
    }, [])
 
    return (
      showWeatherWidget ?
      <div className={`transition duration-700 ease-in-out delay-150 h-${dimensions.height*4/5} w-${dimensions.width*1/8} bg-gradient-to-r from-slate-700/50 to-slate-700/60 absolute flex flex-row justify-content text-gray-50/80 p-0 shadow`}>
            <div className={`bg-gradient-to-r from-slate-800/50 to-slate-800/80 flex flex-row flex-wrap mx-4 my-4 justify-content w-full shadow-md border ${borderStyle} pt-4`}>
                <div className="w-full flex flex-wrap flex-row justify-center h-1/3">
                    <h1 className="lg:text-[3vw] inline-block text-center align-middle">
                        <p className="h-1/2 inline-block text-center">
                        {`${temp}\u00B0F`}
                        </p>
                    <p className="w-full text-center text-xs mt-2">{
                        `${celciusTemp}\u00B0C`
                    }</p>
                    </h1>
                </div>
                <div className="w-full flex flex-wrap flex-row justify-center h-1/2 justify-content">
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
        </div> : <div></div>
    )
}
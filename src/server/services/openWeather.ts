import axios, { AxiosResponse } from 'axios';
import getConfig from "next/config";
import { OpenWeatherEnv, WeatherPayload } from "types/server/services/types";
import { LocationWeatherRequest } from 'types/utils/content';

const { publicRuntimeConfig } = getConfig();
const openWeatherEnv = publicRuntimeConfig as OpenWeatherEnv;


class Client {

    weather = {
        currentByLocation: async function ({ latitude, longitude }: LocationWeatherRequest) {
            const { OPEN_WEATHER_URL, OPEN_WEATHER_API_KEY } = openWeatherEnv;
            const response: AxiosResponse = await axios.get(
                `${OPEN_WEATHER_URL}/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}`
            )

            const weatherData: WeatherPayload = response.data;
            const currentForecast = weatherData.weather.pop();


            return {
                error: false,
                message: 'OK',
                weather: {
                    type: currentForecast?.main,
                    description: currentForecast?.description,
                    currentTemp: weatherData.main.temp,
                    currentTempFeel: weatherData.main.feels_like,
                    dailyTempHigh: weatherData.main.temp_max,
                    dailyTempLow: weatherData.main.temp_min,
                    humidity: weatherData.main.humidity,
                    windSpeed: weatherData.wind.speed,
                    sunrise: weatherData.sys.sunrinse,
                    sunset: weatherData.sys.sunset,
                    locationName: weatherData.name,
                    country: weatherData.sys.country,
                    timezone: weatherData.timezone
                },
                status: response.status
            }
        }
    }
}

export const openWeather = {
    Client
}
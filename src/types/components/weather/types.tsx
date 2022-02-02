export interface TextStyles {
    text: string;
    header: string
    date: string;
    get_more: string;
    get_more_hover: string;
    read_more: string;
    highlight: string;
}


export interface WeatherStyles {
    clear: string | TextStyles;
    partially_cloudy: string | TextStyles;
    overcast: string | TextStyles;
    rain: string | TextStyles;
    snow: string | TextStyles;
}


export type TimeOptions = "day" | "night";
export type WeatherOptions = "clear" | "partially_cloudy" | "overcast" | "rain" | "snow"
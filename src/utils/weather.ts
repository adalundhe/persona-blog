import { WeatherStyles } from "types/components/weather/types";

export const weatherStyles: {
    day: WeatherStyles,
    night: WeatherStyles
  } = {
    day: {
      clear: "bg-gradient-to-r from-slate-300 to-sky-200",
      partially_cloudy: "bg-gradient-to-r from-slate-400 to-sky-200",
      overcast: "bg-gradient-to-r from-zinc-600 to-zinc-700/95",
      rain: "bg-gradient-to-r from-slate-600 to-slate-700",
      snow: "bg-gradient-to-r from-gray-500 to-gray-600"
    },
    night: {
      clear: "bg-gradient-to-r from-slate-900 to-neutral-900",
      partially_cloudy: "bg-gradient-to-r from-slate-900 to-neutral-900",
      overcast: "bg-gradient-to-r from-zinc-900/80 to-neutral-900/80",
      rain: "bg-gradient-to-r from-slate-900 to-stone-900",
      snow: "bg-gradient-to-r from-slate-900 to-gray-900"
    }
  };
  
  export const borderWeatherStyles: {
      day: WeatherStyles,
      night: WeatherStyles
    } = {
    day: {
      clear: "border-slate-700/80",
      partially_cloudy: "border-slate-700/80",
      overcast: "border-neutral-400/90",
      rain: "border-zinc-300/50",
      snow: "border-zinc-300/50"
    },
    night: {
      clear: "border-slate-800/80",
      partially_cloudy: "border-slate-700/80",
      overcast: "border-slate-300/80",
      rain: "border-slate-200/50",
      snow: "border-slate-300/50"
    }
  }
  
export const textWeatherStyles: {
    day: WeatherStyles,
    night: WeatherStyles
  } = {
  day: {
    clear: {
      text: "text-gray-800/70",
      header: "text-gray-900/80",
      date: "text-neutral-500",
      get_more: "text-slate-800/90",
      get_more_hover: "hover:text-sky-800/90",
      read_more: "text-slate-700",
      highlight: "hover:text-sky-700/90"
    },
    partially_cloudy: {
      text: "text-gray-800/70",
      header: "text-gray-900/80",
      date: "text-neutral-500",
      get_more: "text-slate-800/90",
      get_more_hover: "hover:text-sky-800/90",
      read_more: "text-slate-700",
      highlight: "hover:text-sky-700/90"
    },
    overcast: {
      text: "text-gray-100/80",
      header: "text-neutral-200/90",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-zinc-100/90"
    },
    rain: {
      text: "text-gray-100/80",
      header: "text-gray-100/80",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-zinc-100/90"
    },
    snow: {
      text: "text-gray-100/80",
      header: "text-neutral-100/70",
      date: "text-slate-400",
      get_more: "text-neutral-300/90",
      get_more_hover: "hover:text-zinc-100/90",
      read_more: "text-neutral-200/70",
      highlight: "hover:text-zinc-100/90"
    }
  },
  night: {
      clear: {
        text: "text-gray-100/80",
        header: "text-neutral-100/70",
        date: "text-slate-400",
        get_more: "text-neutral-300/90",
        get_more_hover: "hover:text-zinc-100/90",
        read_more: "text-neutral-200/70",
        highlight: "hover:text-zinc-100/90"
      },
      partially_cloudy: {
        text: "text-gray-100/80",
        header: "text-neutral-100/70",
        date: "text-slate-400",
        get_more: "text-neutral-300/90",
        get_more_hover: "hover:text-zinc-100/90",
        read_more: "text-neutral-200/70",
        highlight: "hover:text-zinc-100/90"
      },
      overcast: {
        text: "text-gray-100/80",
        header: "text-gray-100/80",
        date: "text-slate-400",
        get_more: "text-neutral-300/90",
        get_more_hover: "hover:text-zinc-100/90",
        read_more: "text-neutral-200/70",
        highlight: "hover:text-stone-100/90"
      },
      rain: {
        text: "text-gray-100/80",
        header: "text-gray-100/80",
        date: "text-slate-400",
        get_more: "text-neutral-300/90",
        get_more_hover: "hover:text-zinc-100/90",
        read_more: "text-neutral-200/70",
        highlight: "hover:text-stone-100/90"
      },
      snow: {
        text: "text-gray-100/80",
        header: "text-neutral-100/70",
        date: "text-slate-400",
        get_more: "text-neutral-300/90",
        get_more_hover: "hover:text-zinc-100/90",
        read_more: "text-neutral-200/70",
        highlight: "hover:text-zinc-100/90"
      }
    }
  }
  
export const backgroundWeatherStyles: {
      day: WeatherStyles,
      night: WeatherStyles
    } = {
    day: {
      clear: "bg-neutral-100",
      partially_cloudy: "bg-neutral-100",
      overcast: "bg-gradient-to-r from-[#4c4c4c] to-[#424d5b]",
      rain: "bg-slate-700",
      snow: "bg-gray-700/95"
    },
    night: {
      clear: "bg-gradient-to-r from-[#000011]/90 to-[#161d29]/95",
      partially_cloudy: "bg-gradient-to-r from-gray-900/95 to-[#161d29]",
      overcast: "bg-gray-800",
      rain: "bg-slate-800",
      snow: "bg-gray-900/95"
    }
  }
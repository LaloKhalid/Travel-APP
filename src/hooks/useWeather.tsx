import { useQuery } from '@tanstack/react-query';

export function useWeather(lat?: number, lon?:number){
    return useQuery({
        queryKey:["weather", lat, lon],
        queryFn:async () =>{
            if (lat == nul || lon == null) throw new Error ("Missing Coordinates");
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            if (!res.ok) throw new Error('Failed to fetch weather data');
            return res.json();
        },
        enabled: lat != null && lon != null,
    });
}
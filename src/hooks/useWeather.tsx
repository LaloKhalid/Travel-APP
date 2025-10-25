import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  description: string;
}

export function useWeather(lat?: number, lon?: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();

        if (data.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            description: "Current temperature (°C)",
          });
        } else {
          throw new Error("Weather data missing");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, loading, error };
}

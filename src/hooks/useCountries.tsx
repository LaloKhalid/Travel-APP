import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = import.meta.env.VITE_REST_COUNTRIES_API_KEY;

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          limit: 100,
        },
      });

      return data.data.objects.map((country: any) => ({
        name: {
          common: country.names?.common ?? "",
          official: country.names?.official ?? "",
        },

        region: country.region ?? "",
        subregion: country.subregion ?? "",

        capital: country.capitals?.map((c: any) => c.name) ?? [],

        flags: {
          png: country.flag?.url_png ?? "",
          svg: country.flag?.url_svg ?? "",
        },

        cca2: country.codes?.alpha_2 ?? "",
        cca3: country.codes?.alpha_3 ?? "",

        capitalInfo: {
          latlng: country.capitals?.[0]?.coordinates
            ? [
                country.capitals[0].coordinates.lat,
                country.capitals[0].coordinates.lng,
              ]
            : [],
        },

        latlng: country.coordinates
          ? [country.coordinates.lat, country.coordinates.lng]
          : [],

        population: country.population ?? 0,

        languages: country.languages
          ? Object.fromEntries(
              country.languages.map((lang: any, index: number) => [
                `lang${index}`,
                lang.name,
              ])
            )
          : {},

        currencies: country.currencies
          ? Object.fromEntries(
              country.currencies.map((currency: any) => [
                currency.code,
                {
                  name: currency.name,
                  symbol: currency.symbol,
                },
              ])
            )
          : {},
      }));
    },
  });
}
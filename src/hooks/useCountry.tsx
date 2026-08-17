import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = import.meta.env.VITE_REST_COUNTRIES_API_KEY;

export function useCountry(cca3: string | undefined) {
  return useQuery({
    queryKey: ["country", cca3],
    enabled: Boolean(cca3),

    queryFn: async () => {
      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          limit: 1,
          "codes.alpha_3": cca3,
        },
      });

      const country = data.data.objects?.[0];

      if (!country) {
        throw new Error("Country not found");
      }

      return {
        name: {
          common: country.names?.common ?? "",
          official: country.names?.official ?? "",
        },

        flags: {
          png: country.flag?.url_png ?? "",
          svg: country.flag?.url_svg ?? "",
        },

        region: country.region ?? "",
        subregion: country.subregion ?? "",

        capital: country.capitals?.map((c: any) => c.name) ?? [],

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

        cca3: country.codes?.alpha_3 ?? "",
      };
    },

    staleTime: 1000 * 60 * 5,
  });
}
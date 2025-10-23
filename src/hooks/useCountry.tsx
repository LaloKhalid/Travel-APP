// src/hooks/useCountry.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE = "https://restcountries.com/v3.1/alpha";

export function useCountry (cca3: string | undefined){
    return useQuery({
        queryKey: ["country", cca3],
        enabled: Boolean (cca3),
        queryFn: async () => {
            const url = `${BASE}/${cca3}?fields=name,flags,region,subregion,capital,population,languages,currencies,capitalInfo,latlng,cca3`;
            const res = await axios.get(url);

            return Array.isArray(res.data) ? res.data[0] : res.data;
        },
        staleTime:1000 * 60 * 5, //5 minutes 

        }
    )
};


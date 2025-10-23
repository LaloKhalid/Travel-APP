import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://restcountries.com/v3.1/all?fields=name,region,capital,flags,cca2,cca3,capitalInfo,latlng"




export function useCountries(){

    return useQuery({
        queryKey:["countries"],
        queryFn:async() => {
            const { data } = await axios.get(API_URL);
            return data;
        }
    })


    console.log("countries data:", countries)
}
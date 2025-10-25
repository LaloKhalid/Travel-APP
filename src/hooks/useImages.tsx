import { useQuery } from "@tanstack/react-query";

const UNSPLASH_ACCESS_KEY = "NtV1InsMD9AtSeYgM0q6Df1CgMKrYUPA_MuRLll-0pM";

export function useImages(countryName?: string) {
  return useQuery({
    queryKey: ["images", countryName],
    enabled: !!countryName,
    queryFn: async () => {
      if (!countryName) return [];
      if (!UNSPLASH_ACCESS_KEY) throw new Error("Missing Unsplash API key");

      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          countryName
        )}&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();

      // ✅ Return simplified image array

      console.log("Unsplash data:", data);

      return data.results.map((img: any) => ({
        id: img.id,
        url: img.urls.small,
        alt: img.alt_description || `Photo of ${countryName}`,
      }));
    },
  });
}

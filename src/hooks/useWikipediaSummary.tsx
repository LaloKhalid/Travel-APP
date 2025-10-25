import { useQuery } from "@tanstack/react-query";

// ✅ Named export (NOT default)
export function useWikipediaSummary(countryName?: string) {
  return useQuery({
    queryKey: ["wiki", countryName],
    queryFn: async () => {
      if (!countryName) throw new Error("No country name provided");

      // First, try fetching the main summary
      let res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          countryName
        )}`
      );

      // If not found (404), try searching
      if (res.status === 404) {
        const searchRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            countryName
          )}&format=json&origin=*`
        );
        const searchData = await searchRes.json();
        const firstResult = searchData?.query?.search?.[0]?.title;
        if (firstResult) {
          res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              firstResult
            )}`
          );
        }
      }

      if (!res.ok) throw new Error("Failed to fetch Wikipedia summary");
      return res.json();
    },
    enabled: !!countryName,
  });
}

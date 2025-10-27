import { useState, useEffect } from "react";
import { useCountries } from "../hooks/useCountries";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner"


const Home = () => {
  const { data: countries, isLoading, isError } = useCountries();
  const [searchParams, setSearchParams] = useSearchParams();

  // Helpers
  const parseNumberParam = (key: string, fallback: number) => {
    const v = searchParams.get(key);
    if (!v) return fallback;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  // Initialize state from URL
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [region, setRegion] = useState(searchParams.get("region") ?? "All");
  const [page, setPage] = useState(parseNumberParam("page", 1));
  const [pageSize, setPageSize] = useState(parseNumberParam("pageSize", 12));

  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];

  // Sync URL whenever query, region, page, or pageSize changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.query = query;
    if (region && region !== "All") params.region = region;
    if (page && page !== 1) params.page = String(page);
    if (pageSize && pageSize !== 12) params.pageSize = String(pageSize);

    setSearchParams(params);
  }, [query, region, page, pageSize, setSearchParams]);

  // Reset page when query or region changes
  useEffect(() => {
    setPage(1);
  }, [query, region]);

  // Filter countries
  const searched =
    countries?.filter((c: any) =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    ) ?? [];

  const filteredCountries =
    region === "All" ? searched : searched.filter((c: any) => c.region === region);

  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / pageSize));
  const paginated = filteredCountries.slice((page - 1) * pageSize, page * pageSize);

  if (!filteredCountries || filteredCountries.length === 0) {
  return (
    <main className="p-4 max-w-6xl mx-auto">
      {/* keep search & filters here or render message in place of grid */}
      <p className="mt-4 text-center">No countries match your criteria.</p>
    </main>
  );
}

  // Loading & error handling
  if (isLoading) return <main className="p-4"><Spinner /> Loading...</main>;
  if (isError) return <p>Failed to load countries.</p>;
  if (!countries || countries.length === 0) return <p>No countries found.</p>;

  // UI
  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Countries</h1>

      {/* Search Field */}
      <input
        type="text"
        placeholder="Search countries..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full max-w-md mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        aria-label="Search countries by name"
      />

      {/* Region Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-3 py-1 rounded border transition ${
              region === r ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Countries Grid */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {paginated.map((c: any) => (
          <li key={c.cca3} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
            <Link to={`/country/${c.cca3}`} className="block">
              <img
                src={c.flags?.png}
                alt={`Flag of ${c.name?.common}`}
                className="w-16 h-auto mb-2"
              />
              <h2 className="font-semibold">{c.name?.common}</h2>
              <p>{c.region}</p>
              <p>{c.capital?.[0] ?? "No capital"}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default Home;

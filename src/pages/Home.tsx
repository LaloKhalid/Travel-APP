import { useState, useEffect } from "react";
import { useCountries } from "../hooks/useCountries";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "../components/Spinner";

const Home = () => {
  const { data: countries, isLoading, isError } = useCountries();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [isPageLoading, setIsPageLoading] = useState(false);

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
    setIsPageLoading(true);
    setPage(1);
    const timer = setTimeout(() => setIsPageLoading(false), 200); // short delay for UX
    return () => clearTimeout(timer);
  }, [query, region]);

  // Page change handler
  const goToPage = (newPage: number) => {
    setIsPageLoading(true);
    setPage(newPage);
    setTimeout(() => setIsPageLoading(false), 200);
  };

  // Filter countries
  const searched =
    countries?.filter((c: any) =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    ) ?? [];

  const filteredCountries =
    region === "All" ? searched : searched.filter((c: any) => c.region === region);

  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / pageSize));
  const paginated = filteredCountries.slice((page - 1) * pageSize, page * pageSize);

  // Loading & error handling
  if (isLoading) return <main className="p-4"><Spinner /> Loading...</main>;
  if (isError) return <main className="p-4 text-red-500">Failed to load countries.</main>;
  if (!countries || countries.length === 0) return <main className="p-4">No countries found.</main>;

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Travel App</h1>

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

      {/* Countries Grid or Empty Message */}
      {isPageLoading ? (
        <div className="flex justify-center items-center h-32"><Spinner /></div>
      ) : paginated.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginated.map((c: any) => (
<li 
  key={c.cca3} 
  className="p-4 border rounded-lg shadow-sm hover:shadow-lg hover:shadow-md transition transform hover:scale-105"
>

             
             
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
      ) : (
        <p className="mt-4 text-center">Inga länder matchar dina kriterier.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(page + 1)}
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

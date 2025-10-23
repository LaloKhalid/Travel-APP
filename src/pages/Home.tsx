import { useState, useEffect } from "react";
import { useCountries } from "../hooks/useCountries";

const Home = () => {
  // -------------------------
  // ✅ Hooks at the very top
  // -------------------------
  const { data: countries, isLoading, isError } = useCountries();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];

  // -------------------------
  // Filter countries safely
  // -------------------------
  const searched = countries?.filter((c: any) =>
    c.name.common.toLowerCase().includes(query.toLowerCase())
  ) ?? [];

  const filteredCountries =
    region === "All"
      ? searched
      : searched.filter((c: any) => c.region === region);

  const totalPages = Math.ceil(filteredCountries.length / pageSize);
  const paginated = filteredCountries.slice((page - 1) * pageSize, page * pageSize);

  // -------------------------
  // Reset page when query or region changes
  // -------------------------
  useEffect(() => {
    setPage(1);
  }, [query, region]);

  // -------------------------
  // Early returns for loading / error / no data
  // -------------------------
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load countries.</p>;
  if (!countries || countries.length === 0) return <p>No countries found.</p>;

  // -------------------------
  // JSX
  // -------------------------
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

      {/* Region Filter Buttons */}
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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((c: any) => (
          <li
            key={c.cca3}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <img
              src={c.flags?.png}
              alt={`Flag of ${c.name?.common}`}
              className="w-16 h-auto mb-2"
            />
            <h2 className="font-semibold">{c.name?.common}</h2>
            <p>{c.region}</p>
            <p>{c.capital?.[0] ?? "No capital"}</p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
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

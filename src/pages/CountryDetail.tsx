import { useParams, useNavigate } from "react-router-dom";
import { useCountry } from "../hooks/useCountry";
import { useWikipediaSummary } from "../hooks/useWikipediaSummary";
import { useWeather } from "../hooks/useWeather";
import { useImages } from "../hooks/useImages";

export default function CountryDetail() {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();

  // Fetch country data
  const { data: country, isLoading, isError, refetch } = useCountry(code);

  // Safe coordinates for weather
  const lat = country?.capitalInfo?.latlng?.[0] || country?.latlng?.[0];
  const lon = country?.capitalInfo?.latlng?.[1] || country?.latlng?.[1];

  // Fetch weather data
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(lat, lon);

  // Fetch Wikipedia + Images
  const name = country?.name?.common ?? "";
  const { data: wiki, isLoading: wikiLoading } = useWikipediaSummary(name || undefined);
  const { data: images, isLoading: imagesLoading, isError: imagesError } = useImages(name);

  // Early returns
  if (isLoading) return <main className="p-4">Loading country...</main>;
  if (isError)
    return (
      <main className="p-4">
        <p>Failed to load country data.</p>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 border rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </main>
    );
  if (!country) return <main className="p-4">No data available for this country.</main>;

  // Safe derived fields
  const official = country.name?.official ?? "";
  const flag = country.flags?.png ?? country.flags?.svg ?? "";
  const capital = country.capital?.[0] ?? "No capital";
  const region = country.region ?? "";
  const population = country.population?.toLocaleString?.() ?? "—";
  const languages = country.languages ? Object.values(country.languages).join(", ") : "—";
  const currencies = country.currencies
    ? Object.values(country.currencies).map((c: any) => c.name).join(", ")
    : "—";

  return (
    <main className="p-4 max-w-4xl mx-auto" role="main" aria-labelledby="country-title">
      {/* ✅ Accessible back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Go back to country list"
      >
        ← Back
      </button>

      {/* ✅ Header with proper semantics */}
      <header className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {flag && (
          <img
            src={flag}
            alt={`Flag of ${name}`}
            className="w-32 h-auto rounded shadow-sm"
          />
        )}
        <div>
          <h1 id="country-title" className="text-3xl font-bold">{name || "Unknown"}</h1>
          {official && <p className="text-sm text-gray-600">{official}</p>}
          <p className="text-sm mt-1">{region} • {country?.subregion ?? ""}</p>
        </div>
      </header>

      {/* ✅ Responsive layout */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basics */}
        <article aria-labelledby="basics-heading">
          <h2 id="basics-heading" className="font-semibold text-lg mb-2">Basics</h2>
          <ul className="space-y-1">
            <li><strong>Capital:</strong> {capital}</li>
            <li><strong>Population:</strong> {population}</li>
            <li><strong>Languages:</strong> {languages}</li>
            <li><strong>Currencies:</strong> {currencies}</li>
          </ul>
        </article>

        {/* Coordinates, Weather, Wikipedia, Images */}
        <article aria-labelledby="weather-heading">
          <h2 id="weather-heading" className="font-semibold text-lg mb-2">Coordinates & Weather</h2>
          <p>Capital coords: {country.capitalInfo?.latlng?.[0] ?? "—"}, {country.capitalInfo?.latlng?.[1] ?? "—"}</p>
          <p>Country coords: {country.latlng?.[0] ?? "—"}, {country.latlng?.[1] ?? "—"}</p>

          {/* Weather */}
          <section className="mt-4" aria-label="Current weather">
            <h3 className="font-semibold">Current Weather</h3>
            {weatherLoading && <p>Loading weather...</p>}
            {weatherError && <p className="text-red-500">Failed to load weather.</p>}
            {weather && (
              <p className="mt-2">
                🌡️ {weather.temperature}°C — {weather.description}
              </p>
            )}
          </section>

          {/* Wikipedia Summary */}
          <section className="mt-6" aria-label="Country description">
            <h3 className="font-semibold">About {name || "this country"}</h3>
            {wikiLoading ? (
              <p>Loading description...</p>
            ) : wiki?.extract ? (
              <p className="mt-2">{wiki.extract}</p>
            ) : (
              <p className="mt-2">No description available.</p>
            )}
            {wiki?.content_urls?.desktop?.page && (
              <a
                href={wiki.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 block focus:ring-2 focus:ring-blue-500"
              >
                Read more on Wikipedia
              </a>
            )}
          </section>

          {/* Image Gallery */}
          <section className="mt-6" aria-labelledby="gallery-heading">
            <h3 id="gallery-heading" className="font-semibold mb-2">Gallery</h3>

            {imagesLoading && <p>Loading images...</p>}
            {imagesError && <p className="text-red-500">Failed to load images.</p>}

            {images?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img: any) => (
                  <a
                    key={img.id}
                    href={img.url.replace("&w=400&q=80", "&w=1080")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded overflow-hidden bg-gray-100 block transform transition duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-48 object-cover"
                    />
                  </a>
                ))}
              </div>
            ) : (
              !imagesLoading && <p>No images found for {name}.</p>
            )}

            <p className="text-sm text-gray-500 mt-2">
              Photos from{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline focus:ring-2 focus:ring-blue-500"
              >
                Unsplash
              </a>.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}

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

  // Always fetch Wikipedia summary and images safely
  const name = country?.name?.common ?? "";
  const { data: wiki, isLoading: wikiLoading } = useWikipediaSummary(name || undefined);
  const { data: images, isLoading: imagesLoading, isError: imagesError } = useImages(name);

  // Early returns
  if (isLoading) return <main className="p-4">Loading country...</main>;
  if (isError)
    return (
      <main className="p-4">
        <p>Failed to load country data.</p>
        <button onClick={() => refetch()} className="px-3 py-1 border rounded mt-2">
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
    <main className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border rounded"
        aria-label="Back to List"
      >
        Back
      </button>

      <header className="flex gap-4 items-center">
        {flag && <img src={flag} alt={`Flag of ${name}`} className="w-24 h-auto rounded" />}
        <div>
          <h1 className="text-2xl font-bold">{name || "Unknown"}</h1>
          {official && <p className="text-sm text-gray-600">{official}</p>}
          <p className="text-sm mt-1">{region} • {country?.subregion ?? ""}</p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Basics */}
        <div>
          <h2 className="font-semibold">Basics</h2>
          <ul className="mt-2">
            <li><strong>Capital:</strong> {capital}</li>
            <li><strong>Population:</strong> {population}</li>
            <li><strong>Languages:</strong> {languages}</li>
            <li><strong>Currencies:</strong> {currencies}</li>
          </ul>
        </div>

        {/* Coordinates, Weather, Wikipedia, Images */}
        <div>
          <h2 className="font-semibold">Coordinates & Weather</h2>
          <p className="mt-2">
            Capital coords: {country.capitalInfo?.latlng?.[0] ?? "—"}, {country.capitalInfo?.latlng?.[1] ?? "—"}
          </p>
          <p className="mt-2">
            Country coords: {country.latlng?.[0] ?? "—"}, {country.latlng?.[1] ?? "—"}
          </p>

          {/* Weather */}
          <section className="mt-4">
            <h2 className="font-semibold">Current Weather</h2>
            {weatherLoading && <p>Loading weather...</p>}
            {weatherError && <p className="text-red-500">Failed to load weather.</p>}
            {weather && <p className="mt-2">🌡️ {weather.temperature}°C — {weather.description}</p>}
          </section>

          {/* Wikipedia Summary */}
          <section className="mt-6">
            <h2 className="font-semibold">About {name || "this country"}</h2>
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
                className="text-blue-500 underline mt-2 block"
              >
                Read more on Wikipedia
              </a>
            )}
          </section>

          {/* Image Gallery */}
          <section className="mt-6">
            <h2 className="font-semibold mb-2">Gallery</h2>

            {imagesLoading && <p>Loading images...</p>}
            {imagesError && <p className="text-red-500">Failed to load images.</p>}

            {images?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {images.map((img: any) => (
                  <a
                    key={img.id}
                    href={img.url.replace("&w=400&q=80", "&w=1080")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded p-1 bg-gray-100 block overflow-hidden transform transition duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-48 object-cover rounded-lg"
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
                className="underline"
              >
                Unsplash
              </a>.
            </p>
          </section>

        </div>
      </section>
    </main>
  );
}

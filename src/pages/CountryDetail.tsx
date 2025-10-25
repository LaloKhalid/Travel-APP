import { useParams, useNavigate } from "react-router-dom";
import { useCountry } from "../hooks/useCountry";
import { useWikipediaSummary } from "../hooks/useWikipediaSummary";
import { useWeather } from "../hooks/useWeather";



export default function CountryDetail() {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const { data: country, isLoading, isError, refetch } = useCountry(code);

const capitalLat = country?.capitalInfo?.latlng?.[0];
const capitalLon = country?.capitalInfo?.latlng?.[1];
const fallbackLat = country?.latlng?.[0];
const fallbackLon = country?.latlng?.[1];

const lat = capitalLat ?? fallbackLat;
const lon = capitalLon ?? fallbackLon;

const { data: weather, isLoading: weatherLoading, isError: weatherError, refetch: refetchWeather } = useWeather(lat, lon);


  // ✅ Always call Wikipedia hook — even if country is null
  const name = country?.name?.common ?? "";
  const { data: wiki, isLoading: wikiLoading } = useWikipediaSummary(name || undefined);

  if (isLoading) {
    return <main className="p-4">Loading Country....</main>;
  }

  if (isError) {
    return (
      <main className="p-4">
        <p>Failed to Load Country.</p>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 border rounded mt-2"
        >
          Try Again
        </button>
      </main>
    );
  }

  if (!country) {
    return <main className="p-4">No Data for this Country.</main>;
  }

  // ✅ Safe derived fields
  const official = country?.name?.official ?? "";
  const flag = country?.flags?.png ?? country?.flags?.svg ?? "";
  const capital = country?.capital?.[0] ?? "No capital";
  const region = country?.region ?? "";
  const population =
    country?.population?.toLocaleString?.() ?? country?.population ?? "—";
  const languages = country?.languages
    ? Object.values(country.languages).join(", ")
    : "—";
  const currencies = country?.currencies
    ? Object.values(country.currencies)
        .map((c: any) => c.name)
        .join(", ")
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
        {flag && (
          <img
            src={flag}
            alt={`Flag of ${name}`}
            className="w-24 h-auto rounded"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{name || "Unknown"}</h1>
          {official && <p className="text-sm text-gray-600">{official}</p>}
          <p className="text-sm mt-1">
            {region} • {country?.subregion ?? ""}
          </p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold">Basics</h2>
          <ul className="mt-2">
            <li><strong>Capital:</strong> {capital}</li>
            <li><strong>Population:</strong> {population}</li>
            <li><strong>Languages:</strong> {languages}</li>
            <li><strong>Currencies:</strong> {currencies}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Coordinates</h2>
          <section className="mt-6">
  <h2 className="font-semibold">Current Weather</h2>
  {weatherLoading && <p>Loading weather...</p>}
  {weatherError && (
    <p>
      Failed to load weather.{" "}
      <button
        onClick={() => refetchWeather()}
        className="underline text-blue-500"
      >
        Try again
      </button>
    </p>
  )}
  {weather?.current_weather && (
    <p className="mt-2">
      🌡️ {weather.current_weather.temperature}°C —{" "}
      {weather.current_weather.weathercode === 0
        ? "Clear"
        : "Cloudy/Other"}{" "}
      (windspeed: {weather.current_weather.windspeed} km/h)
    </p>
  )}
</section>

          <p className="mt-2">
            Capital coords: {country?.capitalInfo?.latlng?.[0] ?? "—"},{" "}
            {country?.capitalInfo?.latlng?.[1] ?? "—"}
          </p>
          <p className="mt-2">
            Country coords: {country?.latlng?.[0] ?? "—"},{" "}
            {country?.latlng?.[1] ?? "—"}
          </p>

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
        </div>
      </section>
    </main>
  );
}

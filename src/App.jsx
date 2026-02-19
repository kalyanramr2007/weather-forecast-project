import { useEffect, useState } from 'react'
import './App.css'

const POPULAR_DESTINATIONS = [
  {
    name: 'Paris',
    country: 'France',
    image:
      'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image:
      'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'New York',
    country: 'USA',
    image:
      'https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    image:
      'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

const formatTemperature = (value) =>
  value != null ? `${Math.round(value)}°` : '--'

const formatWind = (value) =>
  value != null ? `${Math.round(value)} km/h` : '--'

const formatHumidity = (value) =>
  value != null ? `${Math.round(value)}%` : '--'

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Toggle theme"
      onClick={onToggle}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-icon">
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
    </button>
  )
}

function SearchBar({ value, onChange, onSubmit, isLoading }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search for a city..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        type="button"
        className="search-button"
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
      >
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </div>
  )
}

function AnimatedWeatherIcon({ code, isDay }) {
  if (!code) {
    return null
  }

  const group = Math.floor(code / 10)

  if (group === 0) {
    return (
      <div className={`icon-wrapper ${isDay ? 'icon-day' : 'icon-night'}`}>
        <div className="icon-sun" />
      </div>
    )
  }

  if (group === 1) {
    return (
      <div className="icon-wrapper icon-cloudy">
        <div className="icon-sun small" />
        <div className="icon-cloud" />
      </div>
    )
  }

  if (group === 2 || group === 3) {
    return (
      <div className="icon-wrapper icon-rain">
        <div className="icon-cloud large" />
        <div className="icon-rain-drops">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (group === 4) {
    return (
      <div className="icon-wrapper icon-storm">
        <div className="icon-cloud large" />
        <div className="icon-lightning" />
      </div>
    )
  }

  return (
    <div className="icon-wrapper icon-cloudy">
      <div className="icon-cloud" />
    </div>
  )
}

function WeatherOverviewCard({ city, current, daily }) {
  if (!city || !current) {
    return (
      <div className="panel panel-empty">
        <p>Search for a city to see its weather.</p>
      </div>
    )
  }

  const todayIndex = daily?.time?.findIndex((time) => time === current.date)
  const todayHigh =
    todayIndex != null && todayIndex >= 0
      ? daily.temperature_2m_max[todayIndex]
      : null
  const todayLow =
    todayIndex != null && todayIndex >= 0
      ? daily.temperature_2m_min[todayIndex]
      : null

  return (
    <section className="panel current-weather-panel">
      <div className="panel-header">
        <div>
          <h2>
            {city.name}, {city.country}
          </h2>
          <p className="panel-subtitle">{current.description}</p>
        </div>
        <AnimatedWeatherIcon code={current.weatherCode} isDay={current.isDay} />
      </div>

      <div className="current-main">
        <div className="current-temp">
          <span className="current-temp-value">
            {formatTemperature(current.temperature)}
          </span>
          <div className="current-temp-range">
            <span>H {formatTemperature(todayHigh)}</span>
            <span>L {formatTemperature(todayLow)}</span>
          </div>
        </div>
        <div className="current-meta">
          <div className="current-meta-item">
            <span className="label">Feels like</span>
            <span className="value">
              {formatTemperature(current.apparentTemperature)}
            </span>
          </div>
          <div className="current-meta-item">
            <span className="label">Humidity</span>
            <span className="value">{formatHumidity(current.humidity)}</span>
          </div>
          <div className="current-meta-item">
            <span className="label">Wind</span>
            <span className="value">{formatWind(current.wind)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ForecastCard({ day }) {
  return (
    <article className="forecast-card">
      <p className="forecast-day">{day.label}</p>
      <AnimatedWeatherIcon code={day.weatherCode} isDay />
      <p className="forecast-temp">
        <span>{formatTemperature(day.max)}</span>
        <span className="forecast-temp-min">{formatTemperature(day.min)}</span>
      </p>
    </article>
  )
}

function ForecastList({ daily }) {
  if (!daily?.time || daily.time.length === 0) {
    return null
  }

  const days = daily.time.slice(0, 7).map((iso, index) => {
    const date = new Date(iso)
    const label = index === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' })
    return {
      label,
      max: daily.temperature_2m_max[index],
      min: daily.temperature_2m_min[index],
      weatherCode: daily.weather_code[index],
    }
  })

  return (
    <section className="panel forecast-panel">
      <div className="panel-header">
        <h3>7-day forecast</h3>
      </div>
      <div className="forecast-grid">
        {days.map((day) => (
          <ForecastCard key={day.label} day={day} />
        ))}
      </div>
    </section>
  )
}

function TravelCard({ destination, onSelect, weather }) {
  return (
    <article className="travel-card" onClick={onSelect}>
      <div
        className="travel-card-bg"
        style={{ backgroundImage: `url(${destination.image})` }}
      />
      <div className="travel-card-overlay" />
      <div className="travel-card-content">
        <div>
          <h4>
            {destination.name}, {destination.country}
          </h4>
          {weather ? (
            <p className="travel-card-temp">
              {formatTemperature(weather.temperature)} · {weather.description}
            </p>
          ) : (
            <p className="travel-card-temp subtle">Tap to preview weather</p>
          )}
        </div>
      </div>
    </article>
  )
}

function TravelSection({ onSelectCity, previews }) {
  return (
    <section className="panel travel-panel">
      <div className="panel-header">
        <h3>Inspiration for your next trip</h3>
        <p className="panel-subtitle">
          Curated cities with quick weather previews.
        </p>
      </div>
      <div className="travel-grid">
        {POPULAR_DESTINATIONS.map((destination) => (
          <TravelCard
            key={destination.name}
            destination={destination}
            onSelect={() => onSelectCity(destination.name)}
            weather={previews[destination.name]}
          />
        ))}
      </div>
    </section>
  )
}

function LoadingOverlay() {
  return (
    <div className="loading-overlay" aria-live="polite">
      <div className="spinner" />
    </div>
  )
}

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="error-banner" role="status">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="error-dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  )
}

const WEATHER_CODE_MAP = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
}

function mapWeatherCodeToText(code) {
  if (!code && code !== 0) {
    return 'Weather data unavailable'
  }
  return WEATHER_CODE_MAP[code] || 'Mixed conditions'
}

async function fetchCityCoordinates(query) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query,
    )}&count=1&language=en&format=json`,
  )

  if (!response.ok) {
    throw new Error('Failed to search for the city.')
  }

  const data = await response.json()
  const result = data?.results?.[0]

  if (!result) {
    throw new Error('No results found for that city.')
  }

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

async function fetchWeather({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
  })

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error('Failed to load weather data.')
  }

  const data = await response.json()

  const now = data.current
  const daily = data.daily

  return {
    current: {
      date: daily.time?.[0],
      temperature: now.temperature_2m,
      apparentTemperature: now.apparent_temperature,
      humidity: now.relative_humidity_2m,
      weatherCode: now.weather_code,
      description: mapWeatherCodeToText(now.weather_code),
      wind: now.wind_speed_10m,
      isDay: Boolean(now.is_day),
    },
    daily,
  }
}

function App() {
  const [theme, setTheme] = useState('light')
  const [query, setQuery] = useState('')
  const [city, setCity] = useState(null)
  const [weather, setWeather] = useState({ current: null, daily: null })
  const [travelPreviews, setTravelPreviews] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    } else if (window.matchMedia) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const controller = new AbortController()

    async function bootstrap() {
      try {
        const initialCity = 'Paris'
        const [cityInfo, weatherInfo] = await Promise.all([
          fetchCityCoordinates(initialCity),
          (async () => {
            const parisCoordinates = { latitude: 48.8566, longitude: 2.3522 }
            return fetchWeather(parisCoordinates)
          })(),
        ])

        if (!controller.signal.aborted) {
          setCity(cityInfo)
          setWeather(weatherInfo)
          setQuery(initialCity)
        }
      } catch (error_) {
        if (!controller.signal.aborted) {
          console.error(error_)
        }
      }
    }

    bootstrap()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPreviews() {
      try {
        const results = await Promise.all(
          POPULAR_DESTINATIONS.map(async (destination) => {
            try {
              const coordinates = await fetchCityCoordinates(destination.name)
              const weatherInfo = await fetchWeather(coordinates)
              return {
                name: destination.name,
                preview: weatherInfo.current,
              }
            } catch (error_) {
              console.error(error_)
              return {
                name: destination.name,
                preview: null,
              }
            }
          }),
        )

        if (!controller.signal.aborted) {
          const map = {}
          results.forEach((result) => {
            if (result.preview) {
              map[result.name] = result.preview
            }
          })
          setTravelPreviews(map)
        }
      } catch (error_) {
        console.error(error_)
      }
    }

    loadPreviews()

    return () => controller.abort()
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const cityInfo = await fetchCityCoordinates(query.trim())
      const weatherInfo = await fetchWeather(cityInfo)

      setCity(cityInfo)
      setWeather(weatherInfo)
    } catch (error_) {
      console.error(error_)
      setError(error_.message || 'Something went wrong while fetching weather.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeToggle = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const handleSelectCityFromTravel = async (name) => {
    setQuery(name)
    await handleSearch(name)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">⛅</span>
          <div>
            <h1>Nomad Weather</h1>
            <p className="brand-subtitle">
              Minimal travel-focused weather dashboard.
            </p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
      </header>

      <main className="app-main">
        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          isLoading={isLoading}
        />

        <section className="layout-grid">
          <div className="layout-column primary">
            <WeatherOverviewCard
              city={city}
              current={weather.current}
              daily={weather.daily}
            />
            <ForecastList daily={weather.daily} />
          </div>
          <div className="layout-column secondary">
            <TravelSection
              onSelectCity={handleSelectCityFromTravel}
              previews={travelPreviews}
            />
          </div>
        </section>
      </main>

      {isLoading && <LoadingOverlay />}
    </div>
  )
}

export default App

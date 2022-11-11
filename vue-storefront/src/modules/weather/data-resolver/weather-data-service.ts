import config from 'config'

// Calls API fetch method by GET request, appending query strings to URL
const fetchWeatherData = async (queryString) => {
  let url = ''
  for (const [key, value] of Object.entries(queryString)) {
    url += `${key}=${value}&`
  }

  try {
    let response = await fetch(`${config.weather.endpoint}?${url}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    })
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    let weatherData = await response.json()
    return weatherData.result
  } catch (err) {
    console.log(err)
  }
}

export const WeatherDataResolver = {
  fetchWeatherData
}

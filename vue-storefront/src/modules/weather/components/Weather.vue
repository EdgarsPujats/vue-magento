<template>
  <form>
    <input @change="handleActiveInput(WEATHER.CURRENT)" type="radio" :id="WEATHER.CURRENT" name="weather"
           :value="WEATHER.CURRENT" :checked="activeInput === WEATHER.CURRENT"
    >
    <label :for="WEATHER.CURRENT">Current Weather</label>

    <input @change="handleActiveInput(WEATHER.FORECAST)" type="radio" :id="WEATHER.FORECAST" name="weather"
           :value="WEATHER.FORECAST" :checked="activeInput === WEATHER.FORECAST"
    >
    <label :for="WEATHER.FORECAST">Forecast Weather</label>

    <input @change="handleActiveInput(WEATHER.FUTURE)" type="radio" :id="WEATHER.FUTURE" name="weather"
           :value="WEATHER.FUTURE" :checked="activeInput === WEATHER.FUTURE"
    >
    <label :for="WEATHER.FUTURE">Future Weather</label>
    <div v-if="dateInputVisible">
      <label for="future-date">Enter date:</label>
      <input @change="handleFuture($event.target.value)" type="date" id="future-date" name="future-date"
             :value="weatherFutureDate" :min="minDate" :max="maxDate"
      >
    </div>

    <pre v-if="weatherData">{{ weatherData }}</pre>
  </form>
</template>

<script>
import { WeatherDataResolver } from '../data-resolver/weather-data-service';
import WEATHER from '../weather-types';

const ACTIVE_INPUT = 'activeInput'
const WEATHER_FUTURE_DATE = 'weather_future_date'

export default {
  data () {
    return {
      activeInput: false,
      weatherFutureDate: false,
      weatherData: false,
      dateInputVisible: false,
      WEATHER,
      array1: [
        [
          []
        ]
      ]
    }
  },
  watch: {
    // whenever question changes, this function will run
    array1 (newArray, oldArray) {
      console.log(oldArray)
    }
  },
  mounted () {
    let activeInput = localStorage.getItem(ACTIVE_INPUT)
    if (activeInput) {
      this.handleActiveInput(activeInput)
      this.activeInput = activeInput
    }

    let weatherFutureDate = localStorage.getItem(WEATHER_FUTURE_DATE)
    if (weatherFutureDate && activeInput === WEATHER.FUTURE) {
      this.weatherFutureDate = weatherFutureDate
      this.handleFuture(weatherFutureDate)
    } else {
      localStorage.removeItem(WEATHER_FUTURE_DATE)
    }
  },
  methods: {
    setDateInputVisible (value) {
      this.dateInputVisible = value
    },
    handleActiveInput: function (type) {
      this.array1[0] = [1,2,3]
      console.log(this.array1)

      if (type !== WEATHER.FUTURE) {
        this.setDateInputVisible(false)
      }

      localStorage.setItem(ACTIVE_INPUT, type)
      this.activeInput = type

      switch (type) {
        case WEATHER.CURRENT:
          this.handleCurrent()
          break;

        case WEATHER.FORECAST:
          this.handleForecast()
          break;

        case WEATHER.FUTURE:
          this.setDateInputVisible(true)
          if (this.weatherFutureDate) {
          }
          break;
      }
    },
    handleCurrent: function () {
      WeatherDataResolver.fetchWeatherData({ fetchCategory: WEATHER.CURRENT }).then(
        (data) => {
          let dataCurrentPath = data?.current
          if (!dataCurrentPath) {
            return
          }
          this.weatherData = {
            'Temperature C': dataCurrentPath.temp_c,
            'Wind speed KM/h': dataCurrentPath.wind_kph,
            'Wind direction': dataCurrentPath.wind_dir
          }
        }
      )
    },
    handleForecast: function () {
      WeatherDataResolver.fetchWeatherData({ fetchCategory: WEATHER.FORECAST, days: 3 }).then(
        (data) => {
          let dataForecastDayPath = data?.forecast?.forecastday?.[0]?.day
          if (!dataForecastDayPath) {
            return
          }
          this.weatherData = {
            'Minimum temperature C': dataForecastDayPath.mintemp_c,
            'Maximum temperature C': dataForecastDayPath.maxtemp_c,
            'Maximum wind KM/h': dataForecastDayPath.maxwind_kph,
            'Chance of rain %': dataForecastDayPath.daily_chance_of_rain,
            'Chance of snow %': dataForecastDayPath.daily_chance_of_snow
          }
        }
      )
    },
    handleFuture: function (date) {
      if (date < this.minDate || date > this.maxDate) {
        this.weatherData = 'Date should be 14 to 300 days from today in the future.'
        return
      }

      localStorage.setItem(WEATHER_FUTURE_DATE, date)
      this.weatherFutureDate = date

      WeatherDataResolver.fetchWeatherData({ fetchCategory: WEATHER.FUTURE, dt: date }).then(
        (data) => {
          let dataForecastDayPath = data?.forecast?.forecastday?.[0]
          if (!dataForecastDayPath) {
            return
          }
          this.weatherData = {
            'Minimum temperature C': dataForecastDayPath.day?.mintemp_c,
            'Maximum temperature C': dataForecastDayPath.day?.maxtemp_c,
            'Maximum wind KM/h': dataForecastDayPath.day?.maxwind_kph,
            'Chance of rain %': dataForecastDayPath.hour?.[0]?.chance_of_rain,
            'Chance of snow %': dataForecastDayPath.hour?.[0]?.chance_of_snow
          }
        }
      )
    }
  },
  // min and max constraints for date input
  computed: {
    minDate: () => {
      let currentDate = new Date();
      let minDate = currentDate.setDate(currentDate.getDate() + 14);

      return new Date(minDate).toISOString().slice(0, 10)
    },
    maxDate: () => {
      let currentDate = new Date();
      let maxDate = currentDate.setDate(currentDate.getDate() + 300);

      return new Date(maxDate).toISOString().slice(0, 10)
    }
  }
}
</script>

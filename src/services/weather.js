import axios from 'axios'

const API_KEY = '4ce7481ec118414a81b135806222806'
const API_URL = 'http://api.weatherapi.com/v1'

export const searchCities = (zipCode) => {
    return axios.get(`${API_URL}/search.json`, {
        params: {
            key: API_KEY,
            q: zipCode // search city against zip code
        }
    }).then(response => response.data).catch(() => [])
}

export const fetchForecastData = (city) => {
    return axios.get(`${API_URL}/forecast.json`, {
        params: {
            key: API_KEY,
            days: 8, // fetch for next 8 days
            q: city.name // fetch weather forecast against city
        }
    }).then(response => response.data).catch(() => [])
}


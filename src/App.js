import './App.css';

import { styled } from '@mui/material/styles';
import {Box, debounce, Grid, TextField} from "@mui/material";
import Paper from '@mui/material/Paper';
import {useCallback, lazy, useState} from "react";
import {validInput} from "./utils/generic";
import {searchCities, fetchForecastData} from "./services/weather";
import DetailView from "./components/Detail";
const CityList = lazy(() => import("./components/CityList"));

const commonTheme = theme => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
})

const HeaderItem = styled(Paper)(({ theme }) => ({
    ...commonTheme(theme),
    backgroundColor: '#272b32',
    color: '#fff'
}));

export const Item = styled(Paper)(({ theme }) => ({
    ...commonTheme(theme),
    cursor: 'pointer'
}));

function App() {
    const [input, setInput] = useState('');
    const [forecastData, setForecastData] = useState(null)

    const handleChange = value => {
        if(validInput(value)) {
            setInput(value)
        }
    }

    const onCitySelection = async (city) => {
        const forecastData = await fetchForecastData(city)
        setForecastData(forecastData)
    }

  return (
    <div className="App">
        <Box sx={{ width: '100%' }} rowSpacing={4}>
            <Grid container>
                <Grid item xs={12}>
                    <HeaderItem><h1>Weather Forecast</h1></HeaderItem>
                </Grid>
            </Grid>
            <br/>
            <Grid container display={'flex'} justifyContent={'center'}>
                <Grid item xs={5}>
                    <Item>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Search by zip code or city name"
                            variant="outlined"
                            value={input}
                            onChange={e => handleChange(e.target.value)}
                        />
                    </Item>
                </Grid>
            </Grid>
            <br/>
            <CityList city={input} onCitySelection={city => onCitySelection(city)} />
        </Box>
        {forecastData &&
        <DetailView
            forecastData={forecastData}
            open={forecastData ? true : false}
            handleClose={() => setForecastData(null)}
        />
        }
    </div>
  );
}

export default App;

import {debounce, Grid} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {searchCities} from "../services/weather";
import { Item } from "../App";

const CityList = ({ city, onCitySelection }) => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if(city)
            fetchCities(city)
    }, [city])

    const findCities = async(value) => {
        const cities = await searchCities(value)
        setCities(cities)
    }

    const fetchCities = useCallback(debounce(findCities, 300), []);

    return <Grid container display={'flex'} justifyContent={'center'} p={4}>
        <Grid container rowSpacing={4} justifyContent={'center'} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {
                cities.length ? cities.map((city, index) => <Grid key={index} onClick={() => onCitySelection(city)} item
                                                         xs={4}><Item>{city.name}</Item></Grid>) :
                    <Grid item xs={4}>No City Found</Grid>
            }
        </Grid>
    </Grid>
}

export default CityList
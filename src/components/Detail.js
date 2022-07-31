import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {Divider, Grid, Link} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {fetchDayAndTime, fetchShortDayNameByDate, formatDateToStr, fetchHoursAMPM} from "../utils/generic";
import { Line } from 'react-chartjs-2';
import {makeStyles, withStyles} from "@mui/styles";
import Chart from 'chart.js/auto';
import Tabs from '@mui/material/Tabs';
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import {
    KeyboardDoubleArrowDownTwoTone,
    KeyboardDoubleArrowUpTwoTone
} from "@mui/icons-material";
import {useState} from "react";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'unset',
    // ...theme.typography.body2,
    border: 0,
    borderRadius: 0,
    textAlign: 'center',
    color: '#fff',
}));

const ViewToggleIcon = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    top: 0,
    width: 40,
    backgroundColor: 'unset',
    color: '#fff',
    cursor: 'pointer'
}));

const CustomTab = withStyles({
    root: {
        textTransform: "none",
        fontSize: 17,
        padding: 0,
        marginRight: 20,
        borderWidth: 4,
        minWidth: 40
    }
})(Tab);

const useStyles = makeStyles({

    view: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        backgroundColor: '#202124',
        border: '2px solid #000',
        boxShadow: 24,
        color: '#fff',
    },
    compactView: {
        padding: '10px'
    },
    detailView: {
        padding: '20px 100px'
    },
    dayBox: {
        borderRadius: 12,
        padding: 10
    },
    currentDay: {
        backgroundColor: '#303134'
    },
    siteLink: {
        color: 'unset',
        textDecoration: 'underline'
    },
    wColor: {
        color: 'white'
    },
    lightWColor: {
        color: '#b5bdc3'
    },
    greyColor: {
        color: '#8e908f'
    }
});

const DetailView = ({ open, handleClose, forecastData }) => {
    const classes = useStyles()
    const [detailView, setDetailView] = useState(false)
    const [tempInCelcius, setTempInCelcius] = useState(true)
    var xAxisDt = [], yAxisDt = []

    const fetchDayTemp = date => {
        let hour = null
        for(let d = 0; d < forecastData.forecast.forecastday.length; d++) {
            hour = forecastData.forecast.forecastday[d].hour.find(hr => hr.time === date)
            if(hour)
                break
        }
        return hour && Math.round(tempInCelcius ? hour.temp_c : hour.temp_f)

    }

    const renderChartData = () => {
        let date = new Date(forecastData.location.localtime)
        date.setHours(date.getHours() + 1)
        date.setMinutes(0)
        yAxisDt = [fetchDayTemp(formatDateToStr(date))]
        xAxisDt = [fetchHoursAMPM(date)]
        for(let i = 0; i < forecastData.forecast.forecastday.length - 1 ; i++ ) {
            date = new Date(date.getTime())
            date.setTime(date.getTime() + 3 * 60 * 60 * 1000)
            yAxisDt.push(fetchDayTemp(formatDateToStr(date)))
            xAxisDt.push(fetchHoursAMPM(date))
        };
        return [xAxisDt, yAxisDt]
    }

    const renderWeatherGraph = () => <Line
        datasetIdKey='id'
        data={{
            labels: renderChartData()[0],
            color: '#ebc947',
            datasets: [
                {
                    id: 1,
                    label: 'test',
                    data: renderChartData()[1],
                    borderColor: '#ebc947',
                    fill: true,
                    backgroundColor: '#4d431d',
                },
            ],
        }}
        options= {{
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                point:{
                    radius: 0
                }
            },
            scales: {
                secondXAxis: {
                    position: 'top',
                    axis: 'x',
                    labels: renderChartData()[1],
                    grid: {
                        drawOnChartArea: false
                    }
                },
                yAxes:{
                    ticks:{
                        display: false,
                    }
                },
                xAxes:
                    {
                        ticks:{
                            color: 'white',
                            fontSize: 12,
                        }
                    }
            }
        }}
    />

    const renderDayWiseForecast = dayWiseData => {
        // const day = dayWiseData[0]
        return dayWiseData.map((day, index) => (
            <Grid
                key={index}
                className={`${classes.dayBox} ${index === 0 && classes.currentDay}`}
                item
                md={1}
                sm={2}
                xs={4}

            >
                <Item>
                    <div>{fetchShortDayNameByDate(new Date(day.date))}</div>
                    <div><img src={day.day.condition.icon}/></div>
                    <div>
                        <span className={!tempInCelcius && classes.greyColor} >{Math.round(day.day.avgtemp_c)}&deg;</span>&nbsp;&nbsp;
                        <span className={tempInCelcius && classes.greyColor}>{
                            Math.round(day.day.avgtemp_f)}&deg;</span>
                    </div>
                </Item>
            </Grid>
        ))
    }

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box className={`${classes.view} ${detailView ? classes.detailView : classes.compactView}`} rowSpacing={4}>
                    <ViewToggleIcon onClick={() => setDetailView(viewType => !viewType)}>
                        {detailView ?
                            <KeyboardDoubleArrowUpTwoTone sx={{ fontSize: 25 }} /> :
                            <KeyboardDoubleArrowDownTwoTone sx={{ fontSize: 25 }} />
                        }
                    </ViewToggleIcon>
                    <Grid container>
                        <Grid item xs={6} display={'flex'} columnGap={'20px'}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src={forecastData.current.condition.icon} />
                                <div style={{display: 'inherit'}}>
                                    <span style={{fontSize: 50}}>{
                                        Math.round(tempInCelcius ? forecastData.current.temp_c : forecastData.current.temp_f)
                                    }</span>
                                    &nbsp;&nbsp;
                                    <sup style={{fontSize: 20, cursor: 'pointer'}}>
                                        <span className={!tempInCelcius && classes.greyColor} onClick={() => setTempInCelcius(tempInCelcius => !tempInCelcius)}>&deg;C</span>
                                        <span onClick={() => setTempInCelcius(tempInCelcius => !tempInCelcius)}
                                              className={tempInCelcius && classes.greyColor}> | &deg;F</span>
                                    </sup>
                                </div>
                            </div>
                            {detailView && <Box sx={{display: {sm: 'none', md: 'block'}}} className={classes.greyColor}>
                                <div>Precipitation: {forecastData.current.precip_in}%</div>
                                <div>Humidity: {forecastData.current.humidity}%</div>
                                <div>Wind: {forecastData.current.wind_kph} Km/h</div>
                            </Box>}
                        </Grid>
                        <Grid item xs={6} textAlign={'right'}>
                            <div style={{fontSize: 25}}>
                                {`${forecastData.location.name}, ${forecastData.location.region}`}
                            </div>
                            <div className={classes.greyColor} style={{fontSize: 20}}>
                                {fetchDayAndTime(forecastData.location.localtime)} <br/>
                                {forecastData.current.condition.text}
                            </div>
                        </Grid>
                    </Grid>
                    {detailView && <>
                    <br/>
                    <Grid container>
                        <TabContext value={'Temperature'}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={'1'}
                                    onChange={() => {}}
                                    textColor="#b5bdc3"
                                    TabIndicatorProps={{style: {height: 3, bottom: 3, background:'#ebc947'}}}
                                >
                                    <CustomTab className={classes.lightWColor} label="Temperature" value="1" />
                                    <CustomTab className={classes.lightWColor} label="Precipitation" value="2" />
                                    <CustomTab className={classes.lightWColor} label="Wind" value="3" />
                                </Tabs>
                            </Box>
                        </TabContext>
                    </Grid>
                    <br/>
                    <Grid container>
                        {renderWeatherGraph()}
                    </Grid>
                    <br/>
                    <Grid item columns={8} container justifyContent={'center'}>
                        {renderDayWiseForecast(forecastData.forecast.forecastday)}
                    </Grid>

                    <br/>
                    <Grid container columns={12} alignItems={'center'}>
                        <Grid item xs={3} sm={6} md={7} lg={9}>
                            <Divider sx={{borderColor: '#6a6b73', borderWidth: 1, width: '100%'}} />
                        </Grid>
                        <Grid className={classes.greyColor} item xs={9} sm={6} md={5} lg={3} display={'flex'} justifyContent={'center'}>
                            {' '}
                            <Link className={classes.siteLink} to={"http://weather.com"}>weather.com</Link>&nbsp;&nbsp;.&nbsp;&nbsp;
                            Feedback
                        </Grid>
                    </Grid>
                    </>}
                </Box>

            </Modal>
        </React.Fragment>
    );
}

export default DetailView

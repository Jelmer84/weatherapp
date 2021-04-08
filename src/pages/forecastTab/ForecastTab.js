import React, {useState, useEffect, useContext} from 'react';
import './ForecastTab.css';
import axios from "axios";
import "../../helpers/kelvinToCelcius"
// import kelvinToCelcius from "../../helpers/kelvinToCelcius";
import createDateString from "../../helpers/createDateString";
import {TempContext} from "../../context/TempContextProvider";
import {apiKey} from "../../App";

// export const apiKey = process.env.REACT_APP_API_KEY;
// const apiKey = "a0498b6ffe2f9a0b0979f5c957cdbc5d";

function ForecastTab({coordinates}) {
    const [forecasts, setForecasts] = useState(null);
    const [error, setError] = useState(false)
    const [loading, toggleLoading] = useState(false)
    const { kelvinToMetric } = useContext(TempContext);

    useEffect(() => {
        async function fetchData() {
            setError(false)
            toggleLoading(true)
            try {
                const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`)
                setForecasts(result.data.daily.slice(1, 6));
                console.log(result.data)
            } catch (e) {
                console.error(e);
                setError(true)
            }
            toggleLoading(false)
        }

        if (coordinates) {
            fetchData();
        }
    }, [coordinates]);

    return (
        <div className="tab-wrapper">

            {forecasts && forecasts.map((forecast) => {
                return (
                    <article className="forecast-day" key={forecast.dt}>
                        <p className="day-description">
                            {createDateString(forecast.dt)}
                        </p>
                        <section className="forecast-weather">
              <span>
                {kelvinToMetric(forecast.temp.day)}
              </span>
                            <span className="weather-description">
                {forecast.weather[0].description}
              </span>
                        </section>
                    </article>
                )
            })}

            {!forecasts && !error && (
                <span className="no-forecast">
          Zoek eerst een locatie om het weer voor deze week te bekijken
        </span>
            )}

            {error && <span>Dit ging niet helemaal goed, probeer het nogmaals.</span>}

            {loading && (<span>Loading...</span>)}
        </div>

    );
}


export default ForecastTab;




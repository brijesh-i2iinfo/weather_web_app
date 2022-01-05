import React, { useEffect, useState } from "react";
import Smoke from "../image/a.png";
import Clear from "../image/B.png";
import Clouds from "../image/c.png";
import Heart from "../image/heart.svg";
import "../asset/weathers.css";
import Header from "./Header";
import getAddress from "../api/address";
import getWeather from "../api/weatherapi";
import { ICON_URL } from "../utils/constant";
function Weather() {
  const [forcast, setForcast] = useState();
  const [city, setCity] = useState();
  const [address, setAddress] = useState();
  const [location, setLocation] = useState({});
  const [geometry, setGeometry] = useState({});
  const [weatherInfo, setWeatherInfo] = useState(null);
  const handleSearch = () => {
    setAddress(city);
  };

  useEffect(() => {
    try {
      getAddress(address).then((res) => {
        // console.log(res.data.results);
        setGeometry(res.data.results[0].geometry);
        setLocation({
          City: res.data.results[0].components.city,
          Town: res.data.results[0].components.town,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [address]);

  useEffect(() => {
    try {
      getWeather(geometry).then((res) => {
        console.log("weather", res.data);
        setForcast(res?.data?.daily);
        setWeatherInfo({
          humidity: res?.data?.current?.humidity,
          Wind_Speed: res?.data?.current?.wind_speed,
          Temp: res?.data?.current?.temp,
          Icon: res?.data?.current?.weather[0]?.icon || "50d",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [geometry]);

  useEffect(() => {
    console.log(weatherInfo);
  }, [weatherInfo]);

  console.log("weatherInfo", weatherInfo);

  const timeStampToDay = (_timestamp) => {
    return new Date(_timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  return (
    <div>
      <div className="header">
        <h1 className="header_title">Weather</h1>
        <div className="search_bar">
          <label className="search_lable">
            <input
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <button className="btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {forcast && (
        <div className="weatherandforecast">
          <div className="weather">
            <div className="w_info">
              <img className="icon" src={Smoke} alt="Smoke" />
              <ul className="w_list">
                <li className="list__temperature">
                  {Math.round(weatherInfo?.Temp)}{" "}
                  <sup className="temperature-symbol">°C</sup>
                </li>
                <li> Humidity: {weatherInfo?.humidity}% </li>
                <li> Wind:{Math.round(weatherInfo?.Wind_Speed)} km/h </li>
              </ul>
            </div>
            <div className="other-info">
              <h2 className="info__city">{location.City || location.Town}</h2>
              <h3 className="info__clouds">
                {timeStampToDay(forcast && forcast[0]?.dt)}
              </h3>
              <h3 className="info__clouds">smoke</h3>
            </div>
          </div>
        </div>
      )}

      <div className="WeatherAndForecast__container">
        {forcast &&
          [...Array(5)].map((e, id) => {
            var data = forcast[id];
            return (
              <div key={id}>
                <h1 className="f_title">{timeStampToDay(data?.dt)}</h1>
                <img
                  className="f_weather-icon"
                  src={ICON_URL(
                    (data && data.weather && data?.weather[0]?.icon) || "50d"
                  )}
                  alt="Clear"
                />
                <div className="f_temperature">
                  <span className="t_max">
                    {Math.round(data?.temp?.max)}
                    <sup className="temperature__symbol">°</sup>
                  </span>
                  <span className="t_min">
                    {Math.round(data?.temp?.min)}
                    <sup className="temperature__symbol">°</sup>
                  </span>
                </div>
              </div>
            );
          })}
        {/* {forcast.map((data, id) => {
          return (
            <div key={id}>
              <h1 className="f_title">{timeStampToDay(data?.dt)}</h1>
              <img
                className="f_weather-icon"
                src={ICON_URL(data?.weather[0]?.icon)}
                alt="Clear"
              />
              <div className="f_temperature">
                <span className="t_max">
                  {Math.round(data?.temp?.max)}
                  <sup className="temperature__symbol">°</sup>
                </span>
                <span className="t_min">
                  {Math.round(data?.temp?.min)}
                  <sup className="temperature__symbol">°</sup>
                </span>
              </div>
            </div>
          );
        })} */}
      </div>
      <div className="footer">
        <p className="footer_text">
          Made with <img className="footer_icon" src={Heart} alt="love icon" />
          by <span>Kausik Selvaraju</span>
        </p>
      </div>
    </div>
  );
}
export default Weather;

//API : https://api.opencagedata.com/geocode/v1/json , https://api.openweathermap.org/data/2.5/onecall
//KEY : 103fda4edfee402fa23d1d1e4d742132

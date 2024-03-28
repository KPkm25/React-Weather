import React from "react";
import moment from "moment";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "", // State to hold the input value
      weather: null, // State to hold weather data
    };
  }
  din() {
    const date = moment();
    const currentDate = date.format("D/MM/YYYY"); // Getting the current date to display
    return currentDate;
  }

  convert(f) {
    const message = f + "\xB0C"; //Adding celsius icon using Regex
    return message;
  }

  getNextSixDays = () => { // Getting the next 6 days from the current date
    const dates = [];
    for (let i = 1; i < 6; i++) {
      const date = moment().add(i, "days").format("D/MM");
      dates.push(date);
    }
    console.log("dates are:", dates);
    return dates;
  };
  getDateFromTimestamp(timestamp) { //splitting the date fetched into correct format
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { city } = this.state;
    const key= process.env.REACT_APP_API_KEY;


    try {
      // console.log('key is:',key);
      const response = await fetch(
        `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${key}` //Making the API request
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data); 
      this.setState({ weather: data });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  render() {
    const { weather } = this.state;

    return (
      <div className="container">
        <header>
          <h2 className="aeolus"> Aeolus-Feel the Wind</h2>
        </header>
        <div className="cover">
          <h1>Discover how it's out there.</h1>
          <form className="flex-form" onSubmit={this.handleSubmit}>
            <label htmlFor="from">
              <i className="ion-location"></i>
            </label>
            <input
              type="text"
              name="city"
              placeholder="Where do you want to go?"
              value={this.state.city}
              onChange={(event) => this.setState({ city: event.target.value })} 
            />
            <input type="submit" value="Get Weather" />
          </form>
          <div className="wrapper">
            <div className="widget-container">
            <div className="top">
  {/* Displaying the city name and date */}
  <div className="weather-info">
    <h1 className="city">{weather ? weather.location.name.split(",")[0] : null}</h1>
    <h3 id="date">{weather ? this.din() : null}</h3>
    <p className="geo"></p>
  </div>

  {/* Six-day forecast container */}
  <div className="forecast-container">
    {weather && (
      <div className="six-day-forecast">
        {this.getNextSixDays().map((date, index) => (
          <div key={index} className="day-column">
            <h3>{this.getDateFromTimestamp(weather.timelines.daily[index].time)}</h3>
            {weather.timelines.daily[index + 1] && (
              <>
                <p>Max: {weather.timelines.daily[index].values.temperatureMax}°C</p>
                <p>Min: {weather.timelines.daily[index].values.temperatureMin}°C</p>
              </>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
            </div>
              {/* <div className="top-right">
                <h1 id="weather-status">Weather / Weather Status</h1>
              </div> */}
              <div className="horizontal-half-divider"></div>
              <div className="bottom-left">
                <h1 id="temperature">
                  {weather
                    ? this.convert(
                        weather.timelines.daily[0].values.temperatureAvg
                      )
                    : null}
                </h1>
              </div>

              <div className="vertical-half-divider"></div>
              <div className="bottom-right">
                <div className="other-details-key">
                  <p>Wind Speed</p>
                  <p>Humidity</p>
                  <p>Visibility</p>
                </div>

                <div className="other-details-values">
                  <p className="windspeed">
                    {weather
                      ? `${weather.timelines.daily[0].values.windSpeedAvg} Km/h`
                      : "N/A"}
                  </p>
                  <p className="humidity">
                    {weather
                      ? `${weather.timelines.daily[0].values.humidityAvg} %`
                      : "N/A"}
                  </p>
                  <p className="pressure">
                    {weather
                      ? `${weather.timelines.daily[0].values.visibilityAvg} km`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Home;

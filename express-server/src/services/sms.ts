require('dotenv').config({ path: '../../.env' });
import User, { IUser, mountainsObj } from '../models/user';
const fetch = require('node-fetch-commonjs');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

const getWeather = async (location: number) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`
  );
  const data = await response.json();
  return data;
};

export async function sendTextAlerts() {
  const breckenridgeWeather = await getWeather(80424);
  const keystoneWeather = await getWeather(80435);
  const vailWeather = await getWeather(81657);
  /*   keystoneWeather.forecast.forecastday[0].day.daily_will_it_snow = 1; */
  const results = await User.find({});
  for (const user of results) {
    if (user.textAlert && user.phone) {
      let keys: (keyof mountainsObj)[] = Object.keys(
        user.mountains
      ) as (keyof mountainsObj)[];
      for (const mountain of keys) {
        if (user.mountains[mountain] !== 0) {
          let body;
          if (mountain == 'Breckenridge') {
            body = `Powder Alert for ${mountain} - ${breckenridgeWeather.forecast.forecastday[0].day.daily_chance_of_snow} % chance for ${breckenridgeWeather.forecast.forecastday[0].day.totalprecip_in} inches.`;
          } else if (
            mountain == 'Keystone' &&
            keystoneWeather.forecast.forecastday[0].day.daily_will_it_snow == 1
          ) {
            body = `Powder Alert for ${mountain} - ${keystoneWeather.forecast.forecastday[0].day.daily_chance_of_snow} % chance for ${keystoneWeather.forecast.forecastday[0].day.totalprecip_in} inches. Reply STOP to unsubscribe.`;
          } else if (
            mountain == 'Vail' &&
            vailWeather.forecast.forecastday[0].day.daily_will_it_snow == 1
          ) {
            body = `Powder Alert for ${mountain} - ${vailWeather.forecast.forecastday[0].day.daily_chance_of_snow} % chance for ${vailWeather.forecast.forecastday[0].day.totalprecip_in} inches.`;
          }
          client.messages.create({
            body: body,
            from: twilioNumber,
            to: user.phone,
          });
        }
      }
    }
  }
}

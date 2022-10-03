require('dotenv').config({ path: '../../.env' });
import User, { mountainsObj } from '../models/user';
import nodemailer from 'nodemailer';
const fetch = require('node-fetch-commonjs');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'summitsnowalerts@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
});

interface WeatherData {
  Breckenridge: WeatherObj;
  Keystone: WeatherObj;
  Vail: WeatherObj;
  Monarch: WeatherObj;
  'Arapahoe Basin': WeatherObj;
  Copper: WeatherObj;
  'Winter Park': WeatherObj;
  Steamboat: WeatherObj;
  'Beaver Creek': WeatherObj;
  'Crested Butte': WeatherObj;
  Eldora: WeatherObj;
  Aspen: WeatherObj;
}

interface WeatherObj {
  snow: number;
  snowChance: number;
  precip: number;
}

const getWeather = async (location: number) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export async function sendAlerts() {
  const mountainsRef = {
    Breckenridge: 80424,
    Keystone: 80435,
    Vail: 81657,
    Monarch: 81227,
    'Arapahoe Basin': 80435,
    Copper: 80443,
    'Winter Park': 80482,
    Steamboat: 80487,
    'Beaver Creek': 81620,
    'Crested Butte': 81224,
    Eldora: 80466,
    Aspen: 81612,
  };
  try {
    console.log('Getting weather...');
    let weather = {} as WeatherData;
    await Promise.all(
      Object.keys(mountainsRef).map(async (key) => {
        const mountain = key as keyof mountainsObj;
        const localWeather = await getWeather(mountainsRef[mountain]);
        weather[mountain] = {
          snow: localWeather.forecast.forecastday[0].day.daily_will_it_snow,
          snowChance:
            localWeather.forecast.forecastday[0].day.daily_chance_of_snow,
          precip: localWeather.forecast.forecastday[0].day.totalprecip_in,
        };
      })
    );
    console.log('Weather received, sending alerts...');

    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const date = new Date();
    const currDay = days[date.getDay()];
    const currTime = date.getHours();
    console.log('Day: ' + currDay);
    console.log('Time: ' + currTime);

    const results = await User.find({
      [`notifications.days.${currDay}`]: true,
      [`notifications.times.${currTime}`]: true,
    });
    for (const user of results) {
      if (
        user.notifications.email ||
        (user.notifications.text && user.phone.length > 0)
      ) {
        let keys: (keyof mountainsObj)[] = Object.keys(
          user.mountains
        ) as (keyof mountainsObj)[];
        for (const mountain of keys) {
          if (weather[mountain].snow === 1) {
            if (user.notifications.text && user.phone.length > 0) {
              const body = `Summit Snow Alerts: Powder Alert for ${mountain}\n${weather[mountain].snowChance}% chance for ${weather[mountain].precip} inches.\nReply STOP to unsubscribe.`;
              client.messages.create({
                body: body,
                from: twilioNumber,
                to: user.phone,
              });
            }
            if (user.notifications.email === true) {
              const mailOptions = {
                from: 'summitsnowalerts@gmail.com',
                to: user.email,
                subject: `Summit Snow Alerts: Powder Alert for ${mountain}`,
                text: `${mountain} - ${weather[mountain].snowChance}% chance for ${weather[mountain].precip} inches.\nVisit summitsnowalerts.com to unsubscribe.`,
              };
              transporter.sendMail(mailOptions, (error) => {
                if (error) {
                  console.error(error);
                }
              });
            }
          }
        }
      }
    }
    if (currTime === 18) {
      client.messages.create({
        body: 'Server is online and sending alerts',
        from: twilioNumber,
        to: myNumber,
      });
    }
  } catch (err) {
    client.messages.create({
      body: `Error sending alerts: ${err}`,
      from: twilioNumber,
      to: myNumber,
    });
    console.error(err);
  }
}

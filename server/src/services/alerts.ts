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

const getWeather = async (location: number) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`
  );
  const data = await response.json();
  return data;
};

export async function sendTextAlerts() {
  try {
    // Get weather for all mountains
    console.log('Getting weather...');
    let weather: any = {};
    const breckenridgeWeather = await getWeather(80424);
    weather['Breckenridge'] = {
      snow: breckenridgeWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        breckenridgeWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: breckenridgeWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const keystoneWeather = await getWeather(80435);
    weather['Keystone'] = {
      snow: keystoneWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        keystoneWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: keystoneWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const vailWeather = await getWeather(81657);
    weather['Vail'] = {
      snow: vailWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance: vailWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: vailWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const monarchWeather = await getWeather(81227);
    weather['Monarch'] = {
      snow: monarchWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        monarchWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: monarchWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const arapahoeBasinWeather = await getWeather(80435);
    weather['Arapahoe Basin'] = {
      snow: arapahoeBasinWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        arapahoeBasinWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: arapahoeBasinWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const copperWeather = await getWeather(80443);
    weather['Copper'] = {
      snow: copperWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        copperWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: copperWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const winterParkWeather = await getWeather(80482);
    weather['Winter Park'] = {
      snow: winterParkWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        winterParkWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: winterParkWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const steamboatWeather = await getWeather(80487);
    weather['Steamboat'] = {
      snow: steamboatWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        steamboatWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: steamboatWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const beaverCreekWeather = await getWeather(81620);
    weather['Beaver Creek'] = {
      snow: beaverCreekWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        beaverCreekWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: beaverCreekWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const crestedButteWeather = await getWeather(81224);
    weather['Crested Butte'] = {
      snow: crestedButteWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        crestedButteWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: crestedButteWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const eldoraWeather = await getWeather(80466);
    weather['Eldora'] = {
      snow: eldoraWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance:
        eldoraWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: eldoraWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    const aspenWeather = await getWeather(81612);
    weather['Aspen'] = {
      snow: aspenWeather.forecast.forecastday[0].day.daily_will_it_snow,
      snowChance: aspenWeather.forecast.forecastday[0].day.daily_chance_of_snow,
      precip: aspenWeather.forecast.forecastday[0].day.totalprecip_in,
    };
    console.log('Weather ready, sending to users...');

    // Send texts to users with mountains receiving snow
    const results = await User.find({});
    for (const user of results) {
      if (
        user.emailAlert === true ||
        (user.textAlert === true && user.phone.length > 0)
      ) {
        let keys: (keyof mountainsObj)[] = Object.keys(
          user.mountains
        ) as (keyof mountainsObj)[];
        for (const mountain of keys) {
          if (weather[mountain].snow == 1) {
            if (user.textAlert === true && user.phone.length > 0) {
              const body = `Summit Snow Alerts: Powder Alert for ${mountain} - ${weather[mountain].snowChance}% chance for ${weather[mountain].precip} inches. Reply STOP to unsubscribe.`;
              client.messages.create({
                body: body,
                from: twilioNumber,
                to: user.phone,
              });
            }
            if (user.emailAlert === true) {
              const mailOptions = {
                from: 'summitsnowalerts@gmail.com',
                to: user.email,
                subject: `Summit Snow Alerts: Powder Alert for ${mountain}`,
                text: `Summit Snow Alerts: Powder Alert for ${mountain} - ${weather[mountain].snowChance}% chance for ${weather[mountain].precip} inches. Visit summitsnowalerts.com to unsubscribe.`,
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

    client.messages.create({
      body: 'Server is sending alerts',
      from: twilioNumber,
      to: myNumber,
    });
  } catch (err) {
    client.messages.create({
      body: `Error sending snow alerts: ${err}`,
      from: twilioNumber,
      to: myNumber,
    });
    console.error(err);
  }
}

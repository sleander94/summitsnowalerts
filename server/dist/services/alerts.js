"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextAlerts = void 0;
require('dotenv').config({ path: '../../.env' });
const user_1 = __importDefault(require("../models/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const fetch = require('node-fetch-commonjs');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'summitsnowalerts@gmail.com',
        pass: process.env.EMAIL_PASS,
    },
});
const getWeather = (location) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`);
    const data = yield response.json();
    return data;
});
function sendTextAlerts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get weather for all mountains
            console.log('Getting weather...');
            let weather = {};
            const breckenridgeWeather = yield getWeather(80424);
            weather['Breckenridge'] = {
                snow: breckenridgeWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: breckenridgeWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: breckenridgeWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const keystoneWeather = yield getWeather(80435);
            weather['Keystone'] = {
                snow: keystoneWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: keystoneWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: keystoneWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const vailWeather = yield getWeather(81657);
            weather['Vail'] = {
                snow: vailWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: vailWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: vailWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const monarchWeather = yield getWeather(81227);
            weather['Monarch'] = {
                snow: monarchWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: monarchWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: monarchWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const arapahoeBasinWeather = yield getWeather(80435);
            weather['Arapahoe Basin'] = {
                snow: arapahoeBasinWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: arapahoeBasinWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: arapahoeBasinWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const copperWeather = yield getWeather(80443);
            weather['Copper'] = {
                snow: copperWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: copperWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: copperWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const winterParkWeather = yield getWeather(80482);
            weather['Winter Park'] = {
                snow: winterParkWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: winterParkWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: winterParkWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const steamboatWeather = yield getWeather(80487);
            weather['Steamboat'] = {
                snow: steamboatWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: steamboatWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: steamboatWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const beaverCreekWeather = yield getWeather(81620);
            weather['Beaver Creek'] = {
                snow: beaverCreekWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: beaverCreekWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: beaverCreekWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const crestedButteWeather = yield getWeather(81224);
            weather['Crested Butte'] = {
                snow: crestedButteWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: crestedButteWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: crestedButteWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const eldoraWeather = yield getWeather(80466);
            weather['Eldora'] = {
                snow: eldoraWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: eldoraWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: eldoraWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            const aspenWeather = yield getWeather(81612);
            weather['Aspen'] = {
                snow: aspenWeather.forecast.forecastday[0].day.daily_will_it_snow,
                snowChance: aspenWeather.forecast.forecastday[0].day.daily_chance_of_snow,
                precip: aspenWeather.forecast.forecastday[0].day.totalprecip_in,
            };
            console.log('Weather ready, sending to users...');
            // Send texts to users with mountains receiving snow
            const results = yield user_1.default.find({});
            for (const user of results) {
                if (user.emailAlert === true ||
                    (user.textAlert === true && user.phone.length > 0)) {
                    let keys = Object.keys(user.mountains);
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
        }
        catch (err) {
            client.messages.create({
                body: `Error sending snow alerts: ${err}`,
                from: twilioNumber,
                to: myNumber,
            });
            console.error(err);
        }
    });
}
exports.sendTextAlerts = sendTextAlerts;

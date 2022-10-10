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
exports.sendAlerts = void 0;
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
    try {
        const response = yield fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`);
        const data = yield response.json();
        console.log(data);
        return data;
    }
    catch (err) {
        console.error(err);
    }
});
function sendAlerts() {
    return __awaiter(this, void 0, void 0, function* () {
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
            let weather = {};
            yield Promise.all(Object.keys(mountainsRef).map((key) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const mountain = key;
                const localWeather = yield getWeather(mountainsRef[mountain]);
                weather[mountain] = {
                    snow: (_a = localWeather.forecast) === null || _a === void 0 ? void 0 : _a.forecastday[0].day.daily_will_it_snow,
                    snowChance: (_b = localWeather.forecast) === null || _b === void 0 ? void 0 : _b.forecastday[0].day.daily_chance_of_snow,
                    precip: (_c = localWeather.forecast) === null || _c === void 0 ? void 0 : _c.forecastday[0].day.totalprecip_in,
                };
            })));
            console.log(weather);
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
            const results = yield user_1.default.find({
                [`notifications.days.${currDay}`]: true,
                [`notifications.times.${currTime}`]: true,
            });
            for (const user of results) {
                if (user.notifications.email ||
                    (user.notifications.text && user.phone.length > 0)) {
                    let keys = Object.keys(user.mountains);
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
        }
        catch (err) {
            client.messages.create({
                body: `Error sending alerts: ${err}`,
                from: twilioNumber,
                to: myNumber,
            });
            console.error(err);
        }
    });
}
exports.sendAlerts = sendAlerts;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require('./passport');
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const users_1 = __importDefault(require("./routes/users"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const errors_1 = require("@shared/errors");
const alerts_1 = require("./services/alerts");
const mongoose_1 = __importDefault(require("mongoose"));
// Constants
const app = (0, express_1.default)();
const mongoDB = process.env.MONGODB_URI || process.env.MONGODB_DEV || 'No MongoDB found.';
mongoose_1.default.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// Common middlewares
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'No secret found.',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
}
/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/
// Add user api router
app.use('/users', users_1.default);
// Error handling
app.use((err, _, res, __) => {
    jet_logger_1.default.err(err, true);
    const status = err instanceof errors_1.CustomError ? err.HttpStatus : http_status_codes_1.default.BAD_REQUEST;
    return res.status(status).json({
        error: err.message,
    });
});
/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/
// Set static dir
const staticDir = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticDir));
/***********************************************************************************
 *                                  Alert Functions
 **********************************************************************************/
// Send daily text alert at 6:00 MDT
node_cron_1.default.schedule('0 18 * * *', () => {
    console.log('Scheduled Alert - 6:00PM MDT');
    (0, alerts_1.sendTextAlerts)();
}, {
    scheduled: true,
    timezone: 'America/Denver',
});
// Export here and start in a diff file (for testing).
exports.default = app;

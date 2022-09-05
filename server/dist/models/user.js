"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    notifications: {
        text: { type: Boolean, required: true },
        email: { type: Boolean, required: true },
        times: { type: Object, required: true },
        days: { type: Object, required: true },
    },
    mountains: { type: Object, required: true },
}, { minimize: false });
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;

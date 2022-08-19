"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller = require('../controllers/user-controller');
router.post('/signup', user_controller.signup_post);
router.post('/login', user_controller.login_post);
router.post('/logout', user_controller.logout_post);
router.get('/', user_controller.user_get);
router.put('/', user_controller.user_put);
router.get('/auth', user_controller.auth_get);
exports.default = router;

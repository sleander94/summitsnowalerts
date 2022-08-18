import express from 'express';
const router = express.Router();
const user_controller = require('../controllers/user-controller');

router.post('/signup', user_controller.signup_post);
router.post('/login', user_controller.login_post);
router.post('/logout', user_controller.logout_post);

router.get('/', user_controller.user_get);
router.put('/', user_controller.user_put);

router.get('/auth', user_controller.auth_get);

export default router;

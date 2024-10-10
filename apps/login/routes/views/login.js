const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/login');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/login';

router.get(BASE_PATH, Middleware.checkGuestAuth, Controller.render);
router.get(`${BASE_PATH}/:id`, Middleware.checkGuestAuth, Controller.loginuser);


module.exports = router;
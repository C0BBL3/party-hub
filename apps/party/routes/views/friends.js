const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/friends');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/party';

router.get(`${BASE_PATH}/friends`, Middleware.checkIsHost, Controller.render);

module.exports = router;
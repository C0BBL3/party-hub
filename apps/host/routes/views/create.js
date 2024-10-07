const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/create');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/host/create';

router.post(`${BASE_PATH}`, Middleware.checkIsHost, Controller.render);

module.exports = router;
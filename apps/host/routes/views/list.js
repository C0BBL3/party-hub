const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/list');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/host';

router.get(BASE_PATH, Middleware.checkIsHost, Controller.render);

module.exports = router;
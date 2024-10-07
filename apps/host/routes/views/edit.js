const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/edit');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/host/edit';

router.post(`${BASE_PATH}`, Middleware.checkIsHost, Controller.render);

module.exports = router;
const express = require('express');
const router = express.Router();
const Middleware = require('../../../../middleware/views/main');
const Controller = require('../../controllers/views/privacy');

const BASE_PATH = '/settings/privacy';

router.get(BASE_PATH, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;
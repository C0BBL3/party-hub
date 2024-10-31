const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/friends');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/party';

router.get(`${BASE_PATH}/friends`, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;
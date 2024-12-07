/*
Creates the endpoint to open the Join screen
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/join');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/party';

router.get(`${BASE_PATH}/secret:secretKey`, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;
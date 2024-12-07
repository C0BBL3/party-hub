/*
Creates the endpoint to open the Create screen
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/create');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/host/create';

router.get(BASE_PATH, Middleware.checkIsHost, Controller.render);

module.exports = router;
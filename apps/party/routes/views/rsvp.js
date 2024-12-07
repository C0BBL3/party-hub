/*
Creates the endpoint to open the RSVP screen
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/views/rsvp');
const Middleware = require('../../../../middleware/views/main');

const BASE_PATH = '/party';

router.get(`${BASE_PATH}/rsvp`, Middleware.checkIsHostOrPatron, Controller.render);

module.exports = router;
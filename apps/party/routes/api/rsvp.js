const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/rsvp');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/rsvp';

module.exports = router;
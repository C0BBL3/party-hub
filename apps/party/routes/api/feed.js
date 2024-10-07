const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/feed');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/feed';


module.exports = router;
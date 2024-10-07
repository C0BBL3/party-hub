const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/friends');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/party/friends';


module.exports = router;
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/list');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/host/list';


module.exports = router;
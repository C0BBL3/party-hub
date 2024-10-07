const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/create');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/host/create';


module.exports = router;
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/api/edit');
const APIMiddleware = require('../../../../middleware/api/main');

const BASE_PATH = '/api/host/edit';


module.exports = router;
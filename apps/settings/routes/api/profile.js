const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/profile');

const BASE_PATH = '/api/settings/profile';

// POST 
router.post(`${BASE_PATH}/picture`, ApiMiddleware.checkIsHostOrPatron, Controller.updatePicture);
router.post(`${BASE_PATH}/username`, ApiMiddleware.checkIsHostOrPatron, Controller.updateUsername);
router.post(`${BASE_PATH}/biography`, ApiMiddleware.checkIsHostOrPatron, Controller.updateBiography);

module.exports = router;
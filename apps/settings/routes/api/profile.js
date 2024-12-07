/*
Connects the API of the Profile screen to the Profile screen API controller
Author Colby Roberts
*/
const express = require('express');
const router = express.Router();
const ApiMiddleware = require('../../../../middleware/api/main');
const Controller = require('../../controllers/api/profile');

const BASE_PATH = '/api/settings/profile';

// POST 
router.post(`${BASE_PATH}/update-profile-picture`, ApiMiddleware.checkAuth, Controller.updateProfilePicture);
router.post(`${BASE_PATH}/update-name`, ApiMiddleware.checkAuth, Controller.updateName);
router.post(`${BASE_PATH}/update-description`, ApiMiddleware.checkAuth, Controller.updateDescription);
router.post(`${BASE_PATH}/update-tags`, ApiMiddleware.checkAuth, Controller.updateTags);

module.exports = router;
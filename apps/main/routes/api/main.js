const express = require('express');
const router = express.Router();
const APIMiddleware = require('../../../../middleware/api/main');
const MainAPIController = require('../../controllers/api/main');

router.post('/api/switch-user-account', APIMiddleware.checkIsAdminOrSupervisorMode, MainAPIController.switchUserAccount);

// router.post('/api/*', MainAPIController.unauthorizedAccess); // wildcard: must be at the end of the file

module.exports = router;
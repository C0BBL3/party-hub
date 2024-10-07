const express = require('express');
const router = express.Router();
const MainController = require('../../controllers/views/main');

router.get('/unauthorized-access', MainController.unauthorizedAccess);
router.get('/session-expired', MainController.sessionExpired);

router.get('/*', MainController.unauthorizedAccess); // wildcard: must be at the end of the file

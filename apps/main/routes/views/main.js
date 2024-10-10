const express = require('express');
const router = express.Router();
const MainController = require('../../controllers/views/main');
const Middleware = require('../../../../middleware/views/main');

router.get('/unauthorized-access', Middleware.checkGuestAuth, MainController.unauthorizedAccess);
router.get('/session-expired', Middleware.checkGuestAuth, MainController.sessionExpired);

router.get('/', Middleware.checkGuestAuth, MainController.render);

module.exports = router;


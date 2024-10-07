const express = require('express');
const router = express.Router();
const Middleware = require('../../../../middleware/views/main');
const Controller = require('../../controllers/views/profile');

const BASE_PATH = '/settings/profile';

router.get('/settings', Middleware.checkIsHostOrPatron, (req, res, next) => { res.redirect('/settings/profile') });

router.get(BASE_PATH, Middleware.checkIsHostOrPatron, Controller.render);


module.exports = router;
const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');
// const { jwtDecode } = require('jwt-decode');


router.get(
  '/:userid/requests/received',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_requests_received
);

router.get(
  '/:userid/requests/sent',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_requests_sent
);
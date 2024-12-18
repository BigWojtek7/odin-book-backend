const express = require('express');
const router = express.Router();
const request_controller = require('../controllers/requestController');
const passport = require('passport');
// const { jwtDecode } = require('jwt-decode');

router.get(
  '/:userid/received',
  passport.authenticate('jwt', { session: false }),
  request_controller.requests_received_get
);

router.get(
  '/:userid/sent',
  passport.authenticate('jwt', { session: false }),
  request_controller.requests_sent_get
);

router.post(
  '/:userid/:senderid',
  passport.authenticate('jwt', { session: false }),
  request_controller.requests_post
);

router.delete(
  '/:userid/received/:senderid',
  passport.authenticate('jwt', { session: false }),
  request_controller.requests_deleteReceived
);

router.delete(
  '/:userid/sent/:receiverid',
  passport.authenticate('jwt', { session: false }),
  request_controller.requests_deleteSent
);

module.exports = router;

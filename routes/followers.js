const express = require('express');
const router = express.Router();
const follower_controller = require('../controllers/followerController');
const passport = require('passport');
// const { jwtDecode } = require('jwt-decode');

router.get(
  '/:userid/suggestions',
  passport.authenticate('jwt', { session: false }),
  follower_controller.followers_suggestion_get
);

router.get(
  '/:userid/',
  passport.authenticate('jwt', { session: false }),
  follower_controller.followers_get
);

router.post(
  '/:userid/:followerid',
  passport.authenticate('jwt', { session: false }),
  follower_controller.follower_post
);

router.delete(
  '/:userid/:followerid',
  passport.authenticate('jwt', { session: false }),
  follower_controller.followers_delete
);

module.exports = router;
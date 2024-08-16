const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');
// const { jwtDecode } = require('jwt-decode');

router.get(
  '/:userid/suggestions',
  passport.authenticate('jwt', { session: false }),
  user_controller.users_followers_suggestion
);

router.get(
  '/:userid/followers',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_followers_get
);

router.post(
  '/:userid/followers/:followerid',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_follower_post
);

router.delete(
  '/:userid/followers/:followerid',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_followers_delete
);
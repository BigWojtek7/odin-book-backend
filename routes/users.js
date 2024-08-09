const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');
const { jwtDecode } = require('jwt-decode');
/* GET users listing. */

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_get
);

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  user_controller.users_all_get
);

router.get(
  '/:userid/followers',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_followers_get
);

router.get(
  '/:userid/requests',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_requests_get
);

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(jwtDecode(req.headers.authorization).sub);
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
    });
  }
);
router.post('/sign-up', user_controller.user_create_post);
router.post('/login', user_controller.user_login_post);
module.exports = router;

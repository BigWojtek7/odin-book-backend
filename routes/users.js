const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only images(.png, .jpg, .jpeg, .webp)!'));
    }
  },
});

const { jwtDecode } = require('jwt-decode');
/* GET users listing. */

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_get
);

router.get(
  '/:userid/profile',
  passport.authenticate('jwt', { session: false }),
  user_controller.user_profile_get
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

router.patch(
  '/:userid/password',
  passport.authenticate('jwt', { session: false }),
  user_controller.password_edit
);

router.patch(
  '/:userid/profile',
  passport.authenticate('jwt', { session: false }),
  user_controller.profile_edit
);

router.post(
  '/avatar',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  user_controller.avatar_post
);

router.post('/sign-up', user_controller.user_create_post);
router.post('/login', user_controller.user_login_post);
module.exports = router;

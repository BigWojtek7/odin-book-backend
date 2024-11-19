const asyncHandler = require('express-async-handler');

const dbUser = require('../db/queries/userQueries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { jwtDecode } = require('jwt-decode');

const issueJWT = require('../config/issueJwt');

const cloudinaryUpload = require('../config/cloudinary');

exports.user_get = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const user = await dbUser.getUser(userId);
  res.json(user);
});

exports.user_profile_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const user = await dbUser.getUser(userId);
  res.json(user);
});

exports.user_create_post = [
  body('first_name', 'First name is required').trim().isLength({ min: 1 }),
  body('last_name', 'Last name is required').trim().isLength({ min: 1 }),
  body('email', 'Email is required').isEmail(),
  body('username', 'Username is required').trim().isLength({ min: 1 }),
  body('password', 'Password is required').trim().isLength({ min: 1 }),
  body('re_password', 'Password does not match')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .trim(),

  asyncHandler(async (req, res) => {
    console.log(req.body.username);
    const username = req.body.username;
    const email = req.body.email;
    const usernameInDatabase = await dbUser.getUserByUsername(username);
    const emailInDatabase = await dbUser.getUserByEmail(email);

    if (usernameInDatabase) {
      res.json({ success: false, msg: [{ msg: 'Username already exists' }] });
      return;
    }

    if (emailInDatabase) {
      res.json({ success: false, msg: [{ msg: 'Email already exists' }] });
      return;
    }

    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const profession = '';
    const about =
      'A few words about you. Your age, Whats your interests etc.  You can change it in a setting section.';
    const avatar = 'https://i.pravatar.cc/500';
    const password = hashedPassword;

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      const user = await dbUser.insertUser(
        firstName,
        lastName,
        email,
        profession,
        about,
        avatar,
        username,
        password
      );
      const tokenObject = issueJWT(user);
      res.json({
        success: true,
        msg: 'User has been created',
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    }
  }),
];

exports.user_login_post = asyncHandler(async (req, res) => {
  const username = req.body.username;
  const user =
    (await dbUser.getUserByUsername(username)) ||
    (await dbUser.getUserByEmail(username));
  console.log(user);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, msg: 'could not find the user' });
  }
  console.log(user.password);

  const match = await bcrypt.compare(req.body.password, user.password);

  if (match) {
    const tokenObject = issueJWT(user);
    res.status(200).json({
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
    });
  } else {
    res
      .status(401)
      .json({ success: false, msg: 'you entered a wrong password' });
  }
});

exports.password_edit = [
  body('current_password', 'Old Password is required').trim().isLength({ min: 1 }),
  body('new_password', 'New Password is required').trim().isLength({ min: 1 }),
  body('confirm_password', 'Passwords do not match')
    .custom((value, { req }) => {
      return value === req.body.new_password;
    })
    .trim(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.params.userid;

    const user = await dbUser.getUserById(userId);
    const match = await bcrypt.compare(req.body.current_password, user[0].password);

    if (!match) {
      return res.status(401).json({
        success: false,
        msg: [{ msg: 'You entered the wrong old password' }],
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    if (req.body.current_password === req.body.new_password) {
      return res.status(401).json({
        success: false,
        msg: [{ msg: 'New and old password are the same' }],
      });
    }
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.json({ success: false, msg: errors.array() });
    } else {
      try {
        await dbUser.updatePassword(hashedPassword, userId);
      } catch (err) {
        next(err);
      }
      res.json({
        success: true,
        msg: [{ msg: 'User password has been updated' }],
      });
    }
  }),
];

exports.profile_edit = [
  body('first_name', 'First name is required').trim().isLength({ min: 1 }),
  body('last_name', 'Last name is required').trim().isLength({ min: 1 }),
  body('email', 'Email is required').isEmail(),
  body('username', 'Username is required').trim().isLength({ min: 1 }),
  body('profession', 'Profession is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userId = jwtDecode(req.headers.authorization).sub;

    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const profession = req.body.profession;
    const username = req.body.username;

    const usernameInDatabase = await dbUser.getUserByUsername(username);
    const emailInDatabase = await dbUser.getUserByEmail(email);
    console.log(emailInDatabase?.id, userId);
  

    if (usernameInDatabase && usernameInDatabase?.id !== userId) {
      res.json({ success: false, msg: [{ msg: 'Username already exists' }] });
      return;
    }

    if (emailInDatabase && emailInDatabase?.id !== userId) {
      res.json({ success: false, msg: [{ msg: 'Email already exists' }] });
      return;
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.json({ success: false, msg: errors.array() });
    } else {
      try {
        await dbUser.updateProfile(
          firstName,
          lastName,
          email,
          profession,
          username,
          userId
        );
      } catch (err) {
        next(err);
      }
      res.json({
        success: true,
        msg: [{ msg: 'User profile has been updated' }],
      });
    }
  }),
];

exports.avatar_post = asyncHandler(async (req, res) => {
  if (req.fileValidationError) {
    return res.json({ success: false, msg: 'Wrong format!' });
  }
  if (typeof req.file === 'undefined') {
    return res.json({ success: false, msg: "You didn't choose an image!" });
  }
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

  const cldRes = await cloudinaryUpload(dataURI);
  console.log(cldRes);

  const userId = jwtDecode(req.headers.authorization).sub;
  await dbUser.updateAvatar(cldRes.secure_url, userId);
  res.js;

  res.json({ success: true, msg: 'Avatar has been updated' });
});

exports.about_edit = [
  body('about', 'About is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userId = jwtDecode(req.headers.authorization).sub;

    const about = req.body.about;
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.json({ success: false, msg: errors.array() });
    } else {
      try {
        await dbUser.updateAbout(about, userId);
      } catch (err) {
        next(err);
      }
      res.json({ success: true, msg: [{ msg: 'About has been updated' }] });
    }
  }),
];

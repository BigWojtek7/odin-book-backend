const asyncHandler = require('express-async-handler');

const dbUser = require('../db/queries/userQueries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

exports.user_get = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const user = await dbUser.getUser(userId);
  res.json(user);
});

exports.user_profile_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid
  const user = await dbUser.getUser(userId);
  res.json(user);
});

exports.users_followers_suggestion = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const allUser = await dbUser.getFollowersSuggestion(userId);
  res.json(allUser);
});

exports.user_followers_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const followers = await dbUser.getFollowers(userId);
  res.json(followers);
});

exports.user_requests_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const requests = await dbUser.getRequests(userId);
  res.json(requests);
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
    const userInDatabase = await dbUser.getUserByUsername(username);

    if (userInDatabase?.username) {
      res.json({ success: false, msg: [{ msg: 'Username already exists' }] });
      return;
    }

    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const profession = '';
    const about =
      'A few words about you. Your age, Whats your interests etc.  You can change it in a setting section.';
    const avatar = 'https://i.pravatar.cc/500';
    const password = hashedPassword;

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      await dbUser.insertUser(
        firstName,
        lastName,
        email,
        profession,
        about,
        avatar,
        username,
        password
      );
      res.json({ success: true, msg: 'User has been created' });
    }
  }),
];

exports.user_follower_post = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const followerId = req.params.followerid;
  await dbUser.insertFollower(userId, followerId);
  await dbUser.deleteRequest(userId);
  res.json({ success: true, msg: 'Follower has been added' });
});

exports.user_login_post = asyncHandler(async (req, res) => {
  console.log(req.body);
  function issueJWT(user) {
    const id = user.id;

    const expiresIn = '1d';

    const payload = {
      sub: id,
      iat: Date.now(),
    };
    const secret = process.env.JWT_SECRET;
    console.log(secret);
    const signedToken = jsonwebtoken.sign(payload, secret, {
      expiresIn: expiresIn,
      // algorithm: 'RS256',
    });

    return {
      token: 'Bearer ' + signedToken,
      expires: expiresIn,
    };
  }

  const username = req.body.username;
  const user = await dbUser.getUserByUsername(username);
  if (!user?.username) {
    return res
      .status(401)
      .json({ success: false, msg: 'could not find the user' });
  }

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
      .json({ success: false, msg: 'you entered the wrong password' });
  }
});

exports.password_edit = [
  body('old_password', 'Old Password is required').trim().isLength({ min: 1 }),
  body('new_password', 'New Password is required').trim().isLength({ min: 1 }),
  body('re_new_password', 'Passwords do not match')
    .custom((value, { req }) => {
      return value === req.body.new_password;
    })
    .trim(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.params.userid;

    const user = await dbUser.getUserById(userId);
    console.log(user, req.body.old_password);
    const match = await bcrypt.compare(req.body.old_password, user[0].password);

    if (!match) {
      return res.status(401).json({
        success: false,
        msg: [{ msg: 'You entered the wrong old password' }],
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    // const newUser = new User({
    //   username: user.username,
    //   password: hashedPassword,
    //   _id: user.id,
    // });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.json({ success: false, msg: errors.array() });
    } else {
      try {
        await dbUser.updatePassword(hashedPassword, userId);
      } catch (err) {
        next(err);
      }
      res.json({ success: true, msg: 'User password has been updated' });
    }
  }),
];

exports.profile_edit = [
  body('first_name', 'First name is required').trim().isLength({ min: 1 }),
  body('last_name', 'Last name is required').trim().isLength({ min: 1 }),
  body('email', 'Email is required').isEmail(),
  body('username', 'Username is required').trim().isLength({ min: 1 }),
  body('profession', 'Profession is required').trim().isLength({ min: 1 }),
  body('about', 'About is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const userId = jwtDecode(req.headers.authorization).sub;

    // const user = await dbUser.getUserById(userId);
    // console.log(user, req.body.old_password)
    // const match = await bcrypt.compare(req.body.old_password, user[0].password);

    // if (!match) {
    //   return res.status(401).json({
    //     success: false,
    //     msg: [{ msg: 'You entered the wrong old password' }],
    //   });
    // }
    // const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    // const newUser = new User({
    //   username: user.username,
    //   password: hashedPassword,
    //   _id: user.id,
    // });
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const profession = req.body.profession;
    const about = req.body.about;
    const username = req.body.username;
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
          about,
          username,
          userId
        );
      } catch (err) {
        next(err);
      }
      res.json({ success: true, msg: 'User profile has been updated' });
    }
  }),
];

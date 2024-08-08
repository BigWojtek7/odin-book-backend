const asyncHandler = require('express-async-handler');

const dbUser = require('../db/queries/userQueries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
// const { jwtDecode } = require('jwt-decode');

exports.user_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  console.log(userId);
  const user = await dbUser.getUser(userId);
  res.json(user);
});

exports.user_followers_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  console.log(userId);
  const followers = await dbUser.getFollowers(userId);
  res.json(followers);
});

exports.user_requests_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  console.log(userId);
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
    const about = 'A few words about you';
    const avatar = 'https://i.pravatar.cc/500';
    const password = hashedPassword;

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      await dbUser.insertUser(
        firstName,
        lastName,
        email,
        about,
        avatar,
        username,
        password
      );
      res.json({ success: true });
    }
  }),
];

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

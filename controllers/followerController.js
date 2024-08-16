const asyncHandler = require('express-async-handler');

const dbFollower = require('../db/queries/followerQueries');
const dbRequest = require('../db/queries/requestQueries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

exports.users_followers_suggestion = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const allUser = await dbFollower.getFollowersSuggestion(userId);
  res.json(allUser);
});

exports.user_followers_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const followers = await dbFollower.getFollowers(userId);
  res.json(followers);
});

exports.user_followers_delete = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const followerId = req.params.followerid;
  await dbFollower.deleteFollower(userId, followerId);
  res.json({ success: true, msg: 'User has been unfollowed' });
});

exports.user_follower_post = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const followerId = req.params.followerid;
  await dbFollower.insertFollower(userId, followerId);
  await dbRequest.deleteRequest(userId);
  res.json({ success: true, msg: 'Follower has been added' });
});

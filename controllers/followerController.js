const asyncHandler = require('express-async-handler');

const dbFollower = require('../db/queries/followerQueries');
const dbRequest = require('../db/queries/requestQueries');
const { jwtDecode } = require('jwt-decode');

exports.followers_suggestion_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const allUser = await dbFollower.getFollowersSuggestion(userId);
  res.json(allUser);
});

exports.followers_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const followers = await dbFollower.getFollowers(userId);
  res.json(followers);
});

exports.followers_delete = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const followerId = req.params.followerid;
  await dbFollower.deleteFollower(userId, followerId);
  await dbFollower.deleteFollower(followerId, userId);
  res.json({ success: true, msg: 'User has been unfollowed' });
});

exports.follower_post = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const followerId = req.params.followerid;
  await dbFollower.insertFollower(userId, followerId);
  await dbFollower.insertFollower(followerId, userId);
  await dbRequest.deleteRequest(userId, followerId);
  res.json({ success: true, msg: 'Follower has been added' });
});

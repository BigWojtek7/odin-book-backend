const express = require('express');
const router = express.Router();
const passport = require('passport');

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');

// GET all user posts

router.get(
  '/user/:userid',
  passport.authenticate('jwt', { session: false }),
  post_controller.user_posts
);

// GET all comments for single post

router.get(
  '/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  comment_controller.post_comments
);

// GET all posts from followers user

router.get(
  '/:userid/followers',
  passport.authenticate('jwt', { session: false }),
  post_controller.user_followers_posts
);

// GET posts likes

router.get(
  '/:postid/likes',
  passport.authenticate('jwt', { session: false }),
  post_controller.post_likes_get
);

// POST create post

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  post_controller.post_create_post
);

// ADD POST LIKE

router.post(
  '/:postid/likes',
  passport.authenticate('jwt', { session: false }),
  post_controller.post_add_like
);

// POST CREATE comment

router.post(
  '/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  comment_controller.comment_create_post
);

// Delete Post

router.delete(
  '/:postid',
  passport.authenticate('jwt', { session: false }),
  post_controller.post_delete
);

// DELETE comment

router.delete(
  '/comments/:commentid',
  passport.authenticate('jwt', { session: false }),
  comment_controller.comment_delete
);

module.exports = router;

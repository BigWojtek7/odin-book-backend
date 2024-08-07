const express = require('express');
const router = express.Router();
const passport = require('passport');

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');


// GET all user posts

router.get('/user/:userid', post_controller.user_posts)

// GET all comments for single post

router.get('/:postid/comments', comment_controller.post_comments);


// GET all posts

router.get('/', post_controller.all_posts);

//GET single post

router.get('/:postid', post_controller.single_post);



// POST create post

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  post_controller.post_create_post
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

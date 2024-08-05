const dbPosts = require('../db/queries/postsQueries');
const dbComments = require('../db/queries/commentsQueries');

const { jwtDecode } = require('jwt-decode');

const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

exports.all_posts = asyncHandler(async (req, res) => {
  const allPosts = await dbPosts.getAllPosts();
  console.log(allPosts);
  res.json(allPosts);
});

exports.single_post = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const post = await dbPosts.getSinglePost(postId);
  res.json(post);
});

// create post

exports.post_create_post = [
  body('title', 'title is required').trim().isLength({ min: 1 }),
  body('content', 'content is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res) => {
    const userId = jwtDecode(req.headers.authorization).sub;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.json(errors.array());
    } else {
      const title = req.body.title;
      const content = req.body.content;
      const date = new Date();
      const user = userId;
      await dbPosts.insertPost(title, content, date, user);

      res.json('Post saved');
    }
  }),
];

// delete post

exports.post_delete = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const comment = await dbComments.deleteAllPostsComments(postId);
  const post = await dbPosts.deletePost(postId);

  console.log('1', post, '2', comment);
  res.json('Post deleted');
});


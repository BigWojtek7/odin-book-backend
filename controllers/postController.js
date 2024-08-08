const dbPosts = require('../db/queries/postsQueries');
const dbComments = require('../db/queries/commentsQueries');

const { jwtDecode } = require('jwt-decode');

const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

exports.all_posts = asyncHandler(async (req, res) => {
  const allPosts = await dbPosts.getAllPosts();
  res.json(allPosts);
});

exports.user_posts = asyncHandler(async (req, res) => {
  const userId = req.params.userid
  const allUserPosts = await dbPosts.getUserPosts(userId);
  res.json(allUserPosts);
});

exports.user_followers_posts = asyncHandler(async (req, res) => {
  const userId = req.params.userid
  const allFollowersPosts = await dbPosts.getFollowersPosts(userId);
  res.json(allFollowersPosts);
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


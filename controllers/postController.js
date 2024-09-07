const dbPosts = require('../db/queries/postQueries');
const dbComments = require('../db/queries/commentQueries');

const { jwtDecode } = require('jwt-decode');

const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

exports.all_posts = asyncHandler(async (req, res) => {
  const allPosts = await dbPosts.getAllPosts();
  res.json(allPosts);
});

exports.user_posts = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const allUserPosts = await dbPosts.getUserPosts(userId);
  res.json(allUserPosts);
});

exports.user_followers_posts = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const allFollowersPosts = await dbPosts.getFollowersPosts(userId);
  res.json(allFollowersPosts);
});

exports.single_post = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const post = await dbPosts.getSinglePost(postId);
  res.json(post);
});

exports.post_likes_get = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const post = await dbPosts.getPostLikes(postId);
  res.json(post);
});

// create post

exports.post_create_post = [
  body('content', 'content is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res) => {
    const userId = jwtDecode(req.headers.authorization).sub;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.json({ success: false, msg: errors.array() });
    } else {
      const content = req.body.content;
      const date = new Date();
      const user = userId;
      await dbPosts.insertPost(user, content, date);
      res.json({ success: true, msg: [{ msg: 'Post has been saved' }] });
    }
  }),
];

exports.post_add_like = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const postId = req.params.postid;
  const addLike = await dbPosts.insertPostLike(userId, postId);
  if (addLike.length === 0) {
    return res.json({ success: false, msg: 'You already liked this post' });
  }
  res.json({ success: true, msg: 'Like has been added' });
});

// delete post

exports.post_delete = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const postLikes = await dbPosts.deleteAllPostsLikes(postId);
  const comment = await dbComments.deleteAllPostsComments(postId);
  const post = await dbPosts.deletePost(postId);

  console.log('1', post, '2', comment, '3', postLikes);
  res.json({ success: true, msg: 'Post has been deleted' });
});

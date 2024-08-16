// const Post = require('../models/post')
const dbComments = require('../db/queries/commentQueries');
const { jwtDecode } = require('jwt-decode');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.post_comments = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const postComments = await dbComments.getCommentsByPostId(postId);
  res.json(postComments);
});

exports.comment_create_post = [
  body('content', 'content is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors.array());
    } else {
      const userId = jwtDecode(req.headers.authorization).sub;
      const content = req.body.content;
      const date = new Date();
      const postId = req.params.postid;
      await dbComments.insertComment(userId, postId, content, date);
      res.json({ success: true, msg: 'Comment has been saved' });
    }
  }),
];

exports.comment_delete = asyncHandler(async (req, res) => {
  const commentId = req.params.commentid;
  await dbComments.deleteComment(commentId);
  res.json('Comment deleted');
});

const pool = require('../pool');

async function getCommentsByPostId(postId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS AUTHOR_NAME,
      U.AVATAR_URL,
      TO_CHAR(C.DATE, 'DD-MM-YYYY HH24:MI') AS DATE_FORMAT,
      C.CONTENT,
      U.ID AS AUTHOR_ID,
      C.ID AS COMMENT_ID
    FROM
      COMMENTS C
      INNER JOIN USERS U ON C.USER_ID = U.ID
    WHERE
      C.POST_ID = $1
    ORDER BY
      C.DATE DESC`,
    [postId]
  );
  return rows;
}

async function insertComment(user, post, content, date) {
  await pool.query(
    `INSERT INTO comments(user_id, post_id, content, date) VALUES($1, $2, $3, $4)`,
    [user, post, content, date]
  );
}

async function deleteComment(commentId) {
  await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
}

async function deleteAllPostsComments(postId) {
  await pool.query('DELETE FROM comments WHERE post_id = $1', [postId]);
}

module.exports = {
  getCommentsByPostId,
  insertComment,
  deleteComment,
  deleteAllPostsComments,
};

const pool = require('../pool');

async function getCommentsByPostId(postId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS AUTHOR,
      U.AVATAR_URL,
      TO_CHAR(C.DATE, 'DD-MM-YYYY HH24:MI') AS DATE_FORMAT,
      C.CONTENT,
      C.ID
    FROM
      COMMENTS C
      INNER JOIN USERS U ON C.USER_ID = U.ID
    WHERE
      C.POST_ID = $1`,
    [postId]
  );
  return rows;
}

async function insertComment(content, date, user, post) {
  await pool.query(
    `INSERT INTO comments(content, date, user_id, post_id) VALUES($1, $2, $3, $4)`,
    [content, date, user, post]
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

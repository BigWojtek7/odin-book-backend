const pool = require('../pool');

async function getAllPosts() {
  const { rows } = await pool.query(
    `SELECT
      POSTS.*,
      USERS.USERNAME,
      TO_CHAR(POSTS.DATE, 'DD-MM-YYYY HH24:MI:SS') AS DATE_FORMAT
    FROM
      POSTS
      INNER JOIN USERS ON POSTS.USER_ID = USERS.ID
    ORDER BY
      POSTS.DATE DESC`
  );
  return rows;
}

async function getUserPosts(userId) {
  const { rows } = await pool.query(
    `SELECT
      P.ID AS POST_ID,
      P.CONTENT,
      (
        SELECT
          COUNT(*)
        FROM
          POST_LIKES pl
        WHERE
          pl.POST_ID = p.id) AS POST_LIKES,
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FULL_NAME,
      TO_CHAR(P.DATE, 'DD-MM-YYYY HH24:MI') AS DATE_FORMAT
    FROM
      POSTS P
      INNER JOIN USERS U ON P.USER_ID = U.ID
    WHERE
      P.USER_ID = $1
    ORDER BY
      P.DATE DESC`,
    [userId]
  );
  return rows;
}

async function getFollowersPosts(userId) {
  const { rows } = await pool.query(
    `SELECT 
      p.id AS post_id,
      u.first_name || ' ' || u.last_name AS author_name,
      u.avatar_url,
	    (
        SELECT
          COUNT(*)
        FROM
          POST_LIKES pl
        WHERE
          pl.POST_ID = p.id) AS POST_LIKES,
      to_char(p.date, 'DD-MM-YYYY HH24:MI') AS post_date,
      p.content AS post_content
    FROM 
      posts p
    JOIN 
      users u ON p.user_id = u.id
    WHERE 
      p.user_id = $1
      OR p.user_id IN (SELECT f.user_follower_id FROM followers f WHERE f.user_id = $1)
    ORDER BY 
      p.date DESC`,
    [userId]
  );
  return rows;
}

async function insertPost(user, content, date) {
  await pool.query(
    'INSERT INTO posts(user_id, content, date) VALUES($1, $2, $3, $4)',
    [user, content, date]
  );
}

async function deletePost(postId) {
  await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
}

module.exports = {
  getAllPosts,
  getUserPosts,
  getFollowersPosts,
  insertPost,
  deletePost,
};

const pool = require('../pool');

async function getAllPosts() {
  const { rows } = await pool.query(
    `SELECT posts.*, users.username, to_char(posts.date, 'DD-MM-YYYY HH24:MI:SS') AS date_format FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.date DESC`
  );
  return rows;
}

async function getUserPosts(userId) {
  const { rows } = await pool.query(
    `SELECT
      P.ID AS POST_ID,
      P.CONTENT,
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

async function insertPost(title, content, date, user) {
  await pool.query(
    'INSERT INTO posts(title, content, date, user_id) VALUES($1, $2, $3, $4)',
    [title, content, date, user]
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

const pool = require('../pool');

async function getUser(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.ID AS USER_ID,
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FULL_NAME,
      U.AVATAR_URL,
      U.Profession,
      U.ABOUT AS ABOUT,
      
      (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS
        WHERE
          USER_ID = U.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      USERS U
    WHERE
      U.ID = $1`,
    [userId]
  );
  return rows[0];
}

async function getFollowers(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FOLLOWER_NAME,
      U.ID,
      AVATAR_URL,
      (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS F2
        WHERE
          F2.USER_FOLLOWER_ID = U.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      FOLLOWERS F
      JOIN USERS U ON F.USER_FOLLOWER_ID = U.ID
    WHERE
      F.USER_ID = $1;`,
    [userId]
  );
  return rows;
}

async function getRequests(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FOLLOWER_NAME,
      U.ID,
      AVATAR_URL,
      (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS F2
        WHERE
          F2.USER_FOLLOWER_ID = U.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      Requests R
      JOIN USERS U ON R.user_sender_id = U.ID
    WHERE
      R.USER_ID = $1;`,
    [userId]
  );
  return rows;
}

async function getAllUser() {
  const { rows } = await pool.query(
    `SELECT
	ID AS USER_ID,
	FIRST_NAME || ' ' || LAST_NAME AS FULL_NAME,
	AVATAR_URL,
	(
		SELECT
			COUNT(*)
		FROM
			FOLLOWERS
		WHERE
			USER_ID = USERS.ID
	) AS USER_FOLLOWERS_COUNT
FROM
	USERS`
  );
  return rows;
}

async function insertUser(
  first_name,
  last_name,
  e_mail,
  about,
  avatar_url,
  username,
  password
) {
  await pool.query(
    'INSERT INTO users (first_name, last_name, e_mail, about, avatar_url, username, password) VALUES ($1, $2, $3)',
    [first_name, last_name, e_mail, about, avatar_url, username, password]
  );
}

async function getUserByUsername(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [
    username,
  ]);
  return rows[0];
}

async function getUserById(userId) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [
    userId,
  ]);
  return rows;
}

module.exports = {
  getUser,
  getFollowers,
  getRequests,
  insertUser,
  getUserByUsername,
  getUserById,
  getAllUser,
};
